import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { InsertRestaurant, Restaurant } from '../../shared/schema';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(private readonly databaseService: DatabaseService) {
    this.logger.log('RestaurantsService initialized');
  }

  async findAll(): Promise<Restaurant[]> {
    try {
      this.logger.log('Finding all restaurants');
      const restaurants = await this.databaseService.getAllRestaurants();
      this.logger.log(`Found ${restaurants.length} restaurants`);
      return restaurants;
    } catch (error: any) {
      this.logger.error(`Error finding all restaurants: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<Restaurant | undefined> {
    try {
      this.logger.log(`Finding restaurant with id: ${id}`);
      const restaurant = await this.databaseService.getRestaurant(id);
      this.logger.log(`Found restaurant: ${restaurant ? 'yes' : 'no'}`);
      return restaurant;
    } catch (error: any) {
      this.logger.error(`Error finding restaurant: ${error.message}`);
      throw error;
    }
  }

  async create(createRestaurantDto: InsertRestaurant): Promise<Restaurant> {
    try {
      this.logger.log('Creating new restaurant');
      const restaurant = await this.databaseService.createRestaurant(createRestaurantDto);
      this.logger.log(`Created restaurant with id: ${restaurant.id}`);
      return restaurant;
    } catch (error: any) {
      this.logger.error(`Error creating restaurant: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateRestaurantDto: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    try {
      this.logger.log(`Updating restaurant with id: ${id}`);
      const restaurant = await this.databaseService.updateRestaurant(id, updateRestaurantDto);
      this.logger.log(`Updated restaurant: ${restaurant ? 'yes' : 'no'}`);
      return restaurant;
    } catch (error: any) {
      this.logger.error(`Error updating restaurant: ${error.message}`);
      throw error;
    }
  }
}
