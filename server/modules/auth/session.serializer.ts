import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../../shared/schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: Function): Promise<any> {
    try {
      const user = await this.usersService.findOne(userId);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}