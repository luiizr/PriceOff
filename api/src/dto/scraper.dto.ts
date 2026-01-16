import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

/**
 * DTOs para requisições de scraping
 */
export class SearchProductDto {
  @IsString()
  @IsNotEmpty()
  query: string;  // Termo de busca (ex: "iPhone 15")

  @IsOptional()
  @IsString()
  store?: string;  // Loja específica (amazon, b2brazil, olx)
}

export class SearchMultipleStoresDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @IsArray()
  stores?: string[];  // Lojas a buscar (se vazio, busca todas)
}

export class GetProductDetailsDto {
  @IsString()
  @IsNotEmpty()
  productUrl: string;  // URL do produto

  @IsString()
  @IsNotEmpty()
  store: string;  // Loja da qual extrair detalhes
}

/**
 * DTOs para respostas de scraping
 */
export class ScrapedProductDto {
  title: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  productUrl: string;
  storeName: string;
}

export class ScraperResultDto {
  products: ScrapedProductDto[];
  totalResults: number;
  query: string;
  storeName: string;
}

export class MultiStoreSearchResultDto {
  query: string;
  results: ScraperResultDto[];
  aggregatedLowestPrice: number;
  aggregatedAveragePrice: number;
  totalProducts: number;
  
  // Resumo visual
  bestDeals: Array<{
    storeName: string;
    productTitle: string;
    price: number;
    productUrl: string;
    savings: number;  // Economia comparado ao preço médio
  }>;
}

export class AvailableStoresDto {
  stores: string[];
  description: string;
}

export class ScraperHealthDto {
  [storeName: string]: boolean;
}
