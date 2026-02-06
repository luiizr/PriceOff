import { Injectable, NotFoundException } from '@nestjs/common';
import { BudgetRepository } from '../repositories/budget.repository';
import { Budget } from '../entities/budget.entity';
import { CreateBudgetDto } from '../dto/budget.dto';
import { UpdateBudgetDto } from '../dto/budget.dto';

@Injectable()
export class BudgetService {
  constructor(private budgetRepository: BudgetRepository) {}

  async createBudget(
    userId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    const budget = new Budget();
    budget.userId = userId;
    budget.categoryId = createBudgetDto.categoryId;
    budget.month = createBudgetDto.month;
    budget.limit = createBudgetDto.limit;

    return await this.budgetRepository.save(budget);
  }

  async getBudgetsByMonth(userId: string, month: string): Promise<Budget[]> {
    return await this.budgetRepository.getBudgetsByMonth(userId, month);
  }

  async getBudgetById(userId: string, budgetId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId, userId },
      relations: ['category'],
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return budget;
  }

  async getBudgetByCategory(
    userId: string,
    categoryId: string,
    month: string,
  ): Promise<Budget> {
    return await this.budgetRepository.getBudgetByCategory(
      userId,
      categoryId,
      month,
    );
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<Budget> {
    const budget = await this.getBudgetById(userId, budgetId);
    Object.assign(budget, updateBudgetDto);
    return await this.budgetRepository.save(budget);
  }

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    const budget = await this.getBudgetById(userId, budgetId);
    await this.budgetRepository.remove(budget);
  }

  async getBudgetProgress(
    userId: string,
    categoryId: string,
    month: string,
    spent: number,
  ): Promise<{ limit: number; spent: number; percentage: number }> {
    const budget = await this.budgetRepository.getBudgetByCategory(
      userId,
      categoryId,
      month,
    );

    if (!budget) {
      return { limit: 0, spent, percentage: 0 };
    }

    const percentage = (spent / Number(budget.limit)) * 100;
    return {
      limit: Number(budget.limit),
      spent,
      percentage: Math.min(percentage, 100),
    };
  }
}
