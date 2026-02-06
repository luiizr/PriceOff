import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';

@Injectable()
export class BudgetRepository extends Repository<Budget> {
  constructor(private dataSource: DataSource) {
    super(Budget, dataSource.createEntityManager());
  }

  async getBudgetsByMonth(userId: string, month: string) {
    return await this.find({
      where: { userId, month },
      relations: ['category'],
      order: { category: { name: 'ASC' } },
    });
  }

  async getBudgetByCategory(userId: string, categoryId: string, month: string) {
    return await this.findOne({
      where: { userId, categoryId, month },
      relations: ['category'],
    });
  }

  async getBudgetByUserAndMonth(userId: string, month: string) {
    return await this.find({
      where: { userId, month },
      relations: ['category'],
    });
  }

  async deleteBudgetsByMonth(userId: string, month: string) {
    return await this.delete({ userId, month });
  }
}
