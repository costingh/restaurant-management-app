import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../../../shared/schema';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}