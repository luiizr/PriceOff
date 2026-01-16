import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';

/**
 * DTOs para Product
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceCheckCount: number;
  lastPriceCheck: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductWithPricesDto extends ProductResponseDto {
  storePrices: Array<{
    storeId: string;
    storeName: string;
    price: number;
    url: string;
    stock: number;
    isAvailable: boolean;
  }>;
}
