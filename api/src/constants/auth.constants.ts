/**
 * CONSTANTS - Mensagens de erro de autenticação
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado',
  INVALID_EMAIL: 'Email deve ser um email válido',
  PASSWORD_TOO_SHORT: 'Senha deve ter no mínimo 6 caracteres',
  NAME_REQUIRED: 'Nome é obrigatório',
  EMAIL_REQUIRED: 'Email é obrigatório',
  PASSWORD_REQUIRED: 'Senha é obrigatória',
  INVALID_NAME: 'Nome deve conter apenas letras e espaços',
  USER_NOT_FOUND: 'Usuário não encontrado',
  UNAUTHORIZED: 'Não autorizado',
};

export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  REGISTER_SUCCESS: 'Registro realizado com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
};
