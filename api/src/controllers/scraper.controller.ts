// import { Controller, Post, Get, Body, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException, Param } from '@nestjs/common';
// import { ScraperOrchestratorService } from '../scrapers/scraper-orchestrator.service';
// import { ScraperIntegrationService } from '../services/scraper-integration.service';
// import {
//   SearchProductDto,
//   SearchMultipleStoresDto,
//   GetProductDetailsDto,
//   ScrapedProductDto,
//   ScraperResultDto,
//   MultiStoreSearchResultDto,
//   AvailableStoresDto,
//   ScraperHealthDto,
// } from '../dto/scraper.dto';

// /**
//  * CONTROLLER - Rotas de Web Scraping para pesquisa de preços
//  * Permite que o usuário escolha uma loja específica ou busque em múltiplas lojas
//  * 
//  * Fluxo: Controller → ScraperIntegrationService → ScraperOrchestratorService + Repositories
//  */
// @Controller('scraper')
// export class ScraperController {
//   constructor(
//     private readonly scraperOrchestrator: ScraperOrchestratorService,
//     private readonly scraperIntegration: ScraperIntegrationService,
//   ) {}

//   /**
//    * GET /scraper/available-stores
//    * Retorna lista de lojas disponíveis para pesquisa
//    */
//   @Get('available-stores')
//   @HttpCode(HttpStatus.OK)
//   async getAvailableStores(): Promise<AvailableStoresDto> {
//     const stores = this.scraperOrchestrator.getAvailableStores();

//     return {
//       stores,
//       description: `${stores.length} lojas disponíveis para pesquisa`,
//     };
//   }

//   /**
//    * POST /scraper/search
//    * Pesquisa em uma loja específica e salva no banco
//    * 
//    * Body:
//    * {
//    *   "query": "iPhone 15 Pro",
//    *   "store": "amazon"  // Loja específica (opcional)
//    * }
//    */
//   @Post('search')
//   @HttpCode(HttpStatus.OK)
//   async searchInStore(@Body() searchDto: SearchProductDto): Promise<ScraperResultDto> {
//     try {
//       // Delegar para o service que orquestra scraper + persistência
//       return await this.scraperIntegration.searchInStore(searchDto);
//     } catch (error) {
//       if (error.status === 400) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         `Erro ao pesquisar: ${error.message}`
//       );
//     }
//   }

//   /**
//    * POST /scraper/search-multiple
//    * Pesquisa em múltiplas lojas e salva resultados
//    * 
//    * Body:
//    * {
//    *   "query": "iPhone 15 Pro",
//    *   "stores": ["amazon", "b2brazil", "olx"]  // Se vazio, busca em todas
//    * }
//    */
//   @Post('search-multiple')
//   @HttpCode(HttpStatus.OK)
//   async searchInMultipleStores(
//     @Body() searchDto: SearchMultipleStoresDto,
//   ): Promise<MultiStoreSearchResultDto> {
//     try {
//       return await this.scraperIntegration.searchInMultipleStores(searchDto);
//     } catch (error) {
//       if (error.status === 400) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         `Erro ao pesquisar em múltiplas lojas: ${error.message}`
//       );
//     }
//   }

//   /**
//    * POST /scraper/product-details
//    * Obter detalhes de um produto e salvar
//    * 
//    * Body:
//    * {
//    *   "productUrl": "https://www.amazon.com.br/...",
//    *   "store": "amazon"
//    * }
//    */
//   @Post('product-details')
//   @HttpCode(HttpStatus.OK)
//   async getProductDetails(
//     @Body() detailsDto: GetProductDetailsDto,
//   ): Promise<ScrapedProductDto> {
//     try {
//       return await this.scraperIntegration.getProductDetails(detailsDto);
//     } catch (error) {
//       if (error.status === 400) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         `Erro ao obter detalhes do produto: ${error.message}`
//       );
//     }
//   }

//   /**
//    * GET /scraper/price-history/:productStoreLinkId
//    * Obter histórico de preços de um produto em uma loja
//    */
//   @Get('price-history/:productStoreLinkId')
//   @HttpCode(HttpStatus.OK)
//   async getPriceHistory(
//     @Param('productStoreLinkId') productStoreLinkId: string,
//   ) {
//     try {
//       return await this.scraperIntegration.getPriceHistory(productStoreLinkId);
//     } catch (error) {
//       throw new InternalServerErrorException(
//         `Erro ao obter histórico: ${error.message}`
//       );
//     }
//   }

//   /**
//    * GET /scraper/products
//    * Listar todos os produtos salvos
//    */
//   @Get('products')
//   @HttpCode(HttpStatus.OK)
//   async getAllProducts() {
//     try {
//       return await this.scraperIntegration.getAllProducts();
//     } catch (error) {
//       throw new InternalServerErrorException(
//         `Erro ao listar produtos: ${error.message}`
//       );
//     }
//   }

//   /**
//    * GET /scraper/products/search/:query
//    * Buscar produtos por nome no banco
//    */
//   @Get('products/search/:query')
//   @HttpCode(HttpStatus.OK)
//   async searchProducts(@Param('query') query: string) {
//     try {
//       return await this.scraperIntegration.searchProducts(query);
//     } catch (error) {
//       throw new InternalServerErrorException(
//         `Erro ao buscar produtos: ${error.message}`
//       );
//     }
//   }

//   /**
//    * GET /scraper/health
//    * Verifica saúde de todos os scrapers
//    */
//   @Get('health')
//   @HttpCode(HttpStatus.OK)
//   async checkHealth(): Promise<ScraperHealthDto> {
//     try {
//       return await this.scraperOrchestrator.checkScraperHealth();
//     } catch (error) {
//       throw new InternalServerErrorException(
//         `Erro ao verificar saúde dos scrapers: ${error.message}`
//       );
//     }
//   }
// }
