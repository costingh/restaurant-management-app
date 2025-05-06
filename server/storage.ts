import {
  users,
  restaurants,
  menuItems,
  type User,
  type InsertUser,
  type Restaurant,
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem
} from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Restaurant operations
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<boolean>;
  
  // Menu item operations
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  
  private userIdCounter: number = 1;
  private restaurantIdCounter: number = 1;
  private menuItemIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.menuItems = new Map();

    // Create a default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    });

    // Create some sample restaurants for initial data
    this.createRestaurant({
      name: "The Italian Place",
      cuisine: "Italian",
      location: "123 Main St, Anytown",
      phone: "(555) 123-4567",
      openingHours: "Mon-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 9:00 PM",
      description: "Authentic Italian cuisine in a cozy atmosphere.",
      imageUrl: "/images/italian.jpg"
    });

    this.createRestaurant({
      name: "Sushi Express",
      cuisine: "Japanese",
      location: "456 Oak Ave, Anytown",
      phone: "(555) 987-6543",
      openingHours: "Mon-Sun: 11:30 AM - 9:30 PM",
      description: "Fresh sushi and Japanese specialties.",
      imageUrl: "/images/sushi.jpg"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { id, ...insertUser };
    this.users.set(id, user);
    return user;
  }

  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.restaurantIdCounter++;
    const restaurant: Restaurant = { id, ...insertRestaurant };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const restaurant = this.restaurants.get(id);
    if (!restaurant) return undefined;

    const updatedRestaurant = { ...restaurant, ...updateData };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    // Also delete related menu items
    const relatedMenuItems = Array.from(this.menuItems.values())
      .filter(item => item.restaurantId === id)
      .map(item => item.id);
    
    relatedMenuItems.forEach(itemId => this.menuItems.delete(itemId));
    
    return this.restaurants.delete(id);
  }

  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemIdCounter++;
    const menuItem: MenuItem = { id, ...insertMenuItem };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const menuItem = this.menuItems.get(id);
    if (!menuItem) return undefined;

    const updatedMenuItem = { ...menuItem, ...updateData };
    this.menuItems.set(id, updatedMenuItem);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }
}

export const storage = new MemStorage();
