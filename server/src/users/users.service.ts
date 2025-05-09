import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type User, type InsertUser } from '../../shared/schema';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    // This is just a placeholder as we don't have a getAllUsers method in DatabaseService
    // In a real app, you might want to add this method or implement pagination
    return [];
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.databaseService.getUser(id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.databaseService.getUserByUsername(username);
  }

  async create(createUserDto: InsertUser): Promise<User> {
    return this.databaseService.createUser(createUserDto);
  }
}
