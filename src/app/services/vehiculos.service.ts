import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getVehiculos(page: number = 1, pageSize: number = 20, activo?: boolean): Observable<Vehiculo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }

    return this.http
      .get<VehiculoResponse>(`${this.apiUrl}/logistica/vehiculos`, { params })
      .pipe(map((response) => response.vehiculos));
  }

  getVehiculo(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/logistica/vehiculos/${id}`);
  }

  createVehiculo(vehiculo: Omit<Vehiculo, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.apiUrl}/logistica/vehiculos`, vehiculo);
  }

  updateVehiculo(id: number, vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/logistica/vehiculos/${id}`, vehiculo);
  }

  deleteVehiculo(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/logistica/vehiculos/${id}`);
  }
}

