import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { foodItems as mockFoodItems } from "@/lib/mockData";

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
  description: string;
  available: boolean;
}

interface DataContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  isInitialized: boolean;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  getRestaurantMenuItems: (restaurantId: string) => MenuItem[];
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const RESTAURANTS_KEY = 'foodhub_restaurants';
const MENU_ITEMS_KEY = 'foodhub_menu_items';
const INITIALIZED_KEY = 'foodhub_data_initialized';

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeData();
    
    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RESTAURANTS_KEY || e.key === MENU_ITEMS_KEY) {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const initializeData = () => {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    const existingRestaurants = localStorage.getItem(RESTAURANTS_KEY);
    const existingMenuItems = localStorage.getItem(MENU_ITEMS_KEY);
    
    // Only load existing data if all pieces are present
    if (isInitialized && existingRestaurants && existingMenuItems) {
      loadData();
      return;
    }
    
    // Create fresh mock data
    const mockRestaurants: Restaurant[] = [];
    const restaurantMap = new Map<string, Restaurant>();
    
    // Extract unique restaurants from mock food items
    mockFoodItems.forEach(item => {
      if (!restaurantMap.has(item.restaurant)) {
        const restaurant: Restaurant = {
          id: `MOCK-${Date.now()}-${restaurantMap.size}`,
          name: item.restaurant,
          location: "Mock Location",
          adminEmail: "mock@foodhub.com",
          rating: item.rating,
          image: item.image,
          createdAt: new Date().toISOString()
        };
        restaurantMap.set(item.restaurant, restaurant);
        mockRestaurants.push(restaurant);
      }
    });

    // Convert mock food items to menu items with restaurant IDs
    const mockMenuItems: MenuItem[] = mockFoodItems.map(item => {
      const restaurant = restaurantMap.get(item.restaurant)!;
      return {
        id: `MOCK-${item.id}`,
        name: item.name,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        rating: item.rating,
        price: item.price,
        image: item.image,
        category: item.category,
        isVeg: item.isVeg,
        offer: item.offer,
        description: item.description,
        available: true
      };
    });

    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(mockRestaurants));
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(mockMenuItems));
    localStorage.setItem(INITIALIZED_KEY, 'true');
    
    setRestaurants(mockRestaurants);
    setMenuItems(mockMenuItems);
    setIsInitialized(true);
  };

  const loadData = () => {
    const restaurantsJson = localStorage.getItem(RESTAURANTS_KEY);
    const menuItemsJson = localStorage.getItem(MENU_ITEMS_KEY);
    
    if (restaurantsJson) {
      setRestaurants(JSON.parse(restaurantsJson));
    }
    
    if (menuItemsJson) {
      setMenuItems(JSON.parse(menuItemsJson));
    }
    
    setIsInitialized(true);
  };

  const addRestaurant = (restaurant: Restaurant) => {
    const updated = [...restaurants, restaurant];
    setRestaurants(updated);
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(updated));
  };

  const updateRestaurant = (id: string, data: Partial<Restaurant>) => {
    const updated = restaurants.map(r => r.id === id ? { ...r, ...data } : r);
    setRestaurants(updated);
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(updated));
  };

  const addMenuItem = (item: MenuItem) => {
    const updated = [...menuItems, item];
    setMenuItems(updated);
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(updated));
  };

  const updateMenuItem = (id: string, data: Partial<MenuItem>) => {
    const updated = menuItems.map(item => item.id === id ? { ...item, ...data } : item);
    setMenuItems(updated);
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(updated));
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    setMenuItems(updated);
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(updated));
  };

  const getRestaurantMenuItems = (restaurantId: string) => {
    return menuItems.filter(item => item.restaurantId === restaurantId);
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <DataContext.Provider value={{
      restaurants,
      menuItems,
      isInitialized,
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
