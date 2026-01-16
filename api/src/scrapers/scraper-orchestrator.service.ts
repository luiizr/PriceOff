// import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import { AmazonScraper } from './amazon.scraper';
// import { B2BrazilScraper } from './b2brazil.scraper';
// import { OlxScraper } from './olx.scraper';
// import { BaseScraper, ScraperResult, ScrapedProduct } from './base.scraper';

// /**
//  * Serviço que orquestra todos os scrapers disponíveis
//  * Permite que o usuário escolha qual loja usar como base
//  */
// @Injectable()
// export class ScraperOrchestratorService {
//   private readonly logger = new Logger(ScraperOrchestratorService.name);
//   private scrapers: Map<string, any>;

//   constructor(
//     private amazonScraper: AmazonScraper,
//     private b2brazilScraper: B2BrazilScraper,
//     private olxScraper: OlxScraper,
//   ) {
//     // Registrar todos os scrapers disponíveis
//     this.scrapers = new Map<string, any>([
//       ['amazon', amazonScraper],
//       ['b2brazil', b2brazilScraper],
//       ['olx', olxScraper],
//     ] as any);

//     this.logger.log('ScraperOrchestratorService inicializado com 3 lojas');
//   }

//   /**
//    * Retorna lista de lojas disponíveis
//    */
//   getAvailableStores(): string[] {
//     return Array.from(this.scrapers.keys());
//   }

//   /**
//    * Pesquisar em uma loja específica
//    * @param query Termo de pesquisa
//    * @param store Nome da loja (amazon, b2brazil, olx)
//    */
//   async searchInStore(query: string, store: string): Promise<ScraperResult> {
//     const storeLower = store.toLowerCase();

//     if (!this.scrapers.has(storeLower)) {
//       throw new BadRequestException(
//         `Loja não encontrada. Lojas disponíveis: ${this.getAvailableStores().join(', ')}`
//       );
//     }

//     const scraper = this.scrapers.get(storeLower);
//     this.logger.debug(`Pesquisando "${query}" na loja: ${store}`);

//     return scraper!.search(query);
//   }

//   /**
//    * Pesquisar em múltiplas lojas e retornar resultados agregados
//    * @param query Termo de pesquisa
//    * @param stores Array de lojas (opcional - se não informar, busca em todas)
//    */
//   async searchInMultipleStores(
//     query: string,
//     stores?: string[],
//   ): Promise<{
//     query: string;
//     results: ScraperResult[];
//     aggregatedLowestPrice: number;
//     aggregatedAveragePrice: number;
//     totalProducts: number;
//   }> {
//     const storesToSearch = stores && stores.length > 0 
//       ? stores.map(s => s.toLowerCase())
//       : this.getAvailableStores();

//     this.logger.debug(`Pesquisando "${query}" em múltiplas lojas: ${storesToSearch.join(', ')}`);

//     const results: ScraperResult[] = [];

//     // Executar buscas em paralelo
//     const searchPromises = storesToSearch.map(store =>
//       this.searchInStore(query, store)
//         .catch(error => {
//           this.logger.warn(`Erro ao pesquisar na loja ${store}: ${error.message}`);
//           return null;
//         })
//     );

//     const searchResults = await Promise.all(searchPromises);
    
//     // Filtrar resultados nulos (erros)
//     searchResults.forEach(result => {
//       if (result) {
//         results.push(result);
//       }
//     });

//     if (results.length === 0) {
//       throw new BadRequestException('Nenhum resultado encontrado em nenhuma loja');
//     }

//     // Agregar preços
//     const allProducts = results.flatMap(r => r.products);
//     const prices = allProducts.map(p => p.price).filter(p => p > 0);

//     const aggregatedLowestPrice = Math.min(...prices);
//     const aggregatedAveragePrice = prices.length > 0
//       ? prices.reduce((a, b) => a + b, 0) / prices.length
//       : 0;

//     return {
//       query,
//       results,
//       aggregatedLowestPrice,
//       aggregatedAveragePrice,
//       totalProducts: allProducts.length,
//     };
//   }

//   /**
//    * Obter detalhes completos de um produto a partir de uma URL
//    * @param productUrl URL do produto
//    * @param store Loja à qual pertence o produto
//    */
//   async getProductDetails(productUrl: string, store: string): Promise<ScrapedProduct> {
//     const storeLower = store.toLowerCase();

//     if (!this.scrapers.has(storeLower)) {
//       throw new BadRequestException(`Loja "${store}" não é suportada`);
//     }

//     const scraper = this.scrapers.get(storeLower);
//     this.logger.debug(`Obtendo detalhes do produto: ${productUrl}`);

//     return scraper!.getProductDetails(productUrl);
//   }

//   /**
//    * Adicionar um novo scraper dinamicamente
//    * Útil para extensão do sistema
//    */
//   registerScraper(name: string, scraper: BaseScraper): void {
//     this.scrapers.set(name.toLowerCase(), scraper);
//     this.logger.log(`Novo scraper registrado: ${name}`);
//   }

//   /**
//    * Verificar saúde de todos os scrapers
//    * Retorna quais estão operacionais
//    */
//   async checkScraperHealth(): Promise<{
//     [storeName: string]: boolean;
//   }> {
//     const health: { [key: string]: boolean } = {};
//     const testQuery = 'teste';

//     for (const [storeName, scraper] of this.scrapers) {
//       try {
//         await scraper.search(testQuery);
//         health[storeName] = true;
//       } catch (error) {
//         health[storeName] = false;
//         this.logger.warn(`Scraper ${storeName} offline: ${error.message}`);
//       }
//     }

//     return health;
//   }
// }
