import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * DECORATOR - Pega os argumentos do WhatsApp
 * 
 * Use: @whatsappArgs()
 * 
 * Retorna os dados do whatsapp associado ao usuário logado
 */
export const WhatsappArgs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.whatsapp;
  },
);
