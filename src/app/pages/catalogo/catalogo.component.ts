import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  todosLosProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  categoriaActual = 'todos';
  precioMaximo = 60;
  marcasSeleccionadas: string[] = [];
  textoBusqueda = '';
  cargando = true;

  marcas = ['BioNatur', 'AlmaVerde', 'TerraVital'];
  categorias = [
    { slug: 'todos', label: 'Todos los productos' },
    { slug: 'capilar', label: 'Cuidado Capilar' },
    { slug: 'piel', label: 'Cuidado de la Piel' },
    { slug: 'insumos', label: 'Insumos Naturales' }
  ];

  toast = { visible: false, mensaje: '' };

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.todosLosProductos = productos;
      this.cargando = false;
      this.route.queryParams.subscribe(params => {
        if (params['categoria']) this.categoriaActual = params['categoria'];
        if (params['search']) this.textoBusqueda = params['search'];
        this.filtrar();
      });
    });
  }

  filtrar(): void {
    let resultado = [...this.todosLosProductos];
    if (this.categoriaActual !== 'todos') {
      resultado = resultado.filter(p => p.categoria === this.categoriaActual);
    }
    resultado = resultado.filter(p => p.precio <= this.precioMaximo);
    if (this.marcasSeleccionadas.length > 0) {
      resultado = resultado.filter(p => this.marcasSeleccionadas.includes(p.marca));
    }
    if (this.textoBusqueda.trim()) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
    }
    this.productosFiltrados = resultado;
  }

  seleccionarCategoria(slug: string): void {
    this.categoriaActual = slug;
    this.filtrar();
  }

  toggleMarca(marca: string): void {
    const idx = this.marcasSeleccionadas.indexOf(marca);
    if (idx >= 0) {
      this.marcasSeleccionadas.splice(idx, 1);
    } else {
      this.marcasSeleccionadas.push(marca);
    }
    this.filtrar();
  }

  isMarcaChecked(marca: string): boolean {
    return this.marcasSeleccionadas.includes(marca);
  }

  limpiarFiltros(): void {
    this.categoriaActual = 'todos';
    this.precioMaximo = 60;
    this.marcasSeleccionadas = [];
    this.textoBusqueda = '';
    this.filtrar();
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.carritoService.agregarItem(producto).subscribe({
      next: () => this.mostrarToast(`${producto.nombre} añadido al carrito`),
      error: () => this.mostrarToast('Error al agregar. ¿Está json-server corriendo?')
    });
  }

  mostrarToast(mensaje: string): void {
    this.toast = { visible: true, mensaje };
    setTimeout(() => this.toast = { visible: false, mensaje: '' }, 2500);
  }
}
