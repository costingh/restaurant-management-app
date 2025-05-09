import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Review, InsertReview } from '@shared/schema';

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Review[]> {
    return this.databaseService.getAllReviews();
  }

  async findByRestaurant(restaurantId: number): Promise<Review[]> {
    return this.databaseService.getReviewsByRestaurant(restaurantId);
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.databaseService.getReviewsByUser(userId);
  }

  async findOne(id: number): Promise<Review | undefined> {
    return this.databaseService.getReview(id);
  }

  async create(createReviewDto: InsertReview): Promise<Review> {
    return this.databaseService.createReview(createReviewDto);
  }

  async update(id: number, updateReviewDto: Partial<InsertReview>): Promise<Review | undefined> {
    return this.databaseService.updateReview(id, updateReviewDto);
  }

  async remove(id: number): Promise<boolean> {
    return this.databaseService.deleteReview(id);
  }
}