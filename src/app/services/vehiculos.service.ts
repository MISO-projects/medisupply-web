import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehiculo, VehiculoResponse } from '../models/vehiculo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getVehiculos(page?: number, pageSize?: number, activoOnly?: boolean): Observable<Vehiculo[]> {
    let url = `${this.apiUrl}/vehiculos/`;
    const params: string[] = [];

    if (page !== undefined) params.push(`page=${page}`);
    if (pageSize !== undefined) params.push(`page_size=${pageSize}`);
    if (activoOnly !== undefined) params.push(`activo=${activoOnly}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http
      .get<VehiculoResponse>(url)
      .pipe(map((response) => response.vehiculos));
  }

  getVehiculo(id: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/vehiculos/${id}`);
  }

  createVehiculo(vehiculo: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.apiUrl}/vehiculos/`, vehiculo);
  }

  updateVehiculo(id: string, vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/vehiculos/${id}`, vehiculo);
  }

  deleteVehiculo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehiculos/${id}`);
  }
}

