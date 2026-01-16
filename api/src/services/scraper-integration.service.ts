// import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import { ScraperOrchestratorService } from '../scrapers/scraper-orchestrator.service';
// import { StoreRepository } from '../repositories/store.repository';
// import { ProductRepository } from '../repositories/product.repository';
// import { ProductStoreLinkRepository } from '../repositories/product-store-link.repository';
// import { PriceHistoryRepository } from '../repositories/price-history.repository';
// import {
//   SearchProductDto,
//   SearchMultipleStoresDto,
//   GetProductDetailsDto,
//   ScrapedProductDto,
//   ScraperResultDto,
//   MultiStoreSearchResultDto,
// } from '../dto/scraper.dto';
// import { Store } from '../entities/store.entity';

// /**
//  * SERVICE - Integração de Web Scraping + Persistência
//  * Faz a orquestração entre scrapers e repositories
//  * Camada de negócio: obtém dados dos scrapers e salva no BD
//  */
// @Injectable()
// export class ScraperIntegrationService {
//   private readonly logger = new Logger(ScraperIntegrationService.name);

//   constructor(
//     private scraperOrchestrator: ScraperOrchestratorService,
//     private storeRepository: StoreRepository,
//     private productRepository: ProductRepository,
//     private productStoreLinkRepository: ProductStoreLinkRepository,
//     private priceHistoryRepository: PriceHistoryRepository,
//   ) {
//     this.initializeStores();
//   }

//   /**
//    * Inicializar lojas no banco se não existirem
//    */
//   private async initializeStores(): Promise<void> {
//     const storesData: Array<Partial<Store>> = [
//       {
//         name: 'Amazon',
//         logo: 'amazon',
//         baseUrl: 'https://www.amazon.com.br',
//         scrapingConfig: JSON.stringify({
//           selector: 'div.s-result-item',
//           titleSelector: 'h2 > a > span',
//           priceSelector: '[data-a-price-whole]',
//         }),
//         isActive: true,
//       },
//       {
//         name: 'B2Brazil',
//         logo: 'b2brazil',
//         baseUrl: 'https://www.b2brazil.com.br',
//         scrapingConfig: JSON.stringify({
//           selector: '.product-item',
//           titleSelector: '.product-name',
//           priceSelector: '.price-item',
//         }),
//         isActive: true,
//       },
//       {
//         name: 'OLX',
//         logo: 'olx',
//         baseUrl: 'https://www.olx.com.br',
//         scrapingConfig: JSON.stringify({
//           selector: '[data-testid="item"]',
//           titleSelector: 'h2',
//           priceSelector: '[data-testid="ad-price"]',
//         }),
//         isActive: true,
//       },
//     ];

//     for (const storeData of storesData) {
//       const existing = await this.storeRepository.findByName(storeData.name!);
//       if (!existing) {
//         await this.storeRepository.create(storeData);
//         this.logger.log(`Loja inicializada: ${storeData.name}`);
//       }
//     }
//   }

//   /**
//    * Pesquisar em uma loja e salvar resultados
//    */
//   async searchInStore(searchDto: SearchProductDto): Promise<ScraperResultDto> {
//     if (!searchDto.query || searchDto.query.trim().length === 0) {
//       throw new BadRequestException('Query não pode estar vazia');
//     }

//     const store = searchDto.store || 'amazon';

//     try {
//       // 1. Buscar resultados do scraper
//       const scrapedResults =
//         await this.scraperOrchestrator.searchInStore(
//           searchDto.query,
//           store,
//         );

//       // 2. Obter loja do banco
//       const storeEntity = await this.storeRepository.findByName(
//         scrapedResults.storeName,
//       );

//       // 3. Salvar produtos e criar links
//       const savedProducts: ScrapedProductDto[] = [];
//       for (const scrapedProduct of scrapedResults.products) {
//         const product = await this.productRepository.findOrCreateByName(
//           scrapedProduct.title,
//           '',
//           '',
//           scrapedProduct.imageUrl,
//         );

//         // Criar/atualizar link produto-loja
//         const link =
//           await this.productStoreLinkRepository.findOrCreate(
//             product.id,
//             storeEntity!.id,
//             scrapedProduct.productUrl,
//             scrapedProduct.price,
//             scrapedProduct.stock,
//           );

//         // Registrar histórico de preço
//         await this.priceHistoryRepository.create({
//           productStoreLinkId: link.id,
//           price: scrapedProduct.price,
//           stock: scrapedProduct.stock,
//           hasCoupon: false,
//         });

//         savedProducts.push(scrapedProduct);
//       }

//       this.logger.log(
//         `${savedProducts.length} produtos salvos de ${scrapedResults.storeName}`,
//       );

//       return {
//         ...scrapedResults,
//         products: savedProducts,
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao pesquisar: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Pesquisar em múltiplas lojas e salvar resultados
//    */
//   async searchInMultipleStores(
//     searchDto: SearchMultipleStoresDto,
//   ): Promise<MultiStoreSearchResultDto> {
//     if (!searchDto.query || searchDto.query.trim().length === 0) {
//       throw new BadRequestException('Query não pode estar vazia');
//     }

//     try {
//       // 1. Buscar resultados dos scrapers
//       const scrapedResults =
//         await this.scraperOrchestrator.searchInMultipleStores(
//           searchDto.query,
//           searchDto.stores,
//         );

//       // 2. Salvar produtos de todos os resultados
//       for (const result of scrapedResults.results) {
//         const storeEntity = await this.storeRepository.findByName(
//           result.storeName,
//         );

//         for (const scrapedProduct of result.products) {
//           const product = await this.productRepository.findOrCreateByName(
//             scrapedProduct.title,
//             '',
//             '',
//             scrapedProduct.imageUrl,
//           );

//           // Criar/atualizar link
//           const link =
//             await this.productStoreLinkRepository.findOrCreate(
//               product.id,
//               storeEntity!.id,
//               scrapedProduct.productUrl,
//               scrapedProduct.price,
//               scrapedProduct.stock,
//             );

//           // Registrar histórico
//           await this.priceHistoryRepository.create({
//             productStoreLinkId: link.id,
//             price: scrapedProduct.price,
//             stock: scrapedProduct.stock,
//             hasCoupon: false,
//           });
//         }
//       }

//       this.logger.log(
//         `${scrapedResults.totalProducts} produtos salvos de múltiplas lojas`,
//       );

//       // Calcular bestDeals
//       const allProducts = scrapedResults.results.flatMap(r =>
//         r.products.map(p => ({
//           storeName: r.storeName,
//           productTitle: p.title,
//           price: p.price,
//           productUrl: p.productUrl,
//           savings: scrapedResults.aggregatedAveragePrice - p.price,
//         })),
//       );

//       const bestDeals = allProducts
//         .sort((a, b) => b.savings - a.savings)
//         .slice(0, 5);

//       return {
//         query: scrapedResults.query,
//         results: scrapedResults.results,
//         aggregatedLowestPrice: scrapedResults.aggregatedLowestPrice,
//         aggregatedAveragePrice: scrapedResults.aggregatedAveragePrice,
//         totalProducts: scrapedResults.totalProducts,
//         bestDeals,
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao pesquisar múltiplas lojas: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Obter detalhes de um produto e salvar
//    */
//   async getProductDetails(
//     detailsDto: GetProductDetailsDto,
//   ): Promise<ScrapedProductDto> {
//     if (!detailsDto.productUrl || !detailsDto.store) {
//       throw new BadRequestException('productUrl e store são obrigatórios');
//     }

//     try {
//       // 1. Obter detalhes do scraper
//       const productDetails =
//         await this.scraperOrchestrator.getProductDetails(
//           detailsDto.productUrl,
//           detailsDto.store,
//         );

//       // 2. Salvar produto se não existir
//       const product = await this.productRepository.findOrCreateByName(
//         productDetails.title,
//         '',
//         '',
//         productDetails.imageUrl,
//       );

//       // 3. Obter loja
//       const storeEntity = await this.storeRepository.findByName(
//         productDetails.storeName,
//       );

//       // 4. Criar/atualizar link
//       const link = await this.productStoreLinkRepository.findOrCreate(
//         product.id,
//         storeEntity!.id,
//         productDetails.productUrl,
//         productDetails.price,
//         productDetails.stock,
//       );

//       // 5. Registrar histórico
//       await this.priceHistoryRepository.create({
//         productStoreLinkId: link.id,
//         price: productDetails.price,
//         stock: productDetails.stock,
//         hasCoupon: false,
//       });

//       this.logger.log(`Detalhes obtidos e salvos: ${productDetails.title}`);

//       return productDetails;
//     } catch (error) {
//       this.logger.error(`Erro ao obter detalhes: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Obter histórico de preço de um produto
//    */
//   async getPriceHistory(productStoreLinkId: string, days: number = 30) {
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     const history = await this.priceHistoryRepository.findByDateRange(
//       productStoreLinkId,
//       startDate,
//       endDate,
//     );

//     return {
//       productStoreLinkId,
//       days,
//       entries: history,
//       minPrice: Math.min(...history.map((h) => h.price)),
//       maxPrice: Math.max(...history.map((h) => h.price)),
//       averagePrice:
//         history.reduce((sum, h) => sum + h.price, 0) / history.length || 0,
//     };
//   }

//   /**
//    * Obter todos os produtos do BD
//    */
//   async getAllProducts() {
//     const products = await this.productRepository.findAll();
//     return {
//       total: products.length,
//       products,
//     };
//   }

//   /**
//    * Buscar produtos por nome
//    */
//   async searchProducts(query: string) {
//     const products = await this.productRepository.searchByName(query);
//     return {
//       query,
//       total: products.length,
//       products,
//     };
//   }
// }
