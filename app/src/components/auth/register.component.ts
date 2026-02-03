import { Component } from '@angular/core';
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
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;

  // Add a robust email pattern validation
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Normalize inputs
    const name = this.name.trim();
    const email = this.email.trim();
    const password = this.password;
    const confirmPassword = this.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      this.error = 'Preencha todos os campos';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.error = 'Digite um email válido';
      return;
    }

    if (password !== confirmPassword) {
      this.error = 'As senhas não coincidem';
      return;
    }

    if (password.length < 6) {
      this.error = 'A senha deve ter no mínimo 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.loading = false;
        // Registro bem sucedido - usuário já está autenticado
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao fazer registro';
      }
    });
  }
}
