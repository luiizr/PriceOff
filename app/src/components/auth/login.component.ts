import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  // Add a robust email pattern validation
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Normalize user input
    const email = this.email.trim();
    const password = this.password;

    if (!email || !password) {
      this.error = 'Preencha todos os campos';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.error = 'Digite um email válido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        // Login bem sucedido - usuário já está autenticado
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao fazer login';
      }
    });
  }
}
