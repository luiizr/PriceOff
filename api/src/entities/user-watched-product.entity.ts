import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE UserWatchedProduct
 * Produtos que o usuário adicionou ao dashboard para monitorar
 */
@Entity('user_watched_products')
@Index('idx_user_watched_user_active', ['userId', 'isActive'])
@Index('idx_user_watched_product', ['productId'])
export class UserWatchedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;  // Foreign key → User

  @Column({ type: 'uuid' })
  productId: string;  // Foreign key → Product

  @Column({ type: 'simple-array', nullable: true })
  selectedStores: string[];  // UUIDs de lojas selecionadas (null = todas)

  @Column({ type: 'float' })
  targetPrice: number;  // Preço que o usuário quer pagar

  @Column({ type: 'float', nullable: true })
  currentLowestPrice: number;  // Preço mais baixo atual

  @Column({ default: true })
  isActive: boolean;  // Monitoramento ativo?

  @Column({ default: false })
  notifyOnTargetPrice: boolean;  // Notificar quando atingir preço alvo?

  @Column({ default: false })
  notifyOnCoupon: boolean;  // Notificar quando encontrar cupom?

  @Column({ default: false })
  notifyOnPriceChange: boolean;  // Notificar em qualquer mudança?

  @Column({ type: 'float', nullable: true })
  priceDropPercentage: number;  // Notificar se cair X% (ex: 10)

  @Column({ type: 'timestamp', nullable: true })
  lastNotifiedAt: Date;  // Última vez que notificou

  @Column({ type: 'int', default: 0 })
  timesChecked: number;  // Quantas vezes foi verificado

  @Column({ type: 'timestamp', nullable: true })
  lastCheckedAt: Date;  // Última verificação

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
