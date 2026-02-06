import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getCategoriesByUser(userId: string) {
    return await this.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async getCategoryWithTransactions(userId: string, categoryId: string) {
    return await this.findOne({
      where: { userId, id: categoryId },
      relations: ['transactions'],
    });
  }

  async findByName(userId: string, name: string) {
    return await this.findOne({
      where: { userId, name },
    });
  }
}
