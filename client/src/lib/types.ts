export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  phone: string;
  openingHours: string;
  description?: string;
  imageUrl?: string;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  price: string;
  category: string;
  imageUrl?: string;
}

// Form states
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RestaurantFormData {
  name: string;
  cuisine: string;
  location: string;
  phone: string;
  openingHours: string;
  description?: string;
  imageUrl?: string;
}

export interface MenuItemFormData {
  restaurantId: number;
  name: string;
  description?: string;
  price: string;
  category: string;
  imageUrl?: string;
}
