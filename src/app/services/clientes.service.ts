import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente, ClienteResponse } from '../models/cliente.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getClientes(
    page: number = 1,
    pageSize: number = 100,
    simple: boolean = false,
  ): Observable<Cliente[]> {
    if (simple) {
      // Llamada simple sin paginación para listados
      return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/`);
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http
      .get<ClienteResponse>(`${this.apiUrl}/clientes/`, { params })
      .pipe(map((response) => response.clientes));
  }

  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  createCliente(
    cliente: Omit<Cliente, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>,
  ): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes/`, cliente);
  }

  updateCliente(id: string, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }
}
