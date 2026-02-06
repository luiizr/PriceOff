import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

/**
 * COMPONENTE - Registro
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() switchMode = new EventEmitter<void>();

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;

  // Padrões de validação robusto
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private namePattern = /^[a-zA-ZÀ-ÿ\s]{3,}$/; // Mínimo 3 caracteres, apenas letras
  private MIN_PASSWORD_LENGTH = 6;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.error = '';
  }

  /**
   * Valida campo de nome
   */
  isNameValid(): boolean {
    if (!this.name) return false;
    const trimmedName = this.name.trim();
    return trimmedName.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName);
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
    return this.password.length >= this.MIN_PASSWORD_LENGTH;
  }

  /**
   * Valida se as senhas coincidem
   */
  doPasswordsMatch(): boolean {
    if (!this.password || !this.confirmPassword) return true; // Não valida se vazio
    return this.password === this.confirmPassword;
  }

  /**
   * Valida se o formulário pode ser enviado
   */
  isFormValid(): boolean {
    return (
      this.isNameValid() &&
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.doPasswordsMatch()
    );
  }

  /**
   * Processa o envio do formulário
   */
  onSubmit(): void {
    // Normaliza inputs do usuário
    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password;
    const confirmPassword = this.confirmPassword;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    if (!this.isNameValid()) {
      this.error = 'Nome deve ter no mínimo 3 caracteres e conter apenas letras';
      return;
    }

    if (!this.isEmailValid()) {
      this.error = 'Por favor, insira um email válido';
      return;
    }

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      this.error = `Senha deve ter no mínimo ${this.MIN_PASSWORD_LENGTH} caracteres`;
      return;
    }

    if (password !== confirmPassword) {
      this.error = 'As senhas não coincidem. Verifique e tente novamente.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Registro realizado com sucesso! Bem-vindo!',
          life: 3000
        });
        // Navegação é feita automaticamente pelo service
      },
      error: (err) => {
        this.loading = false;

        // Trata diferentes tipos de erro
        if (err.status === 0) {
          this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (err.status === 400) {
          const message = err.error?.message;
          if (message?.includes('Email')) {
            this.error = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
          } else {
            this.error = message || 'Dados inválidos. Verifique e tente novamente.';
          }
        } else if (err.status === 409) {
          this.error = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (err.status === 429) {
          this.error = 'Muitas tentativas. Aguarde uns minutos e tente novamente.';
        } else if (err.status >= 500) {
          this.error = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          this.error = err.error?.message || 'Erro ao fazer registro. Verifique seus dados.';
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
