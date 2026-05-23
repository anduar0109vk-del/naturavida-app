import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { CarritoService } from './core/services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    main { min-height: 100vh; display: flex; flex-direction: column; }
  `]
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private carritoService = inject(CarritoService);

  ngOnInit(): void {
    this.carritoService.cargarCarrito();
  }
}
