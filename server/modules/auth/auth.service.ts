import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../../../shared/schema';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    // Simple authentication for demo purposes
    // In a real application, you would use bcrypt.compare or similar
    const user = await this.usersService.findByUsername(username);
    
    if (user && user.password === password) {
      // Exclude password from returned user object
      const { password, ...result } = user;
      return result as User;
    }
    
    return null;
  }
}