import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTransactionsByUser(userId: string, limit = 10, offset = 0) {
    return await this.find({
      where: { userId, isHidden: false },
      relations: ['category'],
      order: { date: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getRecentTransactions(userId: string, limit = 5) {
    return await this.find({
      where: { userId, isHidden: false },
      relations: ['category'],
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async getTransactionsByCategory(userId: string, categoryId: string) {
    return await this.find({
      where: { userId, categoryId, isHidden: false },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return await this.createQueryBuilder('t')
      .where('t.userId = :userId', { userId })
      .andWhere('t.isHidden = false')
      .andWhere('t.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('t.category', 'category')
      .orderBy('t.date', 'DESC')
      .getMany();
  }

  async getExpensesToday(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.OUT })
      .andWhere('t.isHidden = false')
      .andWhere('DATE(t.date) = :date', {
        date: today.toISOString().split('T')[0],
      })
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getIncomesToday(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.IN })
      .andWhere('t.isHidden = false')
      .andWhere('DATE(t.date) = :date', {
        date: today.toISOString().split('T')[0],
      })
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getMonthlyExpenses(userId: string, month: string): Promise<number> {
    const [year, monthNum] = month.split('-');

    const result = await this.createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.OUT })
      .andWhere('t.isHidden = false')
      .andWhere(
        `EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month`,
        { year: parseInt(year), month: parseInt(monthNum) },
      )
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getMonthlyIncome(userId: string, month: string): Promise<number> {
    const [year, monthNum] = month.split('-');

    const result = await this.createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.IN })
      .andWhere('t.isHidden = false')
      .andWhere(
        `EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month`,
        { year: parseInt(year), month: parseInt(monthNum) },
      )
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getCashFlowByMonth(userId: string, month: string) {
    const [year, monthNum] = month.split('-');

    return await this.createQueryBuilder('t')
      .select('DATE(t.date)', 'day')
      .addSelect(
        `SUM(CASE WHEN t.type = 'in' THEN t.amount ELSE 0 END)`,
        'income',
      )
      .addSelect(
        `SUM(CASE WHEN t.type = 'out' THEN t.amount ELSE 0 END)`,
        'expenses',
      )
      .where('t.userId = :userId', { userId })
      .andWhere('t.isHidden = false')
      .andWhere(
        `EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month`,
        { year: parseInt(year), month: parseInt(monthNum) },
      )
      .groupBy('DATE(t.date)')
      .orderBy('DATE(t.date)', 'ASC')
      .getRawMany();
  }
}
