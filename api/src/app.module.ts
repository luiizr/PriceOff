import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importar todas as entidades
import { User } from './entities/user.entity';

// Importar todos os controllers
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

// Importar todos os services
import { AuthService } from './services/auth.service';

// Importar todos os repositories
import { UserRepository } from './repositories/user.repository';

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
      entities: [User], // Registrar todas as entidades aqui
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    // Registrar entidades para injeção
    TypeOrmModule.forFeature([User]),
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
    AuthController, // Adicionar todos os controllers aqui
    UserController, // Controller de usuários (protegido)
  ],
  providers: [
    AppService,
    AuthService, // Adicionar todos os services aqui
    UserRepository, // Adicionar todos os repositories aqui
    JwtStrategy, // Adicionar strategies aqui
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middlewares aqui
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
