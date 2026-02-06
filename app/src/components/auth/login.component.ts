import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

/**
 * COMPONENTE - Login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() switchMode = new EventEmitter<void>();

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  // Padrão de validação de email robusto
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.error = '';
  }

  /**
   * Valida campo de email
   */
  isEmailValid(): boolean {
    if (!this.email) return false;
    return this.emailPattern.test(this.email.trim());
  }

  /**
   * Valida campo de senha
   */
  isPasswordValid(): boolean {
    return this.password.length > 0;
  }

  /**
   * Valida se o formulário pode ser enviado
   */
  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  /**
   * Processa o envio do formulário
   */
  onSubmit(): void {
    // Normaliza input do usuário
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    // Validações
    if (!email || !password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.error = 'Por favor, insira um email válido';
      return;
    }

    if (password.length < 1) {
      this.error = 'Por favor, insira uma senha';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!',
          life: 3000
        });
        // Navegação é feita automaticamente pelo service
      },
      error: (err) => {
        this.loading = false;
        
        // Trata diferentes tipos de erro
        if (err.status === 0) {
          this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (err.status === 401) {
          this.error = 'Email ou senha incorretos. Tente novamente.';
        } else if (err.status === 400) {
          this.error = err.error?.message || 'Dados inválidos. Verifique e tente novamente.';
        } else if (err.status === 429) {
          this.error = 'Muitas tentativas. Aguarde uns minutos e tente novamente.';
        } else if (err.status >= 500) {
          this.error = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          this.error = err.error?.message || 'Erro ao fazer login. Verifique seus dados.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: this.error,
          life: 5000
        });
      }
    });
  }
}
