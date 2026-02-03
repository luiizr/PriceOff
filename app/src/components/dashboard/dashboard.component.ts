import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Simulando dados que viriam do Backend/WhatsApp
  userName = 'Carlos';
  currentDate = new Date();
  
  whatsappStatus = 'connected'; // connected, disconnected

  stats = [
    { label: 'Saldo Atual', value: 'R$ 3.450,00', icon: 'ti-wallet', trend: '+12%', color: 'success' },
    { label: 'Gastos Hoje', value: 'R$ 124,90', icon: 'ti-shopping-cart', trend: '+5%', color: 'warning' },
    { label: 'Economia', value: 'R$ 890,00', icon: 'ti-piggy-bank', trend: '+18%', color: 'primary' },
  ];

  recentTransactions = [
    { id: 1, title: 'Supermercado Extra', cat: 'Alimentação', val: -450.00, date: '10:42', type: 'out' },
    { id: 2, title: 'Freela Design', cat: 'Renda Extra', val: 1200.00, date: 'Ontem', type: 'in' },
    { id: 3, title: 'Uber', cat: 'Transporte', val: -24.90, date: 'Ontem', type: 'out' },
    { id: 4, title: 'Spotify', cat: 'Assinatura', val: -21.90, date: '21/10', type: 'out' },
  ];
}