import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { UpdateTransactionDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.userId = userId;
    transaction.title = createTransactionDto.title;
    transaction.amount = createTransactionDto.amount;
    transaction.type = createTransactionDto.type;
    transaction.categoryId = createTransactionDto.categoryId || null;
    transaction.description = createTransactionDto.description || null;
    transaction.date = new Date(createTransactionDto.date);

    return await this.transactionRepository.save(transaction);
  }

  async getTransactionsByUser(
    userId: string,
    limit = 10,
    offset = 0,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.getTransactionsByUser(
      userId,
      limit,
      offset,
    );
  }

  async getRecentTransactions(userId: string, limit = 5): Promise<Transaction[]> {
    return await this.transactionRepository.getRecentTransactions(userId, limit);
  }

  async getTransactionsByCategory(
    userId: string,
    categoryId: string,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.getTransactionsByCategory(
      userId,
      categoryId,
    );
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.getTransactionsByDateRange(
      userId,
      startDate,
      endDate,
    );
  }

  async getTransactionById(userId: string, transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, userId },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.getTransactionById(userId, transactionId);

    Object.assign(transaction, updateTransactionDto);
    if (updateTransactionDto.date) {
      transaction.date = new Date(updateTransactionDto.date);
    }

    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const transaction = await this.getTransactionById(userId, transactionId);
    await this.transactionRepository.remove(transaction);
  }

  async getExpensesToday(userId: string): Promise<number> {
    return await this.transactionRepository.getExpensesToday(userId);
  }

  async getIncomesToday(userId: string): Promise<number> {
    return await this.transactionRepository.getIncomesToday(userId);
  }

  async getMonthlyExpenses(userId: string, month: string): Promise<number> {
    return await this.transactionRepository.getMonthlyExpenses(userId, month);
  }

  async getMonthlyIncome(userId: string, month: string): Promise<number> {
    return await this.transactionRepository.getMonthlyIncome(userId, month);
  }

  async getCurrentBalance(userId: string): Promise<number> {
    const allTransactions = await this.transactionRepository.find({
      where: { userId, isHidden: false },
    });

    let balance = 0;
    for (const transaction of allTransactions) {
      if (transaction.type === TransactionType.IN) {
        balance += Number(transaction.amount);
      } else {
        balance -= Number(transaction.amount);
      }
    }

    return balance;
  }

  async getCashFlowByMonth(userId: string, month: string) {
    return await this.transactionRepository.getCashFlowByMonth(userId, month);
  }
}
