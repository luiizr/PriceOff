// /**
//  * Interface abstrata para Scrapers
//  * Define o contrato que todos os scrapers devem seguir
//  */
// export interface ScraperConfig {
//   name: string;
//   baseUrl: string;
//   priceSelector: string;
//   titleSelector: string;
//   stockSelector?: string;
//   imageSelector?: string;
//   urlSelector?: string;
//   rateLimit?: number; // ms entre requisições
// }

// export interface ScrapedProduct {
//   title: string;
//   price: number;
//   stock?: number;
//   imageUrl?: string;
//   productUrl: string;
//   storeName: string;
//   originalData?: any;
// }

// export interface ScraperResult {
//   products: ScrapedProduct[];
//   totalResults: number;
//   query: string;
//   storeName: string;
// }

// export abstract class BaseScraper {
//   protected config: ScraperConfig;
//   protected rateLimit: number;
//   private lastRequestTime: number = 0;

//   constructor(config: ScraperConfig) {
//     this.config = config;
//     this.rateLimit = config.rateLimit || 1000; // 1 segundo por padrão
//   }

//   /**
//    * Aguarda rate limit antes de fazer requisição
//    */
//   protected async respectRateLimit(): Promise<void> {
//     const now = Date.now();
//     const timeSinceLastRequest = now - this.lastRequestTime;
    
//     if (timeSinceLastRequest < this.rateLimit) {
//       await new Promise(resolve => 
//         setTimeout(resolve, this.rateLimit - timeSinceLastRequest)
//       );
//     }
    
//     this.lastRequestTime = Date.now();
//   }

//   /**
//    * Método abstrato que deve ser implementado por cada scraper
//    */
//   abstract search(query: string): Promise<ScraperResult>;

//   /**
//    * Método abstrato para obter detalhes do produto
//    */
//   abstract getProductDetails(productUrl: string): Promise<ScrapedProduct>;

//   /**
//    * Método para construir URL de pesquisa
//    */
//   protected buildSearchUrl(query: string): string {
//     const encodedQuery = encodeURIComponent(query);
//     return `${this.config.baseUrl}?q=${encodedQuery}`;
//   }

//   /**
//    * Validar se o preço é válido
//    */
//   protected validatePrice(priceStr: string): number | null {
//     try {
//       // Remove caracteres especiais e converte para número
//       const cleanPrice = parseFloat(
//         priceStr.replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.')
//       );
//       return isNaN(cleanPrice) ? null : cleanPrice;
//     } catch {
//       return null;
//     }
//   }

//   /**
//    * Limpar HTML de strings
//    */
//   protected stripHtml(html: string): string {
//     return html.replace(/<[^>]*>/g, '').trim();
//   }
// }
