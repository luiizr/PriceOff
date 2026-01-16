import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * ENTIDADE Store
 * Representa as lojas/marketplaces onde produtos podem ser encontrados
 */
@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;  // "Amazon", "Mercado Livre", "B2Brazil", etc

  @Column({ length: 300, nullable: true })
  logo: string;  // URL do logo da loja

  @Column({ length: 500 })
  baseUrl: string;  // URL base para scraping

  @Column({ type: 'text', nullable: true })
  scrapingConfig: string;  // JSON com seletores CSS para extração
  // Exemplo: { "priceSelector": ".price", "stockSelector": ".stock-qty" }

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
