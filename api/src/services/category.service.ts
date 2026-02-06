import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    // Verifica se a categoria já existe
    const existingCategory = await this.categoryRepository.findByName(
      userId,
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Esta categoria já existe');
    }

    const category = new Category();
    category.userId = userId;
    category.name = createCategoryDto.name;
    category.color = createCategoryDto.color || '#9CA3AF';
    category.icon = createCategoryDto.icon || 'ti-tag';

    return await this.categoryRepository.save(category);
  }

  async getCategoriesByUser(userId: string): Promise<Category[]> {
    return await this.categoryRepository.getCategoriesByUser(userId);
  }

  async getCategoryById(userId: string, categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(userId, categoryId);

    // Se o nome está sendo alterado, verifica duplicate
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(
        userId,
        updateCategoryDto.name,
      );
      if (existingCategory) {
        throw new ConflictException(
          'Uma categoria com este nome já existe',
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const category = await this.getCategoryById(userId, categoryId);
    await this.categoryRepository.remove(category);
  }

  async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      { name: 'Alimentação', color: '#FF6B6B', icon: 'ti-shopping-cart' },
      { name: 'Transporte', color: '#4ECDC4', icon: 'ti-car' },
      { name: 'Diversão', color: '#FFD93D', icon: 'ti-mood-smile' },
      { name: 'Saúde', color: '#6BCB77', icon: 'ti-heart' },
      { name: 'Assinatura', color: '#4D96FF', icon: 'ti-infinity' },
      { name: 'Renda', color: '#95E1D3', icon: 'ti-coins' },
      { name: 'Educação', color: '#A78BFA', icon: 'ti-school' },
      { name: 'Outros', color: '#9CA3AF', icon: 'ti-tag' },
    ];

    for (const categoryData of defaultCategories) {
      const exists = await this.categoryRepository.findByName(
        userId,
        categoryData.name,
      );
      if (!exists) {
        await this.createCategory(userId, categoryData);
      }
    }
  }
}
