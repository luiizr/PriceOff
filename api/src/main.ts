import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  try {
    const porta = process.env.PORTA || 3000;
    const app = await NestFactory.create(AppModule);

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
