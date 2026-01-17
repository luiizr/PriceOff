import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * COMPONENTE - Login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() authSuccess = new EventEmitter<void>();
  @Output() authError = new EventEmitter<string>();

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Validação de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Submit do formulário de login
   */
  onSubmit(): void {
    // Validação básica
    if (!this.email || !this.password) {
      this.error = 'Email e senha são obrigatórios';
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
    if (this.password.length < 3) {
      this.error = 'Senha deve ter no mínimo 3 caracteres';
      this.authError.emit(this.error);
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.error = '';
        // Limpar formulário
        this.email = '';
        this.password = '';
        // Emitir evento de sucesso
        this.authSuccess.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err.error?.message ||
          'Erro ao fazer login. Verifique suas credenciais.';
        this.authError.emit(this.error);
      },
    });
  }
}
