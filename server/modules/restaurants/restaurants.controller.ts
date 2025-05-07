import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Restaurant } from '../../../shared/schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard, AdminGuard)
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Restaurant | undefined> {
    return this.restaurantsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant | undefined> {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.restaurantsService.remove(+id);
  }
}