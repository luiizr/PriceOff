// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { environment } from '../environments/environment';

// export interface ScrapedProduct {
//   title: string;
//   price: number;
//   stock: number;
//   imageUrl: string;
//   productUrl: string;
//   storeName: string;
// }

// export interface SearchResult {
//   products: ScrapedProduct[];
//   totalResults: number;
//   query: string;
//   storeName: string;
// }

// export interface BestDeal {
//   storeName: string;
//   productTitle: string;
//   price: number;
//   productUrl: string;
//   savings: number;
// }

// export interface MultiStoreSearchResult {
//   query: string;
//   results: SearchResult[];
//   aggregatedLowestPrice: number;
//   aggregatedAveragePrice: number;
//   totalProducts: number;
//   bestDeals: BestDeal[];
// }

// export interface AvailableStores {
//   stores: string[];
//   description: string;
// }

// export interface ScraperHealth {
//   [key: string]: {
//     status: string;
//     lastCheck: string;
//   };
// }

// /**
//  * SERVICE - Integração com API de Web Scraping
//  * Comunica com os endpoints de scraping do PriceOff API
//  */
// @Injectable({
//   providedIn: 'root',
// })
// export class ScraperService {
//   private baseUrl = `${environment.apiUrl}/scraper`;
//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   public loading$ = this.loadingSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   /**
//    * Obtém lista de lojas disponíveis
//    */
//   getAvailableStores(): Observable<AvailableStores> {
//     return this.http.get<AvailableStores>(`${this.baseUrl}/available-stores`);
//   }

//   /**
//    * Pesquisa em uma loja específica
//    * Se store não informado, usa Amazon por padrão
//    */
//   searchInStore(query: string, store?: string): Observable<SearchResult> {
//     this.setLoading(true);
//     return new Observable(observer => {
//       this.http
//         .post<SearchResult>(`${this.baseUrl}/search`, {
//           query,
//           store: store || 'amazon',
//         })
//         .subscribe(
//           result => {
//             this.setLoading(false);
//             observer.next(result);
//             observer.complete();
//           },
//           error => {
//             this.setLoading(false);
//             observer.error(error);
//           }
//         );
//     });
//   }

//   /**
//    * Pesquisa em múltiplas lojas
//    * Retorna resultados agregados com melhores deals
//    */
//   searchInMultipleStores(
//     query: string,
//     stores?: string[]
//   ): Observable<MultiStoreSearchResult> {
//     this.setLoading(true);
//     return new Observable(observer => {
//       this.http
//         .post<MultiStoreSearchResult>(`${this.baseUrl}/search-multiple`, {
//           query,
//           stores: stores || [],
//         })
//         .subscribe(
//           result => {
//             this.setLoading(false);
//             observer.next(result);
//             observer.complete();
//           },
//           error => {
//             this.setLoading(false);
//             observer.error(error);
//           }
//         );
//     });
//   }

//   /**
//    * Obtém detalhes completos de um produto
//    */
//   getProductDetails(
//     productUrl: string,
//     store: string
//   ): Observable<ScrapedProduct> {
//     this.setLoading(true);
//     return new Observable(observer => {
//       this.http
//         .post<ScrapedProduct>(`${this.baseUrl}/product-details`, {
//           productUrl,
//           store: store.toLowerCase(),
//         })
//         .subscribe(
//           result => {
//             this.setLoading(false);
//             observer.next(result);
//             observer.complete();
//           },
//           error => {
//             this.setLoading(false);
//             observer.error(error);
//           }
//         );
//     });
//   }

//   /**
//    * Verifica saúde de todos os scrapers
//    */
//   checkScraperHealth(): Observable<ScraperHealth> {
//     return this.http.get<ScraperHealth>(`${this.baseUrl}/health`);
//   }

//   /**
//    * Função auxiliar para controlar estado de loading
//    */
//   private setLoading(isLoading: boolean): void {
//     this.loadingSubject.next(isLoading);
//   }
// }
