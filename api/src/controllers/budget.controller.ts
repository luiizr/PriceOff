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
import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto, UpdateBudgetDto } from '../dto/budget.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Request() req,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return await this.budgetService.createBudget(req.user.id, createBudgetDto);
  }

  @Get()
  async getBudgets(
    @Request() req,
    @Query('month') month: string,
  ) {
    const currentMonth = new Date();
    const monthKey = month || `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    return await this.budgetService.getBudgetsByMonth(req.user.id, monthKey);
  }

  @Get(':id')
  async getBudget(@Request() req, @Param('id') id: string) {
    return await this.budgetService.getBudgetById(req.user.id, id);
  }

  @Put(':id')
  async updateBudget(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return await this.budgetService.updateBudget(
      req.user.id,
      id,
      updateBudgetDto,
    );
  }

  @Delete(':id')
  async deleteBudget(@Request() req, @Param('id') id: string) {
    await this.budgetService.deleteBudget(req.user.id, id);
    return { message: 'Orçamento deletado com sucesso' };
  }
}
