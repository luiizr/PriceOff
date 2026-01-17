import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../auth/login.component';
import { RegisterComponent } from '../auth/register.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';

/**
 * TELA INICIAL
 * Verifica se usuário está logado
 * Se não, mostra modal de login/registro
 */

interface itensMenu {
  label: string;
  icon: string;
  command: () => void;
}

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    CardModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    AvatarModule,
    RouterModule,
  ],
  templateUrl: './telaInicial.component.html',
  styleUrls: ['./telaInicial.component.scss'],
})
export class TelaInicialComponent {
  isAuthenticated = false;
  authMode: 'login' | 'register' = 'login';
  currentUser: any = null;
  globalError: string | null = null;

  // Signals
  menuItens = signal<itensMenu[]>([]);

  constructor(private authService: AuthService) {
    // Verifica autenticação
    this.checkAuth();

    // Observa mudanças no usuário
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      if (user) {
        this.globalError = null; // Limpar erro ao autenticar
      }
    });

    effect(() => {
      console.info('Current User:', this.currentUser);
      // Inicializar botões do menu
      this.menuItens.set([
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          command: () => {
            console.log('Navegar para Dashboard');
          },
        },
        {
          label: 'Meus Produtos',
          icon: 'pi pi-fw pi-list',
          command: () => {
            console.log('Navegar para Meus Produtos');
          },
        },
        {
          label: 'Sair',
          icon: 'pi pi-fw pi-sign-out',
          command: () => {
            this.logout();
          },
        },
      ]);
      console.info('Menu Itens:', this.menuItens());
    });
  }

  /**
   * Verifica status de autenticação
   */
  checkAuth(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Muda entre abas de login e registro
   */
  setAuthMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.globalError = null; // Limpar erro ao trocar aba
  }

  /**
   * Callback quando autenticação é bem sucedida
   */
  onAuthSuccess(): void {
    console.log('✅ Autenticação bem-sucedida!');
    this.globalError = null;
    // O isAuthenticated é atualizado automaticamente pelo subscription acima
  }

  /**
   * Callback quando há erro na autenticação
   */
  onAuthError(error: string): void {
    console.error('❌ Erro de autenticação:', error);
    this.globalError = error;
  }

  /**
   * Faz logout do usuário
   */
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authMode = 'login';
    this.globalError = null;
  }
}
