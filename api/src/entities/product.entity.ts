import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE Product
 * Representa o catálogo genérico de produtos
 */
@Entity('products')
@Index(['name', 'category'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;  // "iPhone 15 Pro"

  @Column({ length: 500 })
  description: string;

  @Column({ length: 100 })
  category: string;  // "Eletrônicos", "Moda", "Casa", etc

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'float', nullable: true })
  averagePrice: number;  // Preço médio calculado de todas as lojas

  @Column({ type: 'float', nullable: true })
  lowestPrice: number;  // Preço mínimo encontrado

  @Column({ type: 'float', nullable: true })
  highestPrice: number;  // Preço máximo encontrado

  @Column({ type: 'int', default: 0 })
  priceCheckCount: number;  // Quantas vezes foi checado

  @Column({ type: 'timestamp', nullable: true })
  lastPriceCheck: Date;  // Última verificação de preço

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
