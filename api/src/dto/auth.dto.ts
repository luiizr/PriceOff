/**
 * DTO para Login
 */
export class LoginDto {
  email: string;
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
  name: string;
  email: string;
  password: string;
}
