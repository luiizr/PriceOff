import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../entities/store.entity';

/**
 * REPOSITORY - Store
 * Acesso aos dados de lojas no banco de dados
 */
@Injectable()
export class StoreRepository {
  private readonly logger = new Logger(StoreRepository.name);

  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  /**
   * Encontrar loja por nome
   */
  async findByName(name: string): Promise<Store | null> {
    return this.repository.findOne({
      where: { name },
    });
  }

  /**
   * Encontrar loja por ID
   */
  async findById(id: string): Promise<Store | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Listar todas as lojas ativas
   */
  async findAllActive(): Promise<Store[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Listar todas as lojas
   */
  async findAll(): Promise<Store[]> {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Criar nova loja
   */
  async create(store: Partial<Store>): Promise<Store> {
    const newStore = this.repository.create(store);
    const saved = await this.repository.save(newStore);
    this.logger.log(`Loja criada: ${saved.name}`);
    return saved;
  }

  /**
   * Atualizar loja
   */
  async update(id: string, store: Partial<Store>): Promise<Store> {
    await this.repository.update(id, store);
    const updated = await this.findById(id);
    this.logger.log(`Loja atualizada: ${id}`);
    return updated!;
  }

  /**
   * Deletar loja
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    this.logger.log(`Loja deletada: ${id}`);
    return result.affected! > 0;
  }
}
