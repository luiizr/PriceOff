import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceHistory } from '../entities/price-history.entity';

/**
 * REPOSITORY - PriceHistory
 * Histórico de variação de preços
 */
@Injectable()
export class PriceHistoryRepository {
  private readonly logger = new Logger(PriceHistoryRepository.name);

  constructor(
    @InjectRepository(PriceHistory)
    private readonly repository: Repository<PriceHistory>,
  ) {}

  /**
   * Encontrar por ID
   */
  async findById(id: string): Promise<PriceHistory | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Encontrar histórico de um produto em uma loja
   */
  async findByProductStoreLink(
    productStoreLinkId: string,
    limit: number = 50,
  ): Promise<PriceHistory[]> {
    return this.repository.find({
      where: { productStoreLinkId },
      order: { checkedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Encontrar última entrada de preço
   */
  async findLatestByProductStoreLink(
    productStoreLinkId: string,
  ): Promise<PriceHistory | null> {
    return this.repository.findOne({
      where: { productStoreLinkId },
      order: { checkedAt: 'DESC' },
    });
  }

  /**
   * Encontrar histórico entre datas
   */
  async findByDateRange(
    productStoreLinkId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PriceHistory[]> {
    return this.repository
      .createQueryBuilder('history')
      .where('history.productStoreLinkId = :productStoreLinkId', {
        productStoreLinkId,
      })
      .andWhere('history.checkedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('history.checkedAt', 'ASC')
      .getMany();
  }

  /**
   * Criar novo histórico de preço
   */
  async create(priceHistory: Partial<PriceHistory>): Promise<PriceHistory> {
    const history = this.repository.create({
      ...priceHistory,
      checkedAt: new Date(),
    });
    const saved = await this.repository.save(history);
    this.logger.log(
      `PriceHistory criado: ${priceHistory.productStoreLinkId} - R$ ${priceHistory.price}`,
    );
    return saved;
  }

  /**
   * Criar múltiplas entradas de histórico
   */
  async createBatch(
    priceHistories: Partial<PriceHistory>[],
  ): Promise<PriceHistory[]> {
    const histories = this.repository.create(
      priceHistories.map((h) => ({
        ...h,
        checkedAt: h.checkedAt || new Date(),
      })),
    );
    const saved = await this.repository.save(histories);
    this.logger.log(`${saved.length} PriceHistories criados`);
    return saved;
  }

  /**
   * Deletar histórico antigo (para limpeza)
   */
  async deleteOlderThan(days: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where('checkedAt < :date', { date })
      .execute();
    
    this.logger.log(
      `${result.affected} históricos antigos (> ${days} dias) deletados`,
    );
    return result.affected || 0;
  }

  /**
   * Contar entradas
   */
  async count(): Promise<number> {
    return this.repository.count();
  }
}
