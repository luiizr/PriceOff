// import { Injectable, Logger } from '@nestjs/common';
// import { BaseScraper, ScraperConfig, ScraperResult, ScrapedProduct } from './base.scraper';

// /**
//  * Scraper para Amazon
//  * Pesquisa produtos na Amazon Brasil
//  * Usando dados simulados para desenvolvimento
//  */
// @Injectable()
// export class AmazonScraper extends BaseScraper {
//   private readonly logger = new Logger(AmazonScraper.name);

//   constructor() {
//     const config: ScraperConfig = {
//       name: 'Amazon',
//       baseUrl: 'https://www.amazon.com.br/s',
//       priceSelector: '[data-a-price-whole]',
//       titleSelector: 'h2 > a > span',
//       stockSelector: '.a-price-whole',
//       imageSelector: 'img',
//       urlSelector: 'h2 > a',
//       rateLimit: 1000,
//     };

//     super(config);
//   }

//   async search(query: string): Promise<ScraperResult> {
//     try {
//       this.logger.debug(`Pesquisando na Amazon: ${query}`);
//       await this.respectRateLimit();

//       const products = this.generateMockProducts(query, 'Amazon');
//       const success = products.length > 0;

//       this.logger.debug(`Encontrados ${products.length} produtos`);

//       return {
//         success,
//         totalFound: products.length,
//         products,
//         query,
//         timestamp: new Date(),
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao pesquisar na Amazon: ${error.message}`);
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
//           title: 'iPhone 15 Pro Max 256GB Titânio Preto',
//           price: 7499.99,
//           productUrl: 'https://amazon.com.br/iPhone-15-Pro-Max',
//           imageUrl: 'https://m.media-amazon.com/images/I/71pS1UWwElL._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 15 Pro 128GB Titânio Natural',
//           price: 6499.99,
//           productUrl: 'https://amazon.com.br/iPhone-15-Pro',
//           imageUrl: 'https://m.media-amazon.com/images/I/71NTzRUgkwL._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 14 Pro 256GB Preto Profundo',
//           price: 5299.99,
//           productUrl: 'https://amazon.com.br/iPhone-14-Pro',
//           imageUrl: 'https://m.media-amazon.com/images/I/71pS1UWwElL._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'iPhone 14 128GB Azul',
//           price: 4199.99,
//           productUrl: 'https://amazon.com.br/iPhone-14',
//           imageUrl: 'https://m.media-amazon.com/images/I/71pS1UWwElL._AC_SX679_.jpg',
//           storeName: store,
//         },
//       ],
//       notebook: [
//         {
//           title: 'Notebook Dell Inspiron 15 I7 16GB 512GB SSD',
//           price: 4499.99,
//           productUrl: 'https://amazon.com.br/Notebook-Dell-Inspiron',
//           imageUrl: 'https://m.media-amazon.com/images/I/71abc123def._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook Lenovo IdeaPad 3 Ryzen 5 8GB 256GB',
//           price: 2799.99,
//           productUrl: 'https://amazon.com.br/Notebook-Lenovo-IdeaPad',
//           imageUrl: 'https://m.media-amazon.com/images/I/71xyz789abc._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook HP 15 Intel i5 8GB 256GB SSD',
//           price: 2999.99,
//           productUrl: 'https://amazon.com.br/Notebook-HP-15',
//           imageUrl: 'https://m.media-amazon.com/images/I/71lmn456opq._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Notebook ASUS VivoBook 15 Ryzen 7 16GB 512GB',
//           price: 3599.99,
//           productUrl: 'https://amazon.com.br/Notebook-ASUS-VivoBook',
//           imageUrl: 'https://m.media-amazon.com/images/I/71rst789uvw._AC_SX679_.jpg',
//           storeName: store,
//         },
//       ],
//       fone: [
//         {
//           title: 'AirPods Pro 2ª Geração',
//           price: 1899.99,
//           productUrl: 'https://amazon.com.br/AirPods-Pro',
//           imageUrl: 'https://m.media-amazon.com/images/I/71abc123def._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Samsung Galaxy Buds2 Pro Preto',
//           price: 999.99,
//           productUrl: 'https://amazon.com.br/Samsung-Galaxy-Buds',
//           imageUrl: 'https://m.media-amazon.com/images/I/71xyz789abc._AC_SX679_.jpg',
//           storeName: store,
//         },
//         {
//           title: 'Sony WH-CH720 Headphone Sem Fio',
//           price: 399.99,
//           productUrl: 'https://amazon.com.br/Sony-WH-CH720',
//           imageUrl: 'https://m.media-amazon.com/images/I/71lmn456opq._AC_SX679_.jpg',
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

//     // Retornar produtos genéricos se não encontrar match
//     return [
//       {
//         title: `Produto genérico: ${query}`,
//         price: 299.99 + Math.random() * 5000,
//         productUrl: `https://amazon.com.br/s?k=${query}`,
//         imageUrl: 'https://m.media-amazon.com/images/I/71pS1UWwElL._AC_SX679_.jpg',
//         storeName: store,
//       },
//     ];
//   }
//           });
//         } catch (error) {
//           this.logger.warn(`Erro ao parsear produto: ${error.message}`);
//         }
//       });

//       this.logger.debug(`Encontrados ${products.length} produtos`);

//       return {
//         products: products.slice(0, 20), // Limitar a 20 produtos
//         totalResults: products.length,
//         query,
//         storeName: 'Amazon',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao fazer scraping da Amazon: ${error.message}`);
//       throw new Error(`Erro ao pesquisar na Amazon: ${error.message}`);
//     }
//   }

//   async getProductDetails(productUrl: string): Promise<ScrapedProduct> {
//     try {
//       this.logger.debug(`Obtendo detalhes do produto: ${productUrl}`);
//       await this.respectRateLimit();

//       const { data } = await this.httpClient.get(productUrl);
//       const $ = cheerio.load(data);

//       // Título
//       const title = $('#productTitle').text().trim();

//       // Preço
//       const priceText = $('.a-price-whole').first().text();
//       const price = this.validatePrice(priceText);

//       // Stock (Amazon não mostra explicitamente, usa aviso genérico)
//       const stockText = $('#availability').text();
//       const stock = stockText.includes('Em estoque') ? 1 : 0;

//       // Imagem principal
//       const imageUrl = $('#landingImage').attr('src') || '';

//       if (!title || !price) {
//         throw new Error('Não foi possível extrair informações do produto');
//       }

//       return {
//         title,
//         price,
//         stock,
//         imageUrl,
//         productUrl,
//         storeName: 'Amazon',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao obter detalhes do produto: ${error.message}`);
//       throw error;
//     }
//   }
// }
