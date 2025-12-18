import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../auth/login.component';
import { RegisterComponent } from '../auth/register.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

/**
 * TELA INICIAL
 * Verifica se usuário está logado
 * Se não, mostra modal de login/registro
 */
@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, CardModule, ButtonModule],
  templateUrl: './telaInicial.component.html',
  styleUrls: ['./telaInicial.component.scss']
})
export class TelaInicialComponent {
  isAuthenticated = false;
  authMode: 'login' | 'register' = 'login';
  currentUser: any = null;

  constructor(private authService: AuthService) {
    // Verifica autenticação
    this.checkAuth();

    // Observa mudanças no usuário
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  checkAuth(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  setAuthMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
  }

  logout(): void {
    this.authService.logout();
  }
}
