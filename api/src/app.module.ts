import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importar todas as entidades
import { User } from './entities/user.entity';

// Importar todos os controllers
import { AuthController } from './controllers/auth.controller';

// Importar todos os services
import { AuthService } from './services/auth.service';

// Importar todos os repositories
import { UserRepository } from './repositories/user.repository';

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
      entities: [User], // Registrar todas as entidades aqui
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    // Registrar entidades para injeção
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    AppController,
    AuthController, // Adicionar todos os controllers aqui
  ],
  providers: [
    AppService,
    AuthService, // Adicionar todos os services aqui
    UserRepository, // Adicionar todos os repositories aqui
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middlewares aqui
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
