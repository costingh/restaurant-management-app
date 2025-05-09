import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { InsertMenuItem, insertMenuItemSchema } from '../../shared/schema';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  async findAll() {
    return this.menuItemsService.findAll();
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.menuItemsService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(
    @Body(new ZodValidationPipe(insertMenuItemSchema)) createDto: InsertMenuItem,
  ) {
    return this.menuItemsService.create(createDto);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(insertMenuItemSchema.partial())) updateDto: Partial<InsertMenuItem>,
  ) {
    return this.menuItemsService.update(id, updateDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.menuItemsService.remove(id);
  }
}
