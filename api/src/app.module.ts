import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importar todas as entidades
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { Budget } from './entities/budget.entity';

// Importar todos os controllers
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { TransactionController } from './controllers/transaction.controller';
import { CategoryController } from './controllers/category.controller';
import { BudgetController } from './controllers/budget.controller';
import { DashboardController } from './controllers/dashboard.controller';

// Importar todos os services
import { AuthService } from './services/auth.service';
import { TransactionService } from './services/transaction.service';
import { CategoryService } from './services/category.service';
import { BudgetService } from './services/budget.service';
import { DashboardService } from './services/dashboard.service';

// Importar todos os repositories
import { UserRepository } from './repositories/user.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { CategoryRepository } from './repositories/category.repository';
import { BudgetRepository } from './repositories/budget.repository';

// Importar strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Importar middlewares
import { LoggerMiddleware } from './middlewares/logger.middleware';

/**
 * APP MODULE - Módulo principal
 * Estrutura horizontal onde cada camada está separada
 */
@Module({
  imports: [
    // Configuração do TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST!,
      port: parseInt(process.env.BD_PORT!),
      username: process.env.BD_USERNAME!,
      password: process.env.BD_PASSWORD!,
      database: process.env.BD_DATABASE!,
      entities: [User, Transaction, Category, Budget], // Registrar todas as entidades aqui
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    // Registrar entidades para injeção
    TypeOrmModule.forFeature([User, Transaction, Category, Budget]),
    // Configuração do Passport
    PassportModule,
    // Configuração do JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { 
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TransactionController,
    CategoryController,
    BudgetController,
    DashboardController,
  ],
  providers: [
    AppService,
    AuthService,
    TransactionService,
    CategoryService,
    BudgetService,
    DashboardService,
    UserRepository,
    TransactionRepository,
    CategoryRepository,
    BudgetRepository,
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middlewares aqui
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
