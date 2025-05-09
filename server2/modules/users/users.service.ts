import { Injectable } from '@nestjs/common';
import { 
  User, 
  InsertUser 
} from '../../../shared/schema';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.databaseService.getAllUsers();
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