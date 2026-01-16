// import { Injectable, Logger } from '@nestjs/common';
// import { BaseScraper, ScraperConfig, ScraperResult, ScrapedProduct } from './base.scraper';

// /**
//  * Scraper para OLX
//  * Pesquisa produtos/anúncios na OLX (usado principalmente para produtos usados)
//  * Usando dados simulados para desenvolvimento
//  */
// @Injectable()
// export class OlxScraper extends BaseScraper {
//   private readonly logger = new Logger(OlxScraper.name);

//   constructor() {
//     const config: ScraperConfig = {
//       name: 'OLX',
//       baseUrl: 'https://www.olx.com.br/brasil',
//       priceSelector: '.price-tag',
//       titleSelector: '.item-title',
//       rateLimit: 1500,
//     };

//     super(config);
//   }

//   async search(query: string): Promise<ScraperResult> {
//     try {
//       this.logger.debug(`Pesquisando na OLX: ${query}`);
//       await this.respectRateLimit();

//       const products = this.generateMockProducts(query, 'OLX');
//       const success = products.length > 0;

//       this.logger.debug(`Encontrados ${products.length} produtos na OLX`);

//       return {
//         success,
//         totalFound: products.length,
//         products,
//         query,
//         timestamp: new Date(),
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao pesquisar na OLX: ${error.message}`);
//       return {
//         success: false,
//         totalFound: 0,
//         products: [],
//         query,
//         timestamp: new Date(),
//       };
//     }
//   }

//   private generateMockProducts(query: string, store: string): ScrapedProduct[] {
//     const mockData: { [key: string]: ScrapedProduct[] } = {
//       iphone: [
//         {
//           title: 'iPhone 15 Pro Max 256GB - Seminovo',
//           price: 6299.00,
//           productUrl: 'https://olx.com.br/item/iphone-15-pro-max-1234567',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234567_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 14 Pro Max 256GB - Impecável',
//           price: 5199.00,
//           productUrl: 'https://olx.com.br/item/iphone-14-pro-max-1234568',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234568_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 13 Pro 128GB - Com nota',
//           price: 3999.00,
//           productUrl: 'https://olx.com.br/item/iphone-13-pro-1234569',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234569_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 12 64GB - Muito bom',
//           price: 2699.00,
//           productUrl: 'https://olx.com.br/item/iphone-12-1234570',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234570_1.jpg',
//           storeName: store,
//         },
//       ],
//       notebook: [
//         {
//           title: 'Notebook Dell Inspiron 15 - I7 11ª Gen',
//           price: 3299.00,
//           productUrl: 'https://olx.com.br/item/notebook-dell-inspiron-1234571',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234571_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'MacBook Air M1 13" - Pouco uso',
//           price: 5999.00,
//           productUrl: 'https://olx.com.br/item/macbook-air-m1-1234572',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234572_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook Lenovo ThinkPad - I5 10ª',
//           price: 2499.00,
//           productUrl: 'https://olx.com.br/item/thinkpad-1234573',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234573_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook HP Pavilion 15 - AMD Ryzen 5',
//           price: 2899.00,
//           productUrl: 'https://olx.com.br/item/hp-pavilion-1234574',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234574_1.jpg',
//           storeName: store,
//         },
//       ],
//       fone: [
//         {
//           title: 'Fone AirPods Pro - Original com garantia',
//           price: 1299.00,
//           productUrl: 'https://olx.com.br/item/airpods-pro-1234575',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234575_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Fone Sony WH-1000XM4 - Impecável',
//           price: 899.00,
//           productUrl: 'https://olx.com.br/item/sony-wh1000xm4-1234576',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234576_1.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Fone Samsung Galaxy Buds Pro',
//           price: 499.00,
//           productUrl: 'https://olx.com.br/item/galaxy-buds-pro-1234577',
//           imageUrl: 'https://images.olx.com.br/olxcdn/image/1234577_1.jpg',
//           storeName: store,
//         },
//       ],
//     };

//     // Buscar por palavras-chave
//     const lowerQuery = query.toLowerCase();
//     for (const [key, products] of Object.entries(mockData)) {
//       if (lowerQuery.includes(key)) {
//         return products;
//       }
//     }

//     // Retornar produtos genéricos
//     return [
//       {
//         title: `${query} - OLX`,
//         price: 199.99 + Math.random() * 6000,
//         productUrl: `https://olx.com.br/brasil?q=${query}`,
//         imageUrl: 'https://images.olx.com.br/olxcdn/image/placeholder.jpg',
//         storeName: store,
//       },
//     ];
//   }
//         }
//       });

//       this.logger.debug(`Encontrados ${products.length} produtos na OLX`);

//       return {
//         products: products.slice(0, 20),
//         totalResults: products.length,
//         query,
//         storeName: 'OLX',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao fazer scraping da OLX: ${error.message}`);
//       throw new Error(`Erro ao pesquisar na OLX: ${error.message}`);
//     }
//   }

//   async getProductDetails(productUrl: string): Promise<ScrapedProduct> {
//     try {
//       this.logger.debug(`Obtendo detalhes do produto OLX: ${productUrl}`);
//       await this.respectRateLimit();

//       const { data } = await this.httpClient.get(productUrl);
//       const $ = cheerio.load(data);

//       // Título
//       const title = $('h1').first().text().trim();

//       // Preço
//       const priceText = $('[data-testid="ad-price"]').first().text();
//       const price = this.validatePrice(priceText);

//       // Imagem
//       const imageUrl = $('img[alt="Anúncio"]').attr('src') || '';

//       if (!title || !price) {
//         throw new Error('Não foi possível extrair informações do anúncio');
//       }

//       return {
//         title,
//         price,
//         imageUrl,
//         productUrl,
//         storeName: 'OLX',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao obter detalhes do anúncio OLX: ${error.message}`);
//       throw error;
//     }
//   }
// }
