import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SalesReportResponse,
  SalesReportFilters,
} from '../models/sales-report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SalesReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getSalesReport(filters: SalesReportFilters): Observable<SalesReportResponse> {
    let params = new HttpParams();

    if (filters.fecha_inicio) {
      params = params.set('fecha_inicio', filters.fecha_inicio);
    }
    if (filters.fecha_fin) {
      params = params.set('fecha_fin', filters.fecha_fin);
    }
    if (filters.zona) {
      params = params.set('zona', filters.zona);
    }

    return this.http.get<SalesReportResponse>(
      `${this.apiUrl}/reportes/vendedores`,
      { params },
    );
  }
}
