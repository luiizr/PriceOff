import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

/**
 * REPOSITORY - Product
 * Acesso aos dados de produtos no banco de dados
 */
@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  /**
   * Encontrar produto por ID
   */
  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['productStoreLinks'],
    });
  }

  /**
   * Buscar produtos por nome (LIKE)
   */
  async searchByName(name: string): Promise<Product[]> {
    return this.repository
      .createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .orderBy('product.name', 'ASC')
      .take(20)
      .getMany();
  }

  /**
   * Buscar produtos por categoria
   */
  async findByCategory(category: string): Promise<Product[]> {
    return this.repository.find({
      where: { category, isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Encontrar ou criar produto por nome
   */
  async findOrCreateByName(
    name: string,
    description?: string,
    category?: string,
    imageUrl?: string,
  ): Promise<Product> {
    let product = await this.repository.findOne({
      where: { name },
    });

    if (!product) {
      product = this.repository.create({
        name,
        description,
        category,
        imageUrl,
        isActive: true,
        averagePrice: 0,
        lowestPrice: 0,
        highestPrice: 0,
        priceCheckCount: 0,
      });
      product = await this.repository.save(product);
      this.logger.log(`Produto criado: ${name}`);
    }

    return product;
  }

  /**
   * Listar todos os produtos
   */
  async findAll(): Promise<Product[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Atualizar produto
   */
  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    const updated = await this.findById(id);
    this.logger.log(`Produto atualizado: ${id}`);
    return updated!;
  }

  /**
   * Atualizar preços agregados do produto
   */
  async updatePriceMetrics(
    id: string,
    lowestPrice: number,
    highestPrice: number,
    averagePrice: number,
    priceCheckCount: number,
    lastPriceCheck: Date,
  ): Promise<Product> {
    await this.repository.update(id, {
      lowestPrice,
      highestPrice,
      averagePrice,
      priceCheckCount,
      lastPriceCheck,
    });
    const updated = await this.findById(id);
    return updated || ({} as Product);
  }

  /**
   * Deletar produto
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    this.logger.log(`Produto deletado: ${id}`);
    return result.affected! > 0;
  }
}
