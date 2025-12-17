# 🔐 Autenticação JWT - Guia Completo

## ✅ Configuração Implementada

- ✓ JWT com bearer token
- ✓ Guard para proteger rotas
- ✓ Decorator para pegar usuário logado
- ✓ Strategy de validação de token
- ✓ Expiração configurável de token

## 📝 Como Usar

### 1. Registrar um Usuário

**POST** `http://localhost:3000/auth/register`

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### 2. Fazer Login

**POST** `http://localhost:3000/auth/login`

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

⚠️ **Copie o `access_token` para usar nas próximas requisições!**

### 3. Acessar Rotas Protegidas

**GET** `http://localhost:3000/users/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "id": "uuid-aqui",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

### 4. Atualizar Perfil

**PUT** `http://localhost:3000/users/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "João Silva Junior"
}
```

## 🛡️ Proteger Novas Rotas

### Proteger um Controller Inteiro

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard) // ← Protege TODAS as rotas
export class ProductController {
  
  @Get()
  async findAll() {
    // Apenas usuários autenticados podem acessar
  }
}
```

### Proteger uma Rota Específica

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  
  @Get()
  async findAll() {
    // Rota pública - qualquer um pode acessar
  }

  @Post()
  @UseGuards(JwtAuthGuard) // ← Protege APENAS esta rota
  async create() {
    // Apenas usuários autenticados podem criar
  }
}
```

### Pegar Dados do Usuário Logado

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  
  @Get('my-orders')
  async getMyOrders(@CurrentUser() user: any) {
    // user.id   - ID do usuário logado
    // user.email - Email do usuário logado
    // user.name  - Nome do usuário logado
    
    return `Pedidos do usuário ${user.name}`;
  }
}
```

## 🔑 Configuração JWT (.env)

```env
JWT_SECRET=sua_chave_secreta_super_segura_aqui_12345
JWT_EXPIRES_IN=7d
```

**Importante:** 
- Use uma chave secreta forte em produção
- Nunca commite o arquivo .env
- Mude o `JWT_SECRET` em produção

## 📋 Exemplo Completo

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ Rota PÚBLICA - Todos podem ver produtos
  @Get()
  async list() {
    return this.productService.findAll();
  }

  // 🔒 Rota PROTEGIDA - Apenas autenticados podem criar
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: any,
    @CurrentUser() user: any,
  ) {
    console.log(`Produto criado por: ${user.name}`);
    return this.productService.create(createDto);
  }

  // 🔒 Rota PROTEGIDA - Apenas autenticados veem seus favoritos
  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async favorites(@CurrentUser() user: any) {
    return this.productService.findFavorites(user.id);
  }
}
```

## 🧪 Testando com Postman/Insomnia

### 1. Faça Login
```
POST http://localhost:3000/auth/login
Body: {"email": "...", "password": "..."}
```

### 2. Copie o Token
```
Copie o valor de "access_token" da resposta
```

### 3. Use em Rotas Protegidas
```
GET http://localhost:3000/users/me
Headers: 
  Authorization: Bearer <cole_o_token_aqui>
```

## ❌ Erros Comuns

### 401 Unauthorized
- Token expirado → Faça login novamente
- Token inválido → Verifique se copiou corretamente
- Sem token → Adicione o header Authorization

### 403 Forbidden
- Usuário sem permissão para acessar o recurso

## 🎯 Resumo

✅ **Rotas Públicas** → Sem @UseGuards  
🔒 **Rotas Protegidas** → Com @UseGuards(JwtAuthGuard)  
👤 **Pegar Usuário** → Use @CurrentUser()  
🔑 **Token válido por** → 7 dias (configurável no .env)  

## 📂 Estrutura de Arquivos

```
src/
├── guards/
│   └── jwt-auth.guard.ts      # Guard para proteger rotas
├── strategies/
│   └── jwt.strategy.ts        # Valida e decodifica o token
├── decorators/
│   └── current-user.decorator.ts  # Pega usuário do request
├── controllers/
│   ├── auth.controller.ts     # Login/Register (público)
│   └── user.controller.ts     # Perfil (protegido)
└── services/
    └── auth.service.ts        # Gera e valida JWT
```
