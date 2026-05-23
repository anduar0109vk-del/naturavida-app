import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);

  producto: Producto | null = null;
  cargando = true;
  cantidad = 1;
  tabActiva: 'descripcion' | 'modo' | 'ingredientes' = 'descripcion';
  toast = { visible: false, mensaje: '' };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.getProductoById(id).subscribe({
      next: p => { this.producto = p; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  setTab(tab: 'descripcion' | 'modo' | 'ingredientes'): void {
    this.tabActiva = tab;
  }

  cambiarCantidad(delta: number): void {
    this.cantidad = Math.max(1, this.cantidad + delta);
  }

  agregarAlCarrito(): void {
    if (!this.producto) return;
    this.carritoService.agregarItem(this.producto, this.cantidad).subscribe({
      next: () => this.mostrarToast('¡Añadido al carrito!'),
      error: () => this.mostrarToast('Error al agregar.')
    });
  }

  mostrarToast(mensaje: string): void {
    this.toast = { visible: true, mensaje };
    setTimeout(() => this.toast = { visible: false, mensaje: '' }, 2500);
  }

  getCategoriaLabel(): string {
    const map: Record<string, string> = {
      capilar: 'Cuidado Capilar',
      piel: 'Cuidado de la Piel',
      insumos: 'Insumos Naturales'
    };
    return map[this.producto?.categoria ?? ''] ?? '';
  }
}
