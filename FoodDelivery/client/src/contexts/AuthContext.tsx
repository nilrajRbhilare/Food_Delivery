import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { Restaurant } from "./DataContext";

interface Order {
  id: string;
  items: string[];
  total: number;
  restaurant: string;
  restaurantId?: string;
  status: "New" | "Preparing" | "On the Way" | "Delivered" | "Denied";
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod?: string;
  orderDate?: string;
}

interface UserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  orders: Order[];
  avatar?: string;
  userType: "customer" | "admin";
  restaurantName?: string;
  restaurantLocation?: string;
}

interface PublicUserData {
  id?: string;
  username?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orders?: Order[];
  avatar?: string;
  userType: "customer" | "admin";
}

interface AdminData {
  restaurantName: string;
  restaurantId: string;
  branches: string;
  location: string;
  contact: string;
  managerName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: PublicUserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<UserData, 'orders'>, addRestaurant?: (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => Promise<void>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<PublicUserData>) => Promise<void>;
  addOrder: (order: Omit<Order, 'id'> & { userId: string }) => Promise<void>;
  adminProfile: AdminData | null;
  updateAdminProfile: (data: Partial<AdminData>) => void;
  loading: boolean;
  error: string | null;
}

export type { UserData, PublicUserData, AdminData, Order };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'foodhub_user';
const TOKEN_KEY = 'foodhub_token';
const ADMIN_PROFILES_KEY = 'foodhub_admin_profiles';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<PublicUserData | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      if (userData.userType === 'admin') {
        const adminProfiles = getAdminProfilesFromStorage();
        const profile = adminProfiles[userData.email];
        if (profile) {
          setAdminProfile(profile);
        }
      }
    }
  }, []);

  const getAdminProfilesFromStorage = (): Record<string, AdminData> => {
    const profilesJson = localStorage.getItem(ADMIN_PROFILES_KEY);
    return profilesJson ? JSON.parse(profilesJson) : {};
  };

  const saveAdminProfile = (email: string, profile: AdminData) => {
    const profiles = getAdminProfilesFromStorage();
    profiles[email] = profile;
    localStorage.setItem(ADMIN_PROFILES_KEY, JSON.stringify(profiles));
  };

  const register = async (
    userData: Omit<UserData, 'orders'>, 
    addRestaurant?: (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => Promise<void>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        userType: userData.userType
      });

      if (userData.userType === 'admin' && addRestaurant) {
        const restaurantId = response.id || `REST-${Date.now()}`;
        const defaultAdminProfile: AdminData = {
          restaurantName: userData.restaurantName || 'My Restaurant',
          restaurantId,
          branches: '1',
          location: userData.restaurantLocation || 'Not Set',
          contact: userData.phone || 'Not Set',
          managerName: userData.name || 'Not Set'
        };
        saveAdminProfile(userData.email, defaultAdminProfile);
        setAdminProfile(defaultAdminProfile);

        await addRestaurant({
          name: userData.restaurantName || 'My Restaurant',
          location: userData.restaurantLocation || 'Not Set',
          adminEmail: userData.email,
          rating: 4.0
        });
      }

      const publicUserData: PublicUserData = {
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        userType: response.userType
      };

      setUser(publicUserData);
      setIsAuthenticated(true);
      localStorage.setItem(USER_KEY, JSON.stringify(publicUserData));
      localStorage.setItem(TOKEN_KEY, 'temp-token');
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.login({ email, password });

      const publicUserData: PublicUserData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        userType: response.user.userType
      };

      setUser(publicUserData);
      setIsAuthenticated(true);
      localStorage.setItem(USER_KEY, JSON.stringify(publicUserData));
      localStorage.setItem(TOKEN_KEY, response.token || 'temp-token');
      
      if (response.user.userType === 'admin') {
        const adminProfiles = getAdminProfilesFromStorage();
        const profile = adminProfiles[email];
        if (profile) {
          setAdminProfile(profile);
        }
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAdminProfile(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateUser = async (userData: Partial<PublicUserData>) => {
    if (user && user.id) {
      try {
        setError(null);
        const updatedUser = await api.updateUser(user.id, userData);
        const publicUserData: PublicUserData = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          userType: updatedUser.userType
        };
        setUser(publicUserData);
        localStorage.setItem(USER_KEY, JSON.stringify(publicUserData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
        setError(errorMessage);
        throw err;
      }
    }
  };

  const addOrder = async (order: Omit<Order, 'id'> & { userId: string }) => {
    try {
      setError(null);
      await api.createOrder({
        userId: order.userId,
        restaurantId: order.restaurantId || '',
        totalAmount: order.total,
        status: order.status,
        deliveryAddress: '',
        items: []
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    }
  };

  const updateAdminProfile = (data: Partial<AdminData>) => {
    if (user && user.userType === 'admin') {
      const updatedProfile = { ...adminProfile, ...data } as AdminData;
      setAdminProfile(updatedProfile);
      saveAdminProfile(user.email, updatedProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      addOrder, 
      adminProfile, 
      updateAdminProfile,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
