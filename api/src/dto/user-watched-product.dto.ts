import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

/**
 * DTOs para UserWatchedProduct
 */
export class CreateUserWatchedProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsArray()
  selectedStores?: string[];  // UUIDs de lojas (null = todas)

  @IsNumber()
  @IsNotEmpty()
  targetPrice: number;

  @IsOptional()
  @IsBoolean()
  notifyOnTargetPrice?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnCoupon?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnPriceChange?: boolean;

  @IsOptional()
  @IsNumber()
  priceDropPercentage?: number;
}

export class UpdateUserWatchedProductDto {
  @IsOptional()
  @IsArray()
  selectedStores?: string[];

  @IsOptional()
  @IsNumber()
  targetPrice?: number;

  @IsOptional()
  @IsBoolean()
  notifyOnTargetPrice?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnCoupon?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnPriceChange?: boolean;

  @IsOptional()
  @IsNumber()
  priceDropPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserWatchedProductResponseDto {
  id: string;
  userId: string;
  productId: string;
  productName?: string;
  selectedStores: string[];
  targetPrice: number;
  currentLowestPrice: number;
  isActive: boolean;
  notifyOnTargetPrice: boolean;
  notifyOnCoupon: boolean;
  notifyOnPriceChange: boolean;
  priceDropPercentage: number;
  lastNotifiedAt: Date;
  timesChecked: number;
  lastCheckedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
