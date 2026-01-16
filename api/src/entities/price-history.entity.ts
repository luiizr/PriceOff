import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE PriceHistory
 * Registro histórico de todas as variações de preço
 */
@Entity('price_history')
@Index('idx_price_product_checked', ['productStoreLinkId', 'checkedAt'])
@Index('idx_price_checked', ['checkedAt'])
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  productStoreLinkId: string;  // Foreign key → ProductStoreLink

  @Column({ type: 'float' })
  price: number;  // Preço naquele momento

  @Column({ type: 'float', nullable: true })
  discountPercentage: number;  // Desconto em % se houver

  @Column({ type: 'int', default: 0 })
  stock: number;  // Estoque disponível

  @Column({ default: false })
  hasCoupon: boolean;  // Tinha cupom?

  @Column({ type: 'text', nullable: true })
  couponCode: string;  // Código do cupom (se houver)

  @Column({ type: 'text', nullable: true })
  notes: string;  // Notas adicionais

  @CreateDateColumn()
  checkedAt: Date;  // Quando foi feito o check
}
