import { Injectable } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { BudgetService } from './budget.service';

@Injectable()
export class DashboardService {
  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
  ) {}

  async getDashboardStats(userId: string) {
    const currentBalance = await this.transactionService.getCurrentBalance(
      userId,
    );
    const expensesToday = await this.transactionService.getExpensesToday(userId);
    const incomesToday = await this.transactionService.getIncomesToday(userId);

    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    const monthlyExpenses = await this.transactionService.getMonthlyExpenses(
      userId,
      monthKey,
    );
    const monthlyIncome = await this.transactionService.getMonthlyIncome(
      userId,
      monthKey,
    );

    return {
      currentBalance,
      expensesToday,
      incomesToday,
      savingsThisMonth: monthlyIncome - monthlyExpenses,
      monthlyExpenses,
      monthlyIncome,
    };
  }

  async getRecentTransactions(userId: string, limit = 5) {
    return await this.transactionService.getRecentTransactions(userId, limit);
  }

  async getCashFlowByMonth(userId: string, month: string) {
    return await this.transactionService.getCashFlowByMonth(userId, month);
  }

  async getBudgetProgress(userId: string, month: string) {
    const budgets = await this.budgetService.getBudgetsByMonth(userId, month);
    const currentMonth = new Date();

    const monthKey = month || `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    const expenses = await this.transactionService.getMonthlyExpenses(
      userId,
      monthKey,
    );

    return {
      total: budgets.reduce((sum, b) => sum + Number(b.limit), 0),
      spent: expenses,
      percentage: budgets.length > 0
        ? (expenses /
            budgets.reduce((sum, b) => sum + Number(b.limit), 0)) *
          100
        : 0,
    };
  }

  async getMonthlyOverview(userId: string, month: string) {
    const transactions = await this.transactionService.getTransactionsByDateRange(
      userId,
      new Date(`${month}-01`),
      new Date(`${month}-31`),
    );

    const expenses = transactions
      .filter((t) => t.type === 'out')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const income = transactions
      .filter((t) => t.type === 'in')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: transactions.length,
      transactions,
    };
  }
}
