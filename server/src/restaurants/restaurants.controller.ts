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
  NotFoundException,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { InsertRestaurant, insertRestaurantSchema } from '../../shared/schema';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const restaurant = await this.restaurantsService.findOne(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(
    @Body(new ZodValidationPipe(insertRestaurantSchema)) createDto: InsertRestaurant,
  ) {
    return this.restaurantsService.create(createDto);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(insertRestaurantSchema.partial())) updateDto: Partial<InsertRestaurant>,
  ) {
    const restaurant = await this.restaurantsService.update(id, updateDto);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }
}
