import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, InsertUser } from '../../../shared/schema';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthenticatedGuard, AdminGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('current-user')
  getCurrentUser(@Session() session: Record<string, any>): Promise<User | undefined> {
    if (!session.passport || !session.passport.user) {
      return Promise.resolve(undefined);
    }
    return this.usersService.findOne(session.passport.user);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  findOne(@Param('id') id: string): Promise<User | undefined> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: InsertUser): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}