import { IsString, IsNumber, IsMonthString } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  categoryId: string;

  @IsString()
  month: string; // Formato: 2025-10

  @IsNumber()
  limit: number;
}

export class UpdateBudgetDto {
  @IsNumber()
  limit: number;
}
