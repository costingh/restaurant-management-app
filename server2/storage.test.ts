/**
 * Storage Implementation Tests
 * 
 * This file contains tests for the database storage implementation,
 * verifying that database operations work correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from './storage';

// Mock the db module
vi.mock('./db', () => {
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  
  return {
    db: {
      select: () => ({ from: mockSelect, where: mockSelect }),
      insert: () => ({ values: mockInsert, returning: mockInsert }),
      update: () => ({ set: mockUpdate, where: mockUpdate, returning: mockUpdate }),
      delete: () => ({ where: mockDelete, returning: mockDelete }),
    },
  };
});

// Mock schema
vi.mock('@shared/schema', () => {
  return {
    users: { id: {} },
    restaurants: { id: {} },
    menuItems: { restaurantId: {}, id: {} },
    reviews: { restaurantId: {}, userId: {}, id: {} },
    eq: vi.fn(),
    and: vi.fn(),
  };
});

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;
  
  beforeEach(() => {
    // Create a new instance for each test
    storage = new DatabaseStorage();
    
    // Reset mocks
    vi.resetAllMocks();
  });
  
  describe('User operations', () => {
    it('getUser should retrieve user by ID', async () => {
      // Setup mock return value
      const mockUser = { id: 1, username: 'testuser', isAdmin: false };
      const mockDb = require('./db').db;
      
      // Configure mocks to return our test data
      mockDb.select().from().where.mockResolvedValue([mockUser]);
      
      // Execute the method under test
      const result = await storage.getUser(1);
      
      // Verify the result
      expect(result).toEqual(mockUser);
    });
    
    it('createUser should insert and return a new user', async () => {
      // Setup mock return value
      const mockUser = { id: 1, username: 'newuser', isAdmin: false };
      const mockDb = require('./db').db;
      
      // Configure mocks to return our test data
      mockDb.insert().values().returning.mockResolvedValue([mockUser]);
      
      // Execute the method under test
      const result = await storage.createUser({ 
        username: 'newuser', 
        password: 'password123', 
        isAdmin: false 
      });
      
      // Verify the result
      expect(result).toEqual(mockUser);
    });
  });
  
  describe('Restaurant operations', () => {
    it('getAllRestaurants should retrieve all restaurants', async () => {
      // Setup mock return value
      const mockRestaurants = [
        { id: 1, name: 'Restaurant 1' },
        { id: 2, name: 'Restaurant 2' }
      ];
      const mockDb = require('./db').db;
      
      // Configure mocks to return our test data
      mockDb.select().from.mockResolvedValue(mockRestaurants);
      
      // Execute the method under test
      const result = await storage.getAllRestaurants();
      
      // Verify the result
      expect(result).toEqual(mockRestaurants);
    });
    
    it('updateRestaurant should update and return a restaurant', async () => {
      // Setup mock return value
      const mockRestaurant = { id: 1, name: 'Updated Restaurant' };
      const mockDb = require('./db').db;
      
      // Configure mocks to return our test data
      mockDb.update().set().where().returning.mockResolvedValue([mockRestaurant]);
      
      // Execute the method under test
      const result = await storage.updateRestaurant(1, { name: 'Updated Restaurant' });
      
      // Verify the result
      expect(result).toEqual(mockRestaurant);
    });
  });
});