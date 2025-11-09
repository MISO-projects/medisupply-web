import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido, PedidoResponse } from '../models/pedido.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getPedidos(page: number = 1, pageSize: number = 100, activos?: boolean): Observable<Pedido[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (activos !== undefined) {
      params = params.set('activos', activos.toString());
    }

    return this.http
      .get<PedidoResponse>(`${this.apiUrl}/pedidos`, { params })
      .pipe(map((response) => response.pedidos));
  }

  getPedido(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/pedidos/${id}`);
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    const params = new HttpParams()
      .set('estado', 'PENDIENTE')
      .set('page', '1')
      .set('page_size', '20');

    return this.http.get<any>(`${this.apiUrl}/ordenes/`, { params }).pipe(
      map((response) => {
        // Manejar diferentes estructuras de respuesta
        if (response.pedidos) {
          return response.pedidos;
        }
        if (response.data) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }),
    );
  }
}
