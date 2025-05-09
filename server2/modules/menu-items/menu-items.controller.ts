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
  Query,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { MenuItem } from '../../../shared/schema';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard, AdminGuard)
  create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  async findAll(@Query('restaurantId') restaurantId?: string): Promise<MenuItem[]> {
    if (restaurantId) {
      return this.menuItemsService.findByRestaurant(+restaurantId);
    }
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem | undefined> {
    return this.menuItemsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem | undefined> {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.menuItemsService.remove(+id);
  }
}