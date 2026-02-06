import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    return await this.dashboardService.getDashboardStats(req.user.id);
  }

  @Get('recent-transactions')
  async getRecentTransactions(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    return await this.dashboardService.getRecentTransactions(
      req.user.id,
      limit ? parseInt(limit) : 5,
    );
  }

  @Get('cash-flow')
  async getCashFlow(
    @Request() req,
    @Query('month') month: string,
  ) {
    const currentMonth = new Date();
    const monthKey = month || `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    return await this.dashboardService.getCashFlowByMonth(req.user.id, monthKey);
  }

  @Get('budget-progress')
  async getBudgetProgress(
    @Request() req,
    @Query('month') month: string,
  ) {
    const currentMonth = new Date();
    const monthKey = month || `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    return await this.dashboardService.getBudgetProgress(req.user.id, monthKey);
  }

  @Get('monthly-overview')
  async getMonthlyOverview(
    @Request() req,
    @Query('month') month: string,
  ) {
    const currentMonth = new Date();
    const monthKey = month || `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    return await this.dashboardService.getMonthlyOverview(req.user.id, monthKey);
  }

  @Get()
  async getDashboard(@Request() req) {
    const stats = await this.dashboardService.getDashboardStats(req.user.id);
    const recentTransactions = await this.dashboardService.getRecentTransactions(req.user.id, 5);

    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    const cashFlow = await this.dashboardService.getCashFlowByMonth(req.user.id, monthKey);
    const budgetProgress = await this.dashboardService.getBudgetProgress(req.user.id, monthKey);

    return {
      stats,
      recentTransactions,
      cashFlow,
      budgetProgress,
    };
  }
}
