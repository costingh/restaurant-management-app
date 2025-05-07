import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { 
  type Restaurant, 
  type InsertRestaurant
} from '../../../shared/schema';

@Injectable()
export class RestaurantsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Restaurant[]> {
    return this.databaseService.getAllRestaurants();
  }

  async findOne(id: number): Promise<Restaurant | undefined> {
    return this.databaseService.getRestaurant(id);
  }

  async create(createRestaurantDto: InsertRestaurant): Promise<Restaurant> {
    return this.databaseService.createRestaurant(createRestaurantDto);
  }

  async update(id: number, updateRestaurantDto: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    return this.databaseService.updateRestaurant(id, updateRestaurantDto);
  }

  async remove(id: number): Promise<boolean> {
    return this.databaseService.deleteRestaurant(id);
  }
}