import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories/user.repository';

/**
 * STRATEGY - Estratégia JWT
 * Valida o token e busca o usuário
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  /**
   * Valida o payload do token e retorna o usuário
   */
  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);
    
    if (!user) {
      return null;
    }

    // Retorna o usuário que será injetado no request
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
