import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  User,
  InsertUser,
  Restaurant,
  InsertRestaurant,
  MenuItem,
  InsertMenuItem
} from '../../../shared/schema';
import { storage } from '../../storage';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    // Initialization if needed
  }

  // User operations
  // This is a helper method that is not in the original storage interface
  async getAllUsers(): Promise<User[]> {
    // For now, returning an empty array since storage might not have this method
    return [];
  }

  async getUser(id: number): Promise<User | undefined> {
    return storage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return storage.getUserByUsername(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return storage.createUser(insertUser);
  }

  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return storage.getAllRestaurants();
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return storage.getRestaurant(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    return storage.createRestaurant(insertRestaurant);
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    return storage.updateRestaurant(id, updateData);
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    return storage.deleteRestaurant(id);
  }

  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return storage.getAllMenuItems();
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return storage.getMenuItemsByRestaurant(restaurantId);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return storage.getMenuItem(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    return storage.createMenuItem(insertMenuItem);
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    return storage.updateMenuItem(id, updateData);
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return storage.deleteMenuItem(id);
  }
}