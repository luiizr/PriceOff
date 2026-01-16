import { IsString, IsNotEmpty, IsOptional, IsUrl, IsBoolean } from 'class-validator';

/**
 * DTOs para Store
 */
export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsUrl()
  @IsNotEmpty()
  baseUrl: string;

  @IsOptional()
  @IsString()
  scrapingConfig?: string;  // JSON string com seletores
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsUrl()
  baseUrl?: string;

  @IsOptional()
  @IsString()
  scrapingConfig?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StoreResponseDto {
  id: string;
  name: string;
  logo: string;
  baseUrl: string;
  scrapingConfig: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
