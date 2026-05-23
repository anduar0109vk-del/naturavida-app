import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  valores = [
    { titulo: 'Sostenibilidad', desc: 'Comprometidos con el planeta y las futuras generaciones.' },
    { titulo: 'Transparencia', desc: 'Ingredientes claros, honestos y sin letra pequeña.' },
    { titulo: 'Calidad', desc: 'Excelencia en cada producto, desde la materia prima.' },
    { titulo: 'Comunidad', desc: 'Apoyo a productores locales y comercio justo peruano.' }
  ];
}
