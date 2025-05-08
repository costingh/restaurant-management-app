import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMenuItemDto {
  @IsNumber()
  @IsOptional()
  restaurantId?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}