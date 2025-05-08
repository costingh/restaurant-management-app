import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review, InsertReview } from '@shared/schema';

class CreateReviewDto implements InsertReview {
  userId: number;
  restaurantId: number;
  rating: number;
  content: string;
}

class UpdateReviewDto implements Partial<InsertReview> {
  rating?: number;
  content?: string;
}

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('userId') userId?: string,
  ): Promise<Review[]> {
    if (restaurantId) {
      return this.reviewsService.findByRestaurant(parseInt(restaurantId, 10));
    }
    if (userId) {
      return this.reviewsService.findByUser(parseInt(userId, 10));
    }
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review | undefined> {
    return this.reviewsService.findOne(parseInt(id, 10));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review | undefined> {
    return this.reviewsService.update(parseInt(id, 10), updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const success = await this.reviewsService.remove(parseInt(id, 10));
    if (!success) {
      throw new Error(`Review with ID ${id} not found`);
    }
  }
}