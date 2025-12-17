import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * DECORATOR - Pega o usuário autenticado
 * 
 * Use: @CurrentUser() user: any
 * 
 * Retorna os dados do usuário logado
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
