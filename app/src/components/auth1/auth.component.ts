import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLoginMode = true;

  // Campos do formulário
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  // Estados
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  formSubmitted = false;

  // Validação
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private MIN_PASSWORD_LENGTH = 6;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.clearForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.error = '';
    this.formSubmitted = false;
  }

  clearError() {
    this.error = '';
  }

  // Validações
  isNameValid(): boolean {
    if (!this.name) return false;
    const trimmedName = this.name.trim();
    return trimmedName.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName);
  }

  isEmailValid(): boolean {
    if (!this.email) return false;
    return this.emailPattern.test(this.email.trim());
  }

  isPasswordValid(): boolean {
    return this.password.length >= this.MIN_PASSWORD_LENGTH;
  }

  doPasswordsMatch(): boolean {
    if (!this.confirmPassword) return true;
    return this.password === this.confirmPassword;
  }

  isLoginFormValid(): boolean {
    return this.isEmailValid() && this.password.length > 0;
  }

  isRegisterFormValid(): boolean {
    return (
      this.isNameValid() &&
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.password === this.confirmPassword
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!email || !password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.error = 'Por favor, insira um email válido';
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
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err);
      }
    });
  }

  private handleRegister() {
    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!name || !email || !password || !this.confirmPassword) {
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

    if (password !== this.confirmPassword) {
      this.error = 'As senhas não coincidem';
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
          detail: 'Conta criada com sucesso! Bem-vindo!',
          life: 3000
        });
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, true);
      }
    });
  }

  private handleError(err: any, isRegister = false) {
    if (err.status === 0) {
      this.error = 'Erro de conexão. Verifique sua internet.';
    } else if (err.status === 401) {
      this.error = 'Email ou senha incorretos.';
    } else if (err.status === 409) {
      this.error = 'Este email já está cadastrado.';
    } else if (err.status === 400) {
      const message = err.error?.message;
      if (message?.includes('Email')) {
        this.error = 'Este email já está cadastrado.';
      } else {
        this.error = message || 'Dados inválidos.';
      }
    } else if (err.status === 429) {
      this.error = 'Muitas tentativas. Aguarde um momento.';
    } else if (err.status >= 500) {
      this.error = 'Erro no servidor. Tente novamente mais tarde.';
    } else {
      this.error = err.error?.message || (isRegister ? 'Erro ao criar conta.' : 'Erro ao fazer login.');
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: this.error,
      life: 5000
    });
  }
}