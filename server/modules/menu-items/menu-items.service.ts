import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { 
  type MenuItem, 
  type InsertMenuItem
} from '../../../shared/schema';

@Injectable()
export class MenuItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<MenuItem[]> {
    return this.databaseService.getAllMenuItems();
  }

  async findByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return this.databaseService.getMenuItemsByRestaurant(restaurantId);
  }

  async findOne(id: number): Promise<MenuItem | undefined> {
    return this.databaseService.getMenuItem(id);
  }

  async create(createMenuItemDto: InsertMenuItem): Promise<MenuItem> {
    return this.databaseService.createMenuItem(createMenuItemDto);
  }

  async update(id: number, updateMenuItemDto: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    return this.databaseService.updateMenuItem(id, updateMenuItemDto);
  }

  async remove(id: number): Promise<boolean> {
    return this.databaseService.deleteMenuItem(id);
  }
}