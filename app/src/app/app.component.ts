import { Component } from '@angular/core';
import { TelaInicialComponent } from '../components/telaInicial/telaInicial.component';

@Component({
  selector: 'app-root',
  imports: [TelaInicialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PriceOff';
}
