export interface Producto {
  id?: number;
  nombre: string;
  detalle: string;
  precio: number;
  categoria: 'capilar' | 'piel' | 'insumos';
  marca: 'BioNatur' | 'AlmaVerde' | 'TerraVital';
  imagen: string;
  descripcion: string;
  modoUso: string;
  ingredientes: string;
}
