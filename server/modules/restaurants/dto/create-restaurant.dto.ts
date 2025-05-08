import { IsString, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  cuisine: string;

  @IsString()
  location: string;

  @IsString()
  phone: string;

  @IsString()
  openingHours: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}