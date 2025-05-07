import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { 
  users, restaurants, menuItems, 
  type User, type Restaurant, type MenuItem,
  type InsertUser, type InsertRestaurant, type InsertMenuItem 
} from '../../../shared/schema';

@Injectable()
export class DatabaseService {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants);
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db
      .insert(restaurants)
      .values(insertRestaurant)
      .returning();
    return restaurant;
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [restaurant] = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, id))
      .returning();
    return restaurant || undefined;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    const result = await db
      .delete(restaurants)
      .where(eq(restaurants.id, id))
      .returning({ id: restaurants.id });
    return result.length > 0;
  }
  
  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || undefined;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db
      .insert(menuItems)
      .values(insertMenuItem)
      .returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [menuItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    return menuItem || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    return result.length > 0;
  }
}