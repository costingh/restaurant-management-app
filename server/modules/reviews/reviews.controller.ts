import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Review } from '@shared/schema';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll(@Query('restaurantId') restaurantId?: string, @Query('userId') userId?: string): Promise<Review[]> {
    if (restaurantId) {
      return this.reviewsService.findByRestaurant(Number(restaurantId));
    } else if (userId) {
      return this.reviewsService.findByUser(Number(userId));
    }
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review | undefined> {
    return this.reviewsService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review | undefined> {
    return this.reviewsService.update(Number(id), updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async remove(@Param('id') id: string): Promise<void> {
    const success = await this.reviewsService.remove(Number(id));
    if (!success) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
  }
}