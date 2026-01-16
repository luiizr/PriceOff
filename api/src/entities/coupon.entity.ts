import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE Coupon
 * Cupons e promoções descobertos para produtos
 */
@Entity('coupons')
@Index('idx_coupon_product_store_link', ['productStoreLinkId'])
@Index('idx_coupon_expires_active', ['expiresAt', 'isActive'])
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productStoreLinkId: string;  // Cupom de qual produto/loja

  @Column({ length: 100 })
  code: string;  // Código do cupom

  @Column({ type: 'float', nullable: true })
  discountValue: number;  // Desconto em valor (ex: 50 reais)

  @Column({ type: 'float', nullable: true })
  discountPercentage: number;  // Desconto em % (ex: 10%)

  @Column({ type: 'text', nullable: true })
  description: string;  // Descrição do cupom

  @Column({ type: 'timestamp' })
  expiresAt: Date;  // Data de expiração

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  timesUsed: number;  // Quantas vezes foi utilizado

  @Column({ type: 'text', nullable: true })
  source: string;  // Onde o cupom foi encontrado (site, app, etc)

  @CreateDateColumn()
  discoveredAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
