const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
  category: string;
  price: number;
  rating: number;
  image: string;
  isVeg: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'customer' | 'admin';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id?: number;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'customer' | 'admin';
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('foodhub_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token && token !== 'temp-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return undefined as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.get<Restaurant[]>('/restaurants');
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return this.get<Restaurant>(`/restaurants/${id}`);
  }

  async createRestaurant(restaurant: Omit<Restaurant, 'id' | 'createdAt'>): Promise<Restaurant> {
    return this.post<Restaurant>('/restaurants', restaurant);
  }

  async updateRestaurant(id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> {
    return this.put<Restaurant>(`/restaurants/${id}`, restaurant);
  }

  async deleteRestaurant(id: string): Promise<void> {
    return this.delete<void>(`/restaurants/${id}`);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.get<MenuItem[]>('/menu-items');
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    return this.get<MenuItem>(`/menu-items/${id}`);
  }

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return this.get<MenuItem[]>(`/menu-items/restaurant/${restaurantId}`);
  }

  async createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    return this.post<MenuItem>('/menu-items', menuItem);
  }

  async updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    return this.put<MenuItem>(`/menu-items/${id}`, menuItem);
  }

  async deleteMenuItem(id: string): Promise<void> {
    return this.delete<void>(`/menu-items/${id}`);
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.post<User>('/users/register', userData);
  }

  async login(credentials: LoginRequest): Promise<{ user: User; token?: string }> {
    return this.post<{ user: User; token?: string }>('/users/login', credentials);
  }

  async getUserById(id: string): Promise<User> {
    return this.get<User>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.put<User>(`/users/${id}`, userData);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.get<Order[]>('/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.get<Order>(`/orders/${id}`);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.get<Order[]>(`/orders/user/${userId}`);
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return this.post<Order>('/orders', order);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.put<Order>(`/orders/${id}/status`, { status });
  }
}

export const api = new ApiService();
