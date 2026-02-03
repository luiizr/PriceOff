import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
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