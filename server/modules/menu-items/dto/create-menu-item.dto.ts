import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @IsNumber()
  restaurantId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  price: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}