import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * DTO para Login
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email deve ser um email válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(1, { message: 'Senha é obrigatória' })
  password: string;
}

/**
 * DTO para resposta de Login
 */
export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * DTO para Registro
 */
export class RegisterDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome não pode ter mais de 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Nome deve conter apenas letras e espaços' })
  name: string;

  @IsEmail({}, { message: 'Email deve ser um email válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(100, { message: 'Senha não pode ter mais de 100 caracteres' })
  password: string;
}

