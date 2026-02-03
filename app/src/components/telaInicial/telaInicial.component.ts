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
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {
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

  // Suggested menu items suited for a financial summaries app
  getMenuItems(): MenuItem[] {
    return [
      { label: 'Visão Geral', icon: 'pi pi-chart-bar', routerLink: '/dashboard', shortcut: 'G' },

      { separator: true },

      { label: 'Transações', icon: 'pi pi-list', routerLink: '/transacoes', badge: '12', shortcut: 'T' },
      { label: 'Contas', icon: 'pi pi-credit-card', routerLink: '/contas', shortcut: 'C' },
      { label: 'Orçamentos', icon: 'pi pi-wallet', routerLink: '/orcamentos', shortcut: 'O' },

      { separator: true },

      {
        label: 'Relatórios',
        icon: 'pi pi-chart-line',
        shortcut: 'R',
        items: [
          { label: 'Por Categoria', routerLink: '/relatorios/categorias' },
          { label: 'Fluxo de Caixa', routerLink: '/relatorios/fluxo-caixa' },
          { label: 'Receitas vs. Despesas', routerLink: '/relatorios/receitas-despesas' }
        ]
      },
      { label: 'Investimentos', icon: 'pi pi-briefcase', routerLink: '/investimentos', shortcut: 'I' },
      { label: 'Metas', icon: 'pi pi-flag', routerLink: '/metas', shortcut: 'M' },

      { separator: true },

      { label: 'Configurações', icon: 'pi pi-cog', routerLink: '/configuracoes', shortcut: 'S' }
    ];
  }

  // Logout handler for the sidebar button
  logout(): void {
    // TODO: plug into your AuthService if applicable.
    // Ex: this.authService.logout();
    // For now, we just route to login and flip auth state (if you manage it locally).
    this.router.navigate(['/login']);
  }
}
