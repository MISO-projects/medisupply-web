import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conductor, ConductorResponse } from '../models/conductor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getConductores(page: number = 1, pageSize: number = 20, activo?: boolean): Observable<Conductor[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }

    return this.http
      .get<ConductorResponse>(`${this.apiUrl}/logistica/conductores`, { params })
      .pipe(map((response) => response.conductores));
  }

  getConductor(id: number): Observable<Conductor> {
    return this.http.get<Conductor>(`${this.apiUrl}/logistica/conductores/${id}`);
  }

  createConductor(conductor: Omit<Conductor, 'id' | 'nombre_completo' | 'fecha_creacion' | 'fecha_actualizacion'>): Observable<Conductor> {
    return this.http.post<Conductor>(`${this.apiUrl}/logistica/conductores`, conductor);
  }

  updateConductor(id: number, conductor: Partial<Conductor>): Observable<Conductor> {
    return this.http.put<Conductor>(`${this.apiUrl}/logistica/conductores/${id}`, conductor);
  }

  deleteConductor(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/logistica/conductores/${id}`);
  }
}

