import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, LoginResponseDto, RegisterDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

/**
 * SERVICE - Lógica de negócio de Autenticação
 * Contém as regras de negócio e orquestra os repositories
 */
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Login do usuário
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // if (!user.isActive) {
    //   throw new UnauthorizedException('Usuário inativo');
    // }

    const token = this.generateToken(user.id);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Registro de novo usuário
   */
  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private generateToken(userId: string): string {
    // Simplificado - implementar JWT depois
    return `token_${userId}_${Date.now()}`;
  }
}
