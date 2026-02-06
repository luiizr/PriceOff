import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation.filter';
import { DataSource } from 'typeorm';

async function bootstrap() {
  try {
    const porta = process.env.PORTA || 3000;
    const app = await NestFactory.create(AppModule);

    // Exception filter para erros de validação
    app.useGlobalFilters(new ValidationExceptionFilter());

    // Configuração do ValidationPipe para validar DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove propriedades não definidas no DTO
        forbidNonWhitelisted: true, // Lança erro para propriedades não definidas
        transform: true, // Transforma payloads para instâncias de DTOs
        transformOptions: {
          enableImplicitConversion: true, // Conversão automática de tipos
        },
      }),
    );

    // Configuração do CORS
    app.enableCors({
      origin: ['http://localhost:4200'], // URL do frontend Angular
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true, // Permite envio de cookies e headers de autenticação
      allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    });

    // Verificar conexão com banco de dados
    try {
      const dataSource = app.get(DataSource);
      if (dataSource.isInitialized) {
        console.info('\n✓ Banco de dados PostgreSQL conectado com sucesso!');
        console.info(`  Host: ${process.env.BD_HOST}`);
        console.info(`  Database: ${process.env.BD_DATABASE}`);
        console.info(`  Port: ${process.env.BD_PORT}`);
      } else {
        console.error('\n✗ Erro ao conectar com o banco de dados PostgreSQL');
      }
    } catch (dbError) {
      console.error('\n✗ Erro ao conectar com o banco de dados PostgreSQL');
      console.error(`  Erro: ${dbError.message}`);
    }

    await app.listen(porta);
    console.info(`\n✓ Aplicação rodando na porta ${porta}`);
    console.info(`  URL: http://localhost:${porta}\n`);
  } catch (error) {
    console.error('\n✗ Erro ao iniciar a aplicação:', error.message);
    process.exit(1);
  }
}
bootstrap();
