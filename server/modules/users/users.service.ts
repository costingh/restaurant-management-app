import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, InsertUser } from '../../../shared/schema';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    // In a real application, you might want to filter out passwords
    const users = await this.databaseService.getAllUsers();
    return users.map(({ password, ...rest }) => rest as User);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.databaseService.getUser(id);
    if (!user) return undefined;
    
    // Remove password from returned user
    const { password, ...result } = user;
    return result as User;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.databaseService.getUserByUsername(username);
  }

  async create(createUserDto: InsertUser): Promise<User> {
    const user = await this.databaseService.createUser(createUserDto);
    
    // Remove password from returned user
    const { password, ...result } = user;
    return result as User;
  }
}