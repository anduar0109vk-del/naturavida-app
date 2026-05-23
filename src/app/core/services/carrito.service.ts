import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemCarrito } from '../models/carrito.model';
import { Producto } from '../models/producto.model';
import { Observable, tap, switchMap, forkJoin, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private apiUrl = 'http://localhost:3000/carrito';
  private _items = signal<ItemCarrito[]>([]);
  private authService = inject(AuthService);

  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().reduce((acc, i) => acc + i.cantidad, 0));
  readonly totalPrecio = computed(() =>
    this._items().reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  );

  constructor(private http: HttpClient) {}

  private getGuestId(): number {
    const stored = localStorage.getItem('natura_guest_id');
    if (stored) return parseInt(stored, 10);
    const newId = -Math.floor(Math.random() * 1000000) - 1;
    localStorage.setItem('natura_guest_id', newId.toString());
    return newId;
  }

  getCartUserId(): number {
    const user = this.authService.currentUser();
    return user?.id ? user.id : this.getGuestId();
  }

  cargarCarrito(): void {
    const usuarioId = this.getCartUserId();
    this.http.get<ItemCarrito[]>(`${this.apiUrl}?usuarioId=${usuarioId}`).subscribe({
      next: items => this._items.set(items),
      error: () => this._items.set([])
    });
  }

  agregarItem(producto: Producto, cantidad: number = 1): Observable<ItemCarrito> {
    const usuarioId = this.getCartUserId();
    const existente = this._items().find(i => i.productoId === producto.id && i.usuarioId === usuarioId);
    if (existente && existente.id) {
      const actualizado = { ...existente, cantidad: existente.cantidad + cantidad };
      return this.http.put<ItemCarrito>(`${this.apiUrl}/${existente.id}`, actualizado).pipe(
        tap(() => this.cargarCarrito())
      );
    }
    const nuevo: ItemCarrito = {
      usuarioId,
      productoId: producto.id!,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      detalle: producto.detalle,
      cantidad
    };
    return this.http.post<ItemCarrito>(this.apiUrl, nuevo).pipe(
      tap(() => this.cargarCarrito())
    );
  }

  actualizarCantidad(item: ItemCarrito, cantidad: number): Observable<ItemCarrito> {
    return this.http.put<ItemCarrito>(`${this.apiUrl}/${item.id}`, { ...item, cantidad }).pipe(
      tap(() => this.cargarCarrito())
    );
  }

  quitarItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cargarCarrito())
    );
  }

  limpiarCarrito(): void {
    const usuarioId = this.getCartUserId();
    const items = this._items().filter(i => i.usuarioId === usuarioId);
    items.forEach(item => {
      if (item.id) this.http.delete(`${this.apiUrl}/${item.id}`).subscribe();
    });
    this._items.set([]);
  }

  sincronizarCarrito(userId: number): Observable<any> {
    const guestIdStr = localStorage.getItem('natura_guest_id');
    if (!guestIdStr) {
      this.cargarCarrito();
      return of(null);
    }
    const guestId = parseInt(guestIdStr, 10);
    
    return this.http.get<ItemCarrito[]>(`${this.apiUrl}?usuarioId=${guestId}`).pipe(
      switchMap(guestItems => {
        if (guestItems.length === 0) {
          localStorage.removeItem('natura_guest_id');
          this.cargarCarrito();
          return of(null);
        }
        
        return this.http.get<ItemCarrito[]>(`${this.apiUrl}?usuarioId=${userId}`).pipe(
          switchMap(userItems => {
            const requests: Observable<any>[] = [];
            
            guestItems.forEach(guestItem => {
              const userItem = userItems.find(ui => ui.productoId === guestItem.productoId);
              if (userItem && userItem.id) {
                const act = { ...userItem, cantidad: userItem.cantidad + guestItem.cantidad };
                requests.push(this.http.put(`${this.apiUrl}/${userItem.id}`, act));
                requests.push(this.http.delete(`${this.apiUrl}/${guestItem.id}`));
              } else {
                const act = { ...guestItem, usuarioId: userId };
                requests.push(this.http.put(`${this.apiUrl}/${guestItem.id}`, act));
              }
            });
            
            if (requests.length === 0) {
              localStorage.removeItem('natura_guest_id');
              this.cargarCarrito();
              return of(null);
            }
            
            return forkJoin(requests).pipe(
              tap(() => {
                localStorage.removeItem('natura_guest_id');
                this.cargarCarrito();
              })
            );
          })
        );
      })
    );
  }
}
