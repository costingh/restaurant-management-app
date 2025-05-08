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
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
  
  // Review operations
  getAllReviews(): Promise<Review[]>;
  getReviewsByRestaurant(restaurantId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database with a default admin user and example restaurants
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if we have users, if not add a default admin
      const existingUsers = await db.select().from(users);
      if (existingUsers.length === 0) {
        await this.createUser({
          username: "admin",
          password: "admin123",
          isAdmin: true
        });
      }
      
      // Check if we have restaurants, if not add example restaurants
      const existingRestaurants = await db.select().from(restaurants);
      if (existingRestaurants.length === 0) {
        await this.createRestaurant({
          name: "The Italian Place",
          cuisine: "Italian",
          location: "123 Main St, Anytown",
          phone: "(555) 123-4567",
          openingHours: "Mon-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 9:00 PM",
          description: "Authentic Italian cuisine in a cozy atmosphere.",
          imageUrl: "/images/italian.jpg"
        });

        await this.createRestaurant({
          name: "Sushi Express",
          cuisine: "Japanese",
          location: "456 Oak Ave, Anytown",
          phone: "(555) 987-6543",
          openingHours: "Mon-Sun: 11:30 AM - 9:30 PM",
          description: "Fresh sushi and Japanese specialties.",
          imageUrl: "/images/sushi.jpg"
        });
      }
    } catch (error) {
      console.error("Error initializing database data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return await db.select().from(restaurants);
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db.insert(restaurants).values(insertRestaurant).returning();
    return restaurant;
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, id))
      .returning();
    
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    // Menu items will be automatically deleted due to CASCADE constraint
    const result = await db.delete(restaurants).where(eq(restaurants.id, id)).returning();
    return result.length > 0;
  }

  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
    return result.length > 0;
  }

  // Review operations
  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.restaurantId, restaurantId));
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: number, updateData: Partial<InsertReview>): Promise<Review | undefined> {
    const [updatedReview] = await db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, id))
      .returning();
    
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
