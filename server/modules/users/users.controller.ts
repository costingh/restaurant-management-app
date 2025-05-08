import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
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

  @Get('current')
  @UseGuards(AuthenticatedGuard)
  getCurrentUser(@Session() session: Record<string, any>): Promise<User | undefined> {
    const userId = session.passport?.user;
    if (!userId) {
      return Promise.resolve(undefined);
    }
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  findOne(@Param('id') id: string): Promise<User | undefined> {
    return this.usersService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthenticatedGuard, AdminGuard)
  create(@Body() createUserDto: InsertUser): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}