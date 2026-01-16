import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';

/**
 * DTOs para ProductStoreLink
 */
export class CreateProductStoreLinkDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsUrl()
  @IsNotEmpty()
  productUrl: string;

  @IsNumber()
  @IsNotEmpty()
  currentPrice: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;
}

export class UpdateProductStoreLinkDto {
  @IsOptional()
  @IsUrl()
  productUrl?: string;

  @IsOptional()
  @IsNumber()
  currentPrice?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProductStoreLinkResponseDto {
  id: string;
  productId: string;
  storeId: string;
  productUrl: string;
  currentPrice: number;
  stock: number;
  isAvailable: boolean;
  discountPercentage: number;
  lastCheckedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
