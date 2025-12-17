# 📍 Sistema de Rotas

## Estrutura com Rotas Separadas

```
src/
├── routes/            # Define as rotas HTTP
│   └── auth.routes.ts
├── controllers/       # Processa a lógica
│   └── auth.controller.ts
├── services/          # Regras de negócio
│   └── auth.service.ts
├── repositories/      # Acesso aos dados
│   └── user.repository.ts
└── entities/          # Models
    └── user.entity.ts
```

## 🔄 Fluxo Completo

```
HTTP Request
    ↓
ROUTE (define endpoint e valida entrada)
    ↓
CONTROLLER (processa e orquestra)
    ↓
SERVICE (aplica regras de negócio)
    ↓
REPOSITORY (acessa banco de dados)
    ↓
DATABASE
```

## ✨ Como Criar uma Nova Funcionalidade

### Exemplo: Sistema de Produtos

#### 1. Criar ENTITY
**Arquivo:** `src/entities/product.entity.ts`
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
}
```

#### 2. Criar DTO
**Arquivo:** `src/dto/product.dto.ts`
```typescript
export class CreateProductDto {
  name: string;
  price: number;
}

export class UpdateProductDto {
  name?: string;
  price?: number;
}
```

#### 3. Criar REPOSITORY
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

  async update(id: string, data: Partial<Product>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

#### 4. Criar SERVICE
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
    await this.findOne(id);
    await this.productRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.productRepository.delete(id);
  }
}
```

#### 5. Criar CONTROLLER
**Arquivo:** `src/controllers/product.controller.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

/**
 * CONTROLLER - Apenas handlers
 * Métodos que serão chamados pelas rotas
 */
@Injectable()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async handleGetAll() {
    return this.productService.findAll();
  }

  async handleGetOne(id: string) {
    return this.productService.findOne(id);
  }

  async handleCreate(createDto: CreateProductDto) {
    return this.productService.create(createDto);
  }

  async handleUpdate(id: string, updateDto: UpdateProductDto) {
    return this.productService.update(id, updateDto);
  }

  async handleDelete(id: string) {
    await this.productService.delete(id);
    return { message: 'Produto deletado com sucesso' };
  }
}
```

#### 6. Criar ROUTES (Aqui que define os endpoints!)
**Arquivo:** `src/routes/product.routes.ts`
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

/**
 * ROUTES - Define todas as rotas de produtos
 * Encaminha para o controller correspondente
 */
@Controller('products')
export class ProductRoutes {
  constructor(private readonly productController: ProductController) {}

  /**
   * GET /products
   * Lista todos os produtos
   */
  @Get()
  async getAll() {
    return this.productController.handleGetAll();
  }

  /**
   * GET /products/:id
   * Busca um produto por ID
   */
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productController.handleGetOne(id);
  }

  /**
   * POST /products
   * Cria um novo produto
   */
  @Post()
  async create(@Body() createDto: CreateProductDto) {
    return this.productController.handleCreate(createDto);
  }

  /**
   * PUT /products/:id
   * Atualiza um produto
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productController.handleUpdate(id, updateDto);
  }

  /**
   * DELETE /products/:id
   * Deleta um produto
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productController.handleDelete(id);
  }
}
```

#### 7. Registrar no APP.MODULE
**Arquivo:** `src/app.module.ts`
```typescript
// Importar entidade
import { Product } from './entities/product.entity';

// Importar rota
import { ProductRoutes } from './routes/product.routes';

// Importar controller, service e repository
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ...
      entities: [User, Product], // ← Adicionar
    }),
    TypeOrmModule.forFeature([User, Product]), // ← Adicionar
  ],
  controllers: [
    AppController,
    AuthRoutes,
    ProductRoutes, // ← Adicionar ROUTE aqui
  ],
  providers: [
    AppService,
    AuthController,
    AuthService,
    UserRepository,
    ProductController, // ← Adicionar CONTROLLER como provider
    ProductService, // ← Adicionar SERVICE
    ProductRepository, // ← Adicionar REPOSITORY
  ],
})
```

## 📝 Ordem de Criação

1. **ENTITY** → Estrutura da tabela
2. **DTO** → Formato dos dados
3. **REPOSITORY** → Acesso ao banco
4. **SERVICE** → Regras de negócio
5. **CONTROLLER** → Handlers (métodos)
6. **ROUTES** → Endpoints HTTP (rotas)
7. **APP.MODULE** → Registra tudo

## 🎯 Diferença Principal

### Antes (tudo no controller):
```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  async login() { ... }
}
```

### Agora (separado):
```typescript
// CONTROLLER - Apenas lógica
@Injectable()
export class AuthController {
  async handleLogin() { ... }
}

// ROUTES - Define endpoints
@Controller('auth')
export class AuthRoutes {
  @Post('login')
  async login() {
    return this.authController.handleLogin();
  }
}
```

## ✅ Vantagens

✅ **Rotas centralizadas** - Todas em uma pasta  
✅ **Controllers limpos** - Apenas lógica  
✅ **Fácil de modificar rotas** - Sem tocar nos controllers  
✅ **Melhor organização** - Separação clara de responsabilidades  
✅ **Reutilizável** - Um controller pode ter várias rotas  

## 🚀 Estrutura Final

```
src/
├── routes/           # AuthRoutes, ProductRoutes, OrderRoutes
├── controllers/      # AuthController, ProductController, OrderController
├── services/         # AuthService, ProductService, OrderService
├── repositories/     # UserRepository, ProductRepository, OrderRepository
├── entities/         # User, Product, Order
├── dto/              # auth.dto, product.dto, order.dto
└── middlewares/      # LoggerMiddleware, AuthMiddleware
```
