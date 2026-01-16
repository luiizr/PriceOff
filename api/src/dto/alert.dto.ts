import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

/**
 * DTOs para Alert
 */
export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userWatchedProductId: string;

  @IsOptional()
  @IsString()
  productStoreLinkId?: string;

  @IsString()
  @IsNotEmpty()
  alertType: string;  // PRICE_DROP, TARGET_REACHED, COUPON_FOUND, BACK_IN_STOCK

  @IsNumber()
  @IsNotEmpty()
  previousPrice: number;

  @IsNumber()
  @IsNotEmpty()
  currentPrice: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateAlertDto {
  @IsOptional()
  @IsBoolean()
  wasNotified?: boolean;

  @IsOptional()
  @IsString()
  status?: string;  // PENDING, SENT, READ
}

export class AlertResponseDto {
  id: string;
  userId: string;
  userWatchedProductId: string;
  productStoreLinkId: string;
  alertType: string;
  previousPrice: number;
  currentPrice: number;
  message: string;
  wasNotified: boolean;
  notifiedAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AlertPriceDropDto extends AlertResponseDto {
  discountPercentage: number;
  storeName?: string;
  productName?: string;
}
