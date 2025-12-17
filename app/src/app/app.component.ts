import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelaInicialComponent } from '../components/telaInicial/telaInicial.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TelaInicialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PriceOff';
}
