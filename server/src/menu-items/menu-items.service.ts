import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { InsertMenuItem, MenuItem } from '../../shared/schema';

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(private readonly databaseService: DatabaseService) {
    this.logger.log('MenuItemsService initialized');
  }

  async findAll(): Promise<MenuItem[]> {
    try {
      this.logger.log('Finding all menu items');
      const items = await this.databaseService.getAllMenuItems();
      this.logger.log(`Found ${items.length} menu items`);
      return items;
    } catch (error: any) {
      this.logger.error(`Error finding all menu items: ${error.message}`);
      throw error;
    }
  }

  async findByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    try {
      this.logger.log(`Finding menu items for restaurant ${restaurantId}`);
      const items = await this.databaseService.getMenuItemsByRestaurant(restaurantId);
      this.logger.log(`Found ${items.length} menu items`);
      return items;
    } catch (error: any) {
      this.logger.error(`Error finding menu items: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<MenuItem> {
    try {
      this.logger.log(`Finding menu item with id: ${id}`);
      const item = await this.databaseService.getMenuItem(id);
      if (!item) {
        throw new NotFoundException(`Menu item with ID ${id} not found`);
      }
      return item;
    } catch (error: any) {
      this.logger.error(`Error finding menu item: ${error.message}`);
      throw error;
    }
  }

  async create(createMenuItemDto: InsertMenuItem): Promise<MenuItem> {
    try {
      this.logger.log('Creating new menu item');
      const item = await this.databaseService.createMenuItem(createMenuItemDto);
      this.logger.log(`Created menu item with id: ${item.id}`);
      return item;
    } catch (error: any) {
      this.logger.error(`Error creating menu item: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateMenuItemDto: Partial<InsertMenuItem>): Promise<MenuItem> {
    try {
      this.logger.log(`Updating menu item with id: ${id}`);
      const item = await this.databaseService.updateMenuItem(id, updateMenuItemDto);
      if (!item) {
        throw new NotFoundException(`Menu item with ID ${id} not found`);
      }
      return item;
    } catch (error: any) {
      this.logger.error(`Error updating menu item: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing menu item with id: ${id}`);
      const success = await this.databaseService.deleteMenuItem(id);
      if (!success) {
        throw new NotFoundException(`Menu item with ID ${id} not found`);
      }
    } catch (error: any) {
      this.logger.error(`Error removing menu item: ${error.message}`);
      throw error;
    }
  }
}
