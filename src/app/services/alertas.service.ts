import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Alerta,
  AlertaFilters,
  AlertaListResponse,
  EmailData,
  EmailDestinatario,
  EstadisticasResumen,
  RevisarAlertaData,
} from '../models/alerta.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.bffApiUrl}/alertas/`;

  getAlertas(filters: AlertaFilters = {}): Observable<AlertaListResponse> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', String(filters.page));
    if (filters.page_size) params = params.set('page_size', String(filters.page_size));
    if (filters.severidad) params = params.set('severidad', String(filters.severidad));
    if (filters.estado) params = params.set('estado', String(filters.estado));
    if (filters.tipo) params = params.set('tipo', String(filters.tipo));
    return this.http.get<AlertaListResponse>(`${this.apiUrl}`, { params });
  }

  getAlerta(id: string): Observable<Alerta> {
    return this.http.get<Alerta>(`${this.apiUrl}${id}`);
  }

  revisarAlerta(id: string, data: RevisarAlertaData): Observable<Alerta> {
    return this.http.put<Alerta>(`${this.apiUrl}${id}/revisar`, data);
  }

  getEstadisticas(): Observable<EstadisticasResumen> {
    return this.http.get<EstadisticasResumen>(`${this.apiUrl}estadisticas/resumen`);
  }

  registrarEmail(data: EmailData): Observable<EmailDestinatario> {
    return this.http.post<EmailDestinatario>(`${this.apiUrl}emails`, data);
  }

  listarEmails(activosSolo?: boolean): Observable<EmailDestinatario[]> {
    const params = activosSolo ? { params: { activos_solo: true } } : {};
    return this.http.get<EmailDestinatario[]>(`${this.apiUrl}emails`, params);
    }

  eliminarEmail(emailId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}emails/${emailId}`);
  }
}


