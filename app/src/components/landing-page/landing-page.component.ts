import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth1/auth.component'; 

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {
  @ViewChildren('animateItem') animateItems!: QueryList<ElementRef>;

  // Mensagens do Chat (Fluxo Inverso: Bot começa)
  chatMessages = [
    { 
      type: 'bot', 
      text: '🤖 Olá! Identifiquei uma compra de R$ 24,90 na "Cafeteria Aroma". Gasto adicionado em 🍔 Alimentação.', 
      time: '10:42' 
    },
    { 
      type: 'user', 
      text: 'Boa! Quanto ainda posso gastar hoje?', 
      time: '10:43' 
    },
    { 
      type: 'bot', 
      text: 'Sua meta diária é R$ 100,00. Você ainda tem R$ 75,10 livres. Quer que eu segure as pontas?', 
      time: '10:43' 
    }
  ];

  features = [
    {
      icon: 'ti ti-microphone',
      title: 'Fale, não digite',
      desc: 'Envie áudios de 5s no WhatsApp e a IA extrai valor, local e categoria automaticamente.'
    },
    {
      icon: 'ti ti-chart-pie',
      title: 'Clareza Visual',
      desc: 'Gráficos que você realmente entende. Veja para onde seu dinheiro vai sem precisar de um curso.'
    },
    {
      icon: 'ti ti-brain',
      title: 'IA Consultora',
      desc: 'Receba conselhos do tipo "Você gastou 30% a mais em Uber esse mês, cuidado."'
    },
    {
      icon: 'ti ti-file-text',
      title: 'Relatórios PDF',
      desc: 'Resumos mensais prontos para imprimir ou enviar para seu contador (ou parceiro).'
    }
  ];

  plans = [
    {
      name: 'Starter',
      price: '0',
      period: '/mês',
      desc: 'Para testar e organizar o básico.',
      features: [
        '50 lançamentos mensais',
        'Categorização automática',
        'Relatório mensal simples',
        'Suporte por email'
      ],
      highlight: false,
      cta: 'Começar Agora'
    },
    {
      name: 'Pro',
      price: '29,90',
      period: '/mês',
      desc: 'Controle total e inteligência ilimitada.',
      features: [
        'Lançamentos ilimitados',
        'Consultor de IA via WhatsApp',
        'Reconhecimento de áudio complexo',
        'Alertas de orçamento em tempo real',
        'Acesso ao Dashboard Pro'
      ],
      highlight: true,
      tag: 'Mais Escolhido',
      cta: 'Testar 7 Dias Grátis'
    },
    {
      name: 'Lifetime',
      price: '299',
      period: 'único',
      desc: 'Pague uma vez, economize para sempre.',
      features: [
        'Tudo do plano Pro',
        'Acesso vitalício',
        'Sem mensalidades',
        'Prioridade nas novas ferramentas',
        'Suporte via WhatsApp'
      ],
      highlight: false,
      cta: 'Acesso Vitalício'
    }
  ];

  faqs = [
    { question: 'Preciso instalar algum aplicativo?', answer: 'Não! Tudo acontece dentro do seu WhatsApp. Sem downloads, sem ocupar memória.', open: false },
    { question: 'Meus dados bancários estão seguros?', answer: 'Sim. Utilizamos criptografia de ponta a ponta e não pedimos sua senha do banco. Apenas lemos notificações ou o que você digita.', open: false },
    { question: 'A IA entende áudios?', answer: 'Perfeitamente. Você pode mandar um áudio de 10 segundos falando sobre seus gastos do dia e ela organiza tudo.', open: false }
  ];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');
        }
      });
    }, { threshold: 0.1 });

    this.animateItems.forEach(item => {
      observer.observe(item.nativeElement);
    });
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

}