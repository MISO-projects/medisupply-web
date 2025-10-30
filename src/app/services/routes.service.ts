import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route, RouteResponse } from '../models/route.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getRoutes(page: number = 1, pageSize: number = 20): Observable<Route[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http
      .get<RouteResponse>(`${this.apiUrl}/web/logistica/rutas`, { params })
      .pipe(map((response) => response.rutas));
  }

  getRoute(id: string): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/web/logistica/rutas/${id}`);
  }

  createRoute(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Observable<Route> {
    return this.http.post<Route>(`${this.apiUrl}/web/logistica/rutas/`, route);
  }

  updateRoute(id: string, route: Partial<Route>): Observable<Route> {
    return this.http.put<Route>(`${this.apiUrl}/web/logistica/rutas/${id}`, route);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/web/logistica/rutas/${id}`);
  }
}

