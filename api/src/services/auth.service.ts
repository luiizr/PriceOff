import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, LoginResponseDto, RegisterDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';


/**
 * SERVICE - Lógica de negócio de Autenticação
 * Contém as regras de negócio e orquestra os repositories
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

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
      // Use proper HTTP semantics for conflicts
      throw new ConflictException('Email já cadastrado');
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

  /**
   * Gera token JWT
   */
  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  /**
   * Valida token JWT e retorna o usuário
   */
  async validateUser(userId: string) {
    return this.userRepository.findById(userId);
  }
}
