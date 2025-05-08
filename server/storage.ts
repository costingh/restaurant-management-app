import {
  users,
  restaurants,
  menuItems,
  reviews,
  type User,
  type InsertUser,
  type Restaurant,
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Storage interface with CRUD operations
/**
 * Storage Interface Definition
 * This interface defines all data access operations for the application.
 * It serves as a contract that any storage implementation must fulfill,
 * providing a clean abstraction between the data layer and business logic.
 */
export interface IStorage {
  /**
   * User Operations
   * Methods for managing user accounts and authentication
   */
  
  /**
   * Retrieves a user by their unique ID
   * @param id The unique identifier of the user
   * @returns A Promise resolving to the user if found, or undefined if not found
   */
  getUser(id: number): Promise<User | undefined>;
  
  /**
   * Retrieves a user by their username
   * @param username The username to search for
   * @returns A Promise resolving to the user if found, or undefined if not found
   */
  getUserByUsername(username: string): Promise<User | undefined>;
  
  /**
   * Creates a new user in the system
   * @param user The user data to insert
   * @returns A Promise resolving to the created user with assigned ID
   */
  createUser(user: InsertUser): Promise<User>;
  
  /**
   * Restaurant Operations
   * Methods for managing restaurant listings
   */
  
  /**
   * Retrieves all restaurants in the system
   * @returns A Promise resolving to an array of all restaurants
   */
  getAllRestaurants(): Promise<Restaurant[]>;
  
  /**
   * Retrieves a restaurant by its unique ID
   * @param id The unique identifier of the restaurant
   * @returns A Promise resolving to the restaurant if found, or undefined if not found
   */
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  
  /**
   * Creates a new restaurant listing
   * @param restaurant The restaurant data to insert
   * @returns A Promise resolving to the created restaurant with assigned ID
   */
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  /**
   * Updates an existing restaurant's information
   * @param id The unique identifier of the restaurant to update
   * @param restaurant The partial restaurant data to update
   * @returns A Promise resolving to the updated restaurant, or undefined if not found
   */
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  
  /**
   * Deletes a restaurant by its ID
   * @param id The unique identifier of the restaurant to delete
   * @returns A Promise resolving to true if successful, false otherwise
   */
  deleteRestaurant(id: number): Promise<boolean>;
  
  /**
   * Menu Item Operations
   * Methods for managing restaurant menu items
   */
  
  /**
   * Retrieves all menu items in the system
   * @returns A Promise resolving to an array of all menu items
   */
  getAllMenuItems(): Promise<MenuItem[]>;
  
  /**
   * Retrieves all menu items for a specific restaurant
   * @param restaurantId The ID of the restaurant whose menu items to retrieve
   * @returns A Promise resolving to an array of menu items
   */
  getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]>;
  
  /**
   * Retrieves a menu item by its unique ID
   * @param id The unique identifier of the menu item
   * @returns A Promise resolving to the menu item if found, or undefined if not found
   */
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  
  /**
   * Creates a new menu item
   * @param menuItem The menu item data to insert
   * @returns A Promise resolving to the created menu item with assigned ID
   */
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  /**
   * Updates an existing menu item's information
   * @param id The unique identifier of the menu item to update
   * @param menuItem The partial menu item data to update
   * @returns A Promise resolving to the updated menu item, or undefined if not found
   */
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  
  /**
   * Deletes a menu item by its ID
   * @param id The unique identifier of the menu item to delete
   * @returns A Promise resolving to true if successful, false otherwise
   */
  deleteMenuItem(id: number): Promise<boolean>;
  
  /**
   * Review Operations
   * Methods for managing user reviews of restaurants
   */
  
  /**
   * Retrieves all reviews in the system
   * @returns A Promise resolving to an array of all reviews
   */
  getAllReviews(): Promise<Review[]>;
  
  /**
   * Retrieves all reviews for a specific restaurant
   * @param restaurantId The ID of the restaurant whose reviews to retrieve
   * @returns A Promise resolving to an array of reviews
   */
  getReviewsByRestaurant(restaurantId: number): Promise<Review[]>;
  
  /**
   * Retrieves all reviews written by a specific user
   * @param userId The ID of the user whose reviews to retrieve
   * @returns A Promise resolving to an array of reviews
   */
  getReviewsByUser(userId: number): Promise<Review[]>;
  
  /**
   * Retrieves a review by its unique ID
   * @param id The unique identifier of the review
   * @returns A Promise resolving to the review if found, or undefined if not found
   */
  getReview(id: number): Promise<Review | undefined>;
  
  /**
   * Creates a new review
   * @param review The review data to insert
   * @returns A Promise resolving to the created review with assigned ID
   */
  createReview(review: InsertReview): Promise<Review>;
  
  /**
   * Updates an existing review's information
   * @param id The unique identifier of the review to update
   * @param review The partial review data to update
   * @returns A Promise resolving to the updated review, or undefined if not found
   */
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  
  /**
   * Deletes a review by its ID
   * @param id The unique identifier of the review to delete
   * @returns A Promise resolving to true if successful, false otherwise
   */
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
