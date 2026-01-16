// import { Injectable, Logger } from '@nestjs/common';
// import { BaseScraper, ScraperConfig, ScraperResult, ScrapedProduct } from './base.scraper';

// /**
//  * Scraper para B2Brazil
//  * Pesquisa produtos no marketplace B2Brazil
//  * Usando dados simulados para desenvolvimento
//  */
// @Injectable()
// export class B2BrazilScraper extends BaseScraper {
//   private readonly logger = new Logger(B2BrazilScraper.name);

//   constructor() {
//     const config: ScraperConfig = {
//       name: 'B2Brazil',
//       baseUrl: 'https://www.b2brazil.com.br/busca',
//       priceSelector: '.price-item',
//       titleSelector: '.product-name',
//       stockSelector: '.estoque',
//       imageSelector: '.product-image',
//       rateLimit: 1500,
//     };

//     super(config);
//   }

//   async search(query: string): Promise<ScraperResult> {
//     try {
//       this.logger.debug(`Pesquisando no B2Brazil: ${query}`);
//       await this.respectRateLimit();

//       const products = this.generateMockProducts(query, 'B2Brazil');
//       const success = products.length > 0;

//       this.logger.debug(`Encontrados ${products.length} produtos no B2Brazil`);

//       return {
//         success,
//         totalFound: products.length,
//         products,
//         query,
//         timestamp: new Date(),
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao pesquisar no B2Brazil: ${error.message}`);
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
//           title: 'iPhone 15 Pro Max 512GB - Titânio Preto',
//           price: 8199.90,
//           productUrl: 'https://b2brazil.com.br/iPhone-15-Pro-Max',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/iphone-15-pro-max.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 15 Pro 256GB - Titânio Preto',
//           price: 7399.90,
//           productUrl: 'https://b2brazil.com.br/iPhone-15-Pro',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/iphone-15-pro.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 14 Pro Max 256GB',
//           price: 6399.90,
//           productUrl: 'https://b2brazil.com.br/iPhone-14-Pro-Max',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/iphone-14-pro-max.jpg',
//           storeName: store,
//         },
//       ],
//       notebook: [
//         {
//           title: 'Notebook Apple MacBook Air M2 13.6"',
//           price: 7999.99,
//           productUrl: 'https://b2brazil.com.br/MacBook-Air-M2',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/macbook-air-m2.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook Dell XPS 13 Intel i7',
//           price: 5699.99,
//           productUrl: 'https://b2brazil.com.br/Dell-XPS-13',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/dell-xps-13.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook Lenovo ThinkPad X1 Carbon',
//           price: 5999.99,
//           productUrl: 'https://b2brazil.com.br/ThinkPad-X1',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/thinkpad-x1.jpg',
//           storeName: store,
//         },
//       ],
//       fone: [
//         {
//           title: 'Fone AirPods Max Apple',
//           price: 4199.99,
//           productUrl: 'https://b2brazil.com.br/AirPods-Max',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/airpods-max.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Fone Sony WH-1000XM5 Preto',
//           price: 2199.99,
//           productUrl: 'https://b2brazil.com.br/Sony-WH-1000XM5',
//           imageUrl: 'https://cdn.b2brazil.com.br/images/sony-wh-1000xm5.jpg',
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
//         title: `Produto ${query} - Premium B2Brazil`,
//         price: 499.99 + Math.random() * 8000,
//         productUrl: `https://b2brazil.com.br/busca?q=${query}`,
//         imageUrl: 'https://cdn.b2brazil.com.br/images/placeholder.jpg',
//         storeName: store,
//       },
//     ];
//   }

//           products.push({
//             title,
//             price,
//             stock,
//             productUrl,
//             imageUrl,
//             storeName: 'B2Brazil',
//           });
//         } catch (error) {
//           this.logger.warn(`Erro ao parsear produto B2Brazil: ${error.message}`);
//         }
//       });

//       this.logger.debug(`Encontrados ${products.length} produtos no B2Brazil`);

//       return {
//         products: products.slice(0, 20),
//         totalResults: products.length,
//         query,
//         storeName: 'B2Brazil',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao fazer scraping do B2Brazil: ${error.message}`);
//       throw new Error(`Erro ao pesquisar no B2Brazil: ${error.message}`);
//     }
//   }

//   async getProductDetails(productUrl: string): Promise<ScrapedProduct> {
//     try {
//       this.logger.debug(`Obtendo detalhes do produto B2Brazil: ${productUrl}`);
//       await this.respectRateLimit();

//       const { data } = await this.httpClient.get(productUrl);
//       const $ = cheerio.load(data);

//       // Título
//       const title = $('h1.product-title').text().trim();

//       // Preço
//       const priceText = $('.product-price-main').text();
//       const price = this.validatePrice(priceText);

//       // Stock
//       const stockText = $('.product-stock').text();
//       const stock = this.parseStock(stockText);

//       // Imagem principal
//       const imageUrl = $('.product-main-image img').attr('src') || '';

//       if (!title || !price) {
//         throw new Error('Não foi possível extrair informações do produto');
//       }

//       return {
//         title,
//         price,
//         stock,
//         imageUrl,
//         productUrl,
//         storeName: 'B2Brazil',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao obter detalhes do produto B2Brazil: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Parse de quantidade em estoque
//    */
//   private parseStock(stockText: string): number {
//     try {
//       const match = stockText.match(/\d+/);
//       return match ? parseInt(match[0], 10) : 0;
//     } catch {
//       return 0;
//     }
//   }
// }
