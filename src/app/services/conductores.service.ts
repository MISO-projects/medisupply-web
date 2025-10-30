import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getConductores(page?: number, pageSize?: number, activoOnly?: boolean): Observable<Conductor[]> {
    let url = `${this.apiUrl}/conductores/`;
    const params: string[] = [];

    if (page !== undefined) params.push(`page=${page}`);
    if (pageSize !== undefined) params.push(`page_size=${pageSize}`);
    if (activoOnly !== undefined) params.push(`activo=${activoOnly}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http
      .get<ConductorResponse>(url)
      .pipe(map((response) => response.conductores));
  }

  getConductor(id: string): Observable<Conductor> {
    return this.http.get<Conductor>(`${this.apiUrl}/conductores/${id}`);
  }

  createConductor(conductor: Omit<Conductor, 'id'>): Observable<Conductor> {
    return this.http.post<Conductor>(`${this.apiUrl}/conductores/`, conductor);
  }

  updateConductor(id: string, conductor: Partial<Conductor>): Observable<Conductor> {
    return this.http.put<Conductor>(`${this.apiUrl}/conductores/${id}`, conductor);
  }

  deleteConductor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conductores/${id}`);
  }
}

