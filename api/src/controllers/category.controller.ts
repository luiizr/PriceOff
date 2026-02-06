import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoryService.createCategory(
      req.user.id,
      createCategoryDto,
    );
  }

  @Get()
  async getCategories(@Request() req) {
    return await this.categoryService.getCategoriesByUser(req.user.id);
  }

  @Get(':id')
  async getCategory(@Request() req, @Param('id') id: string) {
    return await this.categoryService.getCategoryById(req.user.id, id);
  }

  @Put(':id')
  async updateCategory(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(
      req.user.id,
      id,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  async deleteCategory(@Request() req, @Param('id') id: string) {
    await this.categoryService.deleteCategory(req.user.id, id);
    return { message: 'Categoria deletada com sucesso' };
  }

  @Post('create-defaults')
  async createDefaultCategories(@Request() req) {
    await this.categoryService.createDefaultCategories(req.user.id);
    return { message: 'Categorias padrão criadas' };
  }
}
