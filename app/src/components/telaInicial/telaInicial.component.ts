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
    RouterModule
  ],
  templateUrl: './telaInicial.component.html',
  styleUrls: ['./telaInicial.component.scss']
})
export class TelaInicialComponent {
  isAuthenticated = false;
  authMode: 'login' | 'register' = 'login';
  currentUser: any = null;
  


  // Signals
  menuItens = signal<itensMenu[]>([]);



  constructor(private authService: AuthService) {
    // Verifica autenticação
    this.checkAuth();
    
    // Observa mudanças no usuário
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
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
          }
        }
      ])
      console.info('Menu Itens:', this.menuItens());
    })
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
