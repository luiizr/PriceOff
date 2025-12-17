# Estrutura do Projeto - Clean Architecture Horizontal

## 📁 Estrutura de Pastas

```
src/
├── entities/          # TODOS os models (tabelas do banco)
├── dto/               # TODOS os DTOs (formato de dados)
├── controllers/       # TODOS os controllers (rotas HTTP)
├── services/          # TODOS os services (lógica de negócio)
├── repositories/      # TODOS os repositories (acesso a dados)
├── middlewares/       # TODOS os middlewares
├── app.module.ts      # Módulo principal (registra tudo)
└── main.ts            # Entry point
```

## 🔄 Fluxo de Requisição

```
Request (HTTP)
    ↓
CONTROLLER (recebe e valida)
    ↓
SERVICE (processa lógica de negócio)
    ↓
REPOSITORY (acessa banco de dados)
    ↓
DATABASE (PostgreSQL)
```

## ✨ Como Adicionar uma Nova Feature

### Exemplo: Criar funcionalidade de Produtos

#### 1. Criar a ENTIDADE (Model)
**Arquivo:** `src/entities/product.entity.ts`
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

#### 2. Criar os DTOs
**Arquivo:** `src/dto/product.dto.ts`
```typescript
export class CreateProductDto {
  name: string;
  price: number;
  description?: string;
}

export class UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
}
```

#### 3. Criar o REPOSITORY
**Arquivo:** `src/repositories/product.repository.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repository.create(data);
    return this.repository.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

#### 4. Criar o SERVICE
**Arquivo:** `src/services/product.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll() {
    return this.productRepository.findAll();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async create(createDto: CreateProductDto) {
    return this.productRepository.create(createDto);
  }

  async update(id: string, updateDto: UpdateProductDto) {
    await this.findOne(id); // Valida se existe
    return this.productRepository.update(id, updateDto);
  }

  async delete(id: string) {
    await this.findOne(id); // Valida se existe
    return this.productRepository.delete(id);
  }
}
```

#### 5. Criar o CONTROLLER
**Arquivo:** `src/controllers/product.controller.ts`
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateProductDto) {
    return this.productService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
```

#### 6. Registrar no APP.MODULE
**Arquivo:** `src/app.module.ts`
```typescript
import { Product } from './entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ...
      entities: [User, Product], // ← Adicionar aqui
    }),
    TypeOrmModule.forFeature([User, Product]), // ← Adicionar aqui
  ],
  controllers: [
    AppController,
    AuthController,
    ProductController, // ← Adicionar aqui
  ],
  providers: [
    AppService,
    AuthService,
    UserRepository,
    ProductService, // ← Adicionar aqui
    ProductRepository, // ← Adicionar aqui
  ],
})
```

## 🎯 Vantagens dessa Estrutura

✅ **Simples de entender** - Cada camada em seu lugar  
✅ **Fácil de encontrar** - Todos os controllers juntos, todos os services juntos  
✅ **Escalável** - Adicione quantas entidades quiser  
✅ **Clean Architecture** - Separação de responsabilidades  
✅ **Padrão de Projeto** - Repository Pattern + Service Layer  

## 📝 Ordem de Criação

1. **ENTIDADE** → Define a estrutura da tabela
2. **DTO** → Define formato de entrada/saída
3. **REPOSITORY** → Acessa o banco de dados
4. **SERVICE** → Implementa regras de negócio
5. **CONTROLLER** → Expõe rotas HTTP
6. **APP.MODULE** → Registra tudo

## 🚀 Pronto para usar!

Agora você pode criar qualquer funcionalidade seguindo esse padrão:
- Usuários ✓
- Produtos
- Pedidos
- Categorias
- etc...
