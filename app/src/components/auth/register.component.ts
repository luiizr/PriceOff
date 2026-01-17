import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * COMPONENTE - Registro
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Output() authSuccess = new EventEmitter<void>();
  @Output() authError = new EventEmitter<string>();

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  acceptTerms = false;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Validação de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validação de força da senha
   */
  getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    if (this.password.length < 6) return 'weak';
    if (
      this.password.length >= 12 &&
      /[A-Z]/.test(this.password) &&
      /[0-9]/.test(this.password)
    ) {
      return 'strong';
    }
    return 'medium';
  }

  /**
   * Submit do formulário de registro
   */
  onSubmit(): void {
    // Validação básica
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Preencha todos os campos obrigatórios';
      this.authError.emit(this.error);
      return;
    }

    // Validação de nome
    if (this.name.trim().length < 3) {
      this.error = 'Nome deve ter no mínimo 3 caracteres';
      this.authError.emit(this.error);
      return;
    }

    // Validação de email
    if (!this.isValidEmail(this.email)) {
      this.error = 'Email inválido';
      this.authError.emit(this.error);
      return;
    }

    // Validação de senha
    if (this.password.length < 6) {
      this.error = 'Senha deve ter no mínimo 6 caracteres';
      this.authError.emit(this.error);
      return;
    }

    // Validação de confirmação de senha
    if (this.password !== this.confirmPassword) {
      this.error = 'As senhas não coincidem';
      this.authError.emit(this.error);
      return;
    }

    // Validação de termos
    if (!this.acceptTerms) {
      this.error = 'Você deve aceitar os Termos de Serviço';
      this.authError.emit(this.error);
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.error = '';
        // Limpar formulário
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.acceptTerms = false;
        // Emitir evento de sucesso
        this.authSuccess.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err.error?.message || 'Erro ao fazer registro. Tente novamente.';
        this.authError.emit(this.error);
      },
    });
  }
}
