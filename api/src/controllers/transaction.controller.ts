import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Request() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionService.createTransaction(
      req.user.id,
      createTransactionDto,
    );
  }

  @Get()
  async getTransactions(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return await this.transactionService.getTransactionsByUser(
      req.user.id,
      parseInt(limit as string),
      parseInt(offset as string),
    );
  }

  @Get('recent')
  async getRecentTransactions(
    @Request() req,
    @Query('limit') limit = 5,
  ) {
    return await this.transactionService.getRecentTransactions(
      req.user.id,
      parseInt(limit as string),
    );
  }

  @Get(':id')
  async getTransaction(@Request() req, @Param('id') id: string) {
    return await this.transactionService.getTransactionById(req.user.id, id);
  }

  @Put(':id')
  async updateTransaction(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionService.updateTransaction(
      req.user.id,
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  async deleteTransaction(@Request() req, @Param('id') id: string) {
    await this.transactionService.deleteTransaction(req.user.id, id);
    return { message: 'Transação deletada com sucesso' };
  }

  @Get('category/:categoryId')
  async getTransactionsByCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
  ) {
    return await this.transactionService.getTransactionsByCategory(
      req.user.id,
      categoryId,
    );
  }
}
