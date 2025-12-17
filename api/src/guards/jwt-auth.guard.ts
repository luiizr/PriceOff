import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * GUARD - JWT Auth Guard
 * Protege rotas que requerem autenticação
 * 
 * Use com @UseGuards(JwtAuthGuard) nas rotas
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
