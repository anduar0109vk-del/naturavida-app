import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  productos: Producto[] = [];
  mostrarFormulario = false;
  editando = false;
  toast = { visible: false, mensaje: '', tipo: 'ok' };

  form: Producto = this.productoVacio();

  categorias = ['capilar', 'piel', 'insumos'] as const;
  marcas = ['BioNatur', 'AlmaVerde', 'TerraVital'] as const;

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(p => this.productos = p);
  }

  productoVacio(): Producto {
    return { nombre: '', detalle: '', precio: 0, categoria: 'capilar', marca: 'BioNatur', imagen: '', descripcion: '', modoUso: '', ingredientes: '' };
  }

  abrirNuevo(): void {
    this.form = this.productoVacio();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  editarProducto(p: Producto): void {
    this.form = { ...p };
    this.editando = true;
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.precio) {
      this.mostrarToast('Completa los campos obligatorios.', 'error');
      return;
    }
    if (this.editando && this.form.id) {
      this.productoService.updateProducto(this.form.id, this.form).subscribe({
        next: () => {
          this.mostrarToast('Producto actualizado', 'ok');
          this.cancelar();
          this.cargarProductos();
        }
      });
    } else {
      this.productoService.addProducto(this.form).subscribe({
        next: () => {
          this.mostrarToast('Producto agregado', 'ok');
          this.cancelar();
          this.cargarProductos();
        }
      });
    }
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.productoService.deleteProducto(p.id!).subscribe({
      next: () => {
        this.mostrarToast('Producto eliminado', 'ok');
        this.cargarProductos();
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.form = this.productoVacio();
  }

  mostrarToast(mensaje: string, tipo: 'ok' | 'error'): void {
    this.toast = { visible: true, mensaje, tipo };
    setTimeout(() => this.toast = { visible: false, mensaje: '', tipo: 'ok' }, 2500);
  }
}
