import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRepository } from '../repositories/user.repository';

/**
 * CONTROLLER - Rotas de Usuário (Protegidas)
 * Todas as rotas aqui requerem autenticação JWT
 */
@Controller('users')
@UseGuards(JwtAuthGuard) // Protege TODAS as rotas deste controller
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * GET /users/me
   * Retorna dados do usuário logado
   * 
   * Exemplo de uso:
   * Headers: Authorization: Bearer <seu_token_jwt>
   */
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  /**
   * PUT /users/me
   * Atualiza dados do usuário logado
   */
  @Put('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateData: { name?: string },
  ) {
    await this.userRepository.update(user.id, updateData);
    return { message: 'Perfil atualizado com sucesso' };
  }

  /**
   * GET /users/all
   * Lista todos os usuários (apenas para teste)
   */
  @Get('all')
  async listAll() {
    return this.userRepository.findAll();
  }
}
