import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

/**
 * GUARD - Protege rotas que requerem autenticação
 * Valida o JWT token enviado no header Authorization
 */
@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {}
