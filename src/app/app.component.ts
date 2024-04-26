import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RoutesEnum } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  routes = RoutesEnum;
  title = 'SignR';
}
