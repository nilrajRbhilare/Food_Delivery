import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  adminEmail: string;
  rating: number;
  image?: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  offer?: string;
  description?: string;
  available?: boolean;
}

interface DataContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => Promise<void>;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  getRestaurantMenuItems: (restaurantId: string) => MenuItem[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [restaurantsData, menuItemsData] = await Promise.all([
        api.getAllRestaurants(),
        api.getAllMenuItems()
      ]);
      
      setRestaurants(restaurantsData);
      setMenuItems(menuItemsData);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading data:', err);
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const addRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newRestaurant = await api.createRestaurant(restaurant);
      setRestaurants(prev => [...prev, newRestaurant]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add restaurant';
      setError(errorMessage);
      throw err;
    }
  };

  const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
    try {
      setError(null);
      const updatedRestaurant = await api.updateRestaurant(id, data);
      setRestaurants(prev => prev.map(r => r.id === id ? updatedRestaurant : r));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update restaurant';
      setError(errorMessage);
      throw err;
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      setError(null);
      const newItem = await api.createMenuItem(item);
      setMenuItems(prev => [...prev, newItem]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add menu item';
      setError(errorMessage);
      throw err;
    }
  };

  const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
    try {
      setError(null);
      const updatedItem = await api.updateMenuItem(id, data);
      setMenuItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setError(null);
      await api.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu item';
      setError(errorMessage);
      throw err;
    }
  };

  const getRestaurantMenuItems = (restaurantId: string) => {
    return menuItems.filter(item => item.restaurantId === restaurantId);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      restaurants,
      menuItems,
      isInitialized,
      loading,
      error,
      addRestaurant,
      updateRestaurant,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      getRestaurantMenuItems,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
