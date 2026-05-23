import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  confirmar = '';
  error = '';
  cargando = false;

  registro(): void {
    if (!this.nombre || !this.email || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    if (this.password !== this.confirmar) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.registro({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: user => {
        this.cargando = false;
        if (user.id) {
          this.carritoService.sincronizarCarrito(user.id).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/'])
          });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al registrar. ¿Está json-server corriendo?';
      }
    });
  }
}
