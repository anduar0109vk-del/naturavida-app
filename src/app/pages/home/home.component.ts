import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private productoService = inject(ProductoService);
  destacados: Producto[] = [];

  categorias = [
    {
      slug: 'capilar',
      titulo: 'Cuidado Capilar',
      descripcion: 'Revitaliza tu cabello con champús, acondicionadores y tónicos de extractos orgánicos.',
      color: '#52b788'
    },
    {
      slug: 'piel',
      titulo: 'Cuidado de la Piel',
      descripcion: 'Nutre, hidrata y protege tu piel con jabones artesanales y aceites naturales puros.',
      color: '#40916c'
    },
    {
      slug: 'insumos',
      titulo: 'Insumos Naturales',
      descripcion: 'Crea tus propias fórmulas con aceites esenciales, bases y conservantes naturales.',
      color: '#2d6a4f'
    }
  ];

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.destacados = productos.slice(0, 6);
    });
  }
}
