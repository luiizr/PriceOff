import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * ENTIDADE Alert
 * Alertas gerados quando algo relevante acontece com produtos monitorados
 */
@Entity('alerts')
@Index('idx_alert_user_created', ['userId', 'createdAt'])
@Index('idx_alert_notified', ['userId', 'wasNotified'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;  // Foreign key → User

  @Column({ type: 'uuid' })
  @Index()
  userWatchedProductId: string;  // Foreign key → UserWatchedProduct

  @Column({ type: 'uuid', nullable: true })
  productStoreLinkId: string;  // Qual loja/produto específico gatilhou

  @Column({
    type: 'enum',
    enum: ['PRICE_DROP', 'TARGET_REACHED', 'COUPON_FOUND', 'BACK_IN_STOCK', 'PRICE_CHANGE'],
  })
  alertType: string;

  @Column({ type: 'float' })
  previousPrice: number;

  @Column({ type: 'float' })
  currentPrice: number;

  @Column({ type: 'text' })
  message: string;  // Mensagem amigável para o usuário

  @Column({ default: false })
  wasNotified: boolean;  // Já foi notificado via WhatsApp/Email?

  @Column({ type: 'timestamp', nullable: true })
  notifiedAt: Date;  // Quando foi notificado

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;  // PENDING, SENT, READ

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
