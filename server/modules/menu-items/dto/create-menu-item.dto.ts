import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuItemDto {
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}