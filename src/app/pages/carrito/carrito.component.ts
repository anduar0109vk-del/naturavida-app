import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { ItemCarrito } from '../../core/models/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  carritoService = inject(CarritoService);
  authService = inject(AuthService);
  pedidoConfirmado = false;

  ngOnInit(): void {
    this.carritoService.cargarCarrito();
  }

  cambiarCantidad(item: ItemCarrito, delta: number): void {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;
    this.carritoService.actualizarCantidad(item, nuevaCantidad).subscribe();
  }

  quitarItem(item: ItemCarrito): void {
    if (!item.id) return;
    this.carritoService.quitarItem(item.id).subscribe();
  }

  confirmarPedido(): void {
    const items = this.carritoService.items();
    if (items.length === 0) return;

    let mensaje = 'Hola NaturaVida, quisiera confirmar el siguiente pedido:\n\n';
    items.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.nombre} (S/ ${(item.precio * item.cantidad).toFixed(2)})\n`;
    });
    mensaje += `\n*Total:* S/ ${this.carritoService.totalPrecio().toFixed(2)}\n`;

    const url = `https://wa.me/51929877999?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    this.carritoService.limpiarCarrito();
    this.pedidoConfirmado = true;
  }
}
