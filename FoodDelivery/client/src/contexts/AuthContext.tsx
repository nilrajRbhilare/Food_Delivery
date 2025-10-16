import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: Order[];
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
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<UserData, 'orders'>, addRestaurant?: (restaurant: Restaurant) => void) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<PublicUserData>) => void;
  addOrder: (order: Order) => void;
  adminProfile: AdminData | null;
  updateAdminProfile: (data: Partial<AdminData>) => void;
}

export type { UserData, PublicUserData, AdminData, Order };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'foodhub_users';
const CURRENT_USER_KEY = 'foodhub_current_user';
const ADMIN_PROFILES_KEY = 'foodhub_admin_profiles';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<PublicUserData | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminData | null>(null);

  useEffect(() => {
    const currentUserEmail = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserEmail) {
      const users = getUsersFromStorage();
      const foundUser = users.find(u => u.email === currentUserEmail);
      if (foundUser) {
        const { password, ...publicData } = foundUser;
        setUser(publicData);
        setIsAuthenticated(true);
        
        if (foundUser.userType === 'admin') {
          const adminProfiles = getAdminProfilesFromStorage();
          const profile = adminProfiles[foundUser.email];
          if (profile) {
            setAdminProfile(profile);
          }
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

  const getUsersFromStorage = (): UserData[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsersToStorage = (users: UserData[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const register = (userData: Omit<UserData, 'orders'>, addRestaurant?: (restaurant: Restaurant) => void): boolean => {
    const users = getUsersFromStorage();
    
    if (users.some(u => u.email === userData.email)) {
      return false;
    }

    if (users.some(u => u.username === userData.username)) {
      return false;
    }

    const newUser: UserData = {
      ...userData,
      orders: []
    };

    users.push(newUser);
    saveUsersToStorage(users);

    if (userData.userType === 'admin') {
      const restaurantId = `REST-${Date.now()}`;
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

      // Register restaurant in unified data system
      if (addRestaurant) {
        const restaurant: Restaurant = {
          id: restaurantId,
          name: userData.restaurantName || 'My Restaurant',
          location: userData.restaurantLocation || 'Not Set',
          adminEmail: userData.email,
          rating: 4.0,
          createdAt: new Date().toISOString()
        };
        addRestaurant(restaurant);
      }
    }

    const { password, ...publicData } = newUser;
    setUser(publicData);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, userData.email);
    
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...publicData } = foundUser;
      setUser(publicData);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, email);
      
      if (foundUser.userType === 'admin') {
        const adminProfiles = getAdminProfilesFromStorage();
        const profile = adminProfiles[email];
        if (profile) {
          setAdminProfile(profile);
        }
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAdminProfile(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (userData: Partial<PublicUserData>) => {
    if (user) {
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        saveUsersToStorage(users);
        
        setUser({ ...user, ...userData });
      }
    }
  };

  const addOrder = (order: Order) => {
    if (user) {
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        users[userIndex].orders.unshift(order);
        saveUsersToStorage(users);
        
        setUser({ ...user, orders: users[userIndex].orders });
      }
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, updateUser, addOrder, adminProfile, updateAdminProfile }}>
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
