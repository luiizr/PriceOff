import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductStoreLink } from '../entities/product-store-link.entity';

/**
 * REPOSITORY - ProductStoreLink
 * Relacionamento entre Produtos e Lojas
 */
@Injectable()
export class ProductStoreLinkRepository {
  private readonly logger = new Logger(ProductStoreLinkRepository.name);

  constructor(
    @InjectRepository(ProductStoreLink)
    private readonly repository: Repository<ProductStoreLink>,
  ) {}

  /**
   * Encontrar link por ID
   */
  async findById(id: string): Promise<ProductStoreLink | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['product', 'store'],
    });
  }

  /**
   * Encontrar link por Produto + Loja
   */
  async findByProductAndStore(
    productId: string,
    storeId: string,
  ): Promise<ProductStoreLink | null> {
    return this.repository.findOne({
      where: { productId, storeId },
      relations: ['product', 'store'],
    });
  }

  /**
   * Encontrar todos os links de um produto
   */
  async findByProductId(productId: string): Promise<ProductStoreLink[]> {
    return this.repository.find({
      where: { productId },
      relations: ['store'],
      order: { currentPrice: 'ASC' },
    });
  }

  /**
   * Encontrar todos os links de uma loja
   */
  async findByStoreId(storeId: string): Promise<ProductStoreLink[]> {
    return this.repository.find({
      where: { storeId },
      relations: ['product'],
      order: { currentPrice: 'ASC' },
    });
  }

  /**
   * Encontrar ou criar link Produto + Loja
   */
  async findOrCreate(
    productId: string,
    storeId: string,
    productUrl: string,
    currentPrice: number,
    stock: number = 0,
  ): Promise<ProductStoreLink> {
    let link = await this.findByProductAndStore(productId, storeId);

    if (!link) {
      link = this.repository.create({
        productId,
        storeId,
        productUrl,
        currentPrice,
        stock,
        isAvailable: true,
        discountPercentage: 0,
      });
      link = await this.repository.save(link);
      this.logger.log(
        `ProductStoreLink criado: ${productId} - ${storeId} - R$ ${currentPrice}`,
      );
    }

    return link;
  }

  /**
   * Atualizar preço e estoque
   */
  async updatePrice(
    id: string,
    currentPrice: number,
    stock: number,
    discountPercentage: number = 0,
    isAvailable: boolean = true,
  ): Promise<ProductStoreLink> {
    await this.repository.update(id, {
      currentPrice,
      stock,
      discountPercentage,
      isAvailable,
      lastCheckedAt: new Date(),
    });
    const updated = await this.findById(id);
    this.logger.log(`ProductStoreLink atualizado: ${id} - R$ ${currentPrice}`);
    return updated!;
  }

  /**
   * Atualizar disponibilidade
   */
  async updateAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ProductStoreLink> {
    await this.repository.update(id, { isAvailable });
    const updated = await this.findById(id);
    return updated || ({} as ProductStoreLink);
  }

  /**
   * Deletar link
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    this.logger.log(`ProductStoreLink deletado: ${id}`);
    return result.affected! > 0;
  }

  /**
   * Listar links ativos
   */
  async findAllActive(): Promise<ProductStoreLink[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['product', 'store'],
      order: { currentPrice: 'ASC' },
    });
  }
}
