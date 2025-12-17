import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * GET /auth/status
   */
  @Get('status')
  async status() {
    return { message: 'Auth service is running' };
  }
}
