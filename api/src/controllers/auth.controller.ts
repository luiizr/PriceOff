import { Controller, Post, Get, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto, RegisterDto } from '../dto/auth.dto';

/**
 * CONTROLLER - Define rotas e processa requisições
 * FLUXO: Request → Controller → Service → Repository → Database
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Faz login e retorna token JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw error; // O serviço já lança exceções adequadas
    }
  }

  /**
   * POST /auth/register
   * Registra novo usuário e retorna token JWT
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw error; // O serviço já lança exceções adequadas
    }
  }

  /**
   * GET /auth/status
   * Verifica se o serviço de autenticação está rodando
   */
  @Get('status')
  async status() {
    return { message: 'Auth service is running' };
  }
}
