import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { InsertReview } from '@shared/schema';

export class CreateReviewDto implements InsertReview {
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}