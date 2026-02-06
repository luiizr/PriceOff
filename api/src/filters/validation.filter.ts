import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * EXCEPTION FILTER - Trata erros de validação de forma customizada
 * Transforma erros do class-validator em mensagens mais legíveis
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Se houver erros de validação, transforma em formato mais legível
    const errors = exceptionResponse.message;
    let message = 'Dados inválidos';

    if (Array.isArray(errors)) {
      // Se tiver erros de validação, usa a primeira mensagem
      const firstError = errors[0];
      if (typeof firstError === 'object' && firstError.constraints) {
        const constraints = Object.values(firstError.constraints);
        message = constraints[0] as string;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
