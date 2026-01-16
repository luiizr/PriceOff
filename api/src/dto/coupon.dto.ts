import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

/**
 * DTOs para Coupon
 */
export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  productStoreLinkId: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  source?: string;
}

export class CouponResponseDto {
  id: string;
  productStoreLinkId: string;
  code: string;
  discountValue: number;
  discountPercentage: number;
  description: string;
  expiresAt: Date;
  isActive: boolean;
  timesUsed: number;
  source: string;
  discoveredAt: Date;
  updatedAt: Date;
}

export class CouponWithProductDto extends CouponResponseDto {
  productName?: string;
  storeName?: string;
  productUrl?: string;
  currentPrice?: number;
}
