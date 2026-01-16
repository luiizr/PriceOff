import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

/**
 * DTOs para PriceHistory
 */
export class CreatePriceHistoryDto {
  @IsString()
  @IsNotEmpty()
  productStoreLinkId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PriceHistoryResponseDto {
  id: string;
  productStoreLinkId: string;
  price: number;
  discountPercentage: number;
  stock: number;
  hasCoupon: boolean;
  couponCode: string;
  notes: string;
  checkedAt: Date;
}

export class PriceHistoryChartDto {
  productStoreLinkId: string;
  productName: string;
  storeName: string;
  history: Array<{
    price: number;
    date: Date;
    discountPercentage: number;
  }>;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}
