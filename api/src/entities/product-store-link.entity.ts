import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE ProductStoreLink
 * Vinculação entre Produto e Loja - Preço específico por loja
 */
@Entity('product_store_links')
@Index(['productId', 'storeId'])
@Index(['lastCheckedAt'])
export class ProductStoreLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  productId: string;  // Foreign key → Product

  @Column({ type: 'uuid' })
  @Index()
  storeId: string;  // Foreign key → Store

  @Column({ length: 500 })
  productUrl: string;  // URL do produto nessa loja específica

  @Column({ type: 'float' })
  currentPrice: number;  // Preço atual nessa loja

  @Column({ type: 'int', default: 0 })
  stock: number;  // Estoque disponível

  @Column({ default: true })
  isAvailable: boolean;  // Está disponível para compra?

  @Column({ type: 'float', nullable: true })
  discountPercentage: number;  // Desconto em % (se houver)

  @Column({ type: 'timestamp', nullable: true })
  lastCheckedAt: Date;  // Última vez que o preço foi atualizado

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
