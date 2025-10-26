import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SalesPlan, SalesPlanResponse } from '../models/sales-plan.model';

@Injectable({
  providedIn: 'root',
})
export class SalesPlanService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  listSalesPlans(): Observable<SalesPlan[]> {
    return this.http
      .get<SalesPlanResponse>(`${this.apiUrl}/ventas/planes`)
      .pipe(map((response) => response.data));
  }

  getSalesPlan(id: string): Observable<SalesPlan> {
    return this.http.get<SalesPlan>(`${this.apiUrl}/ventas/planes/${id}`);
  }

  createSalesPlan(salesPlan: SalesPlan): Observable<SalesPlan> {
    return this.http.post<SalesPlan>(`${this.apiUrl}/ventas/planes`, salesPlan);
  }

  updateSalesPlan(id: string, salesPlan: SalesPlan): Observable<SalesPlan> {
    return this.http.put<SalesPlan>(`${this.apiUrl}/ventas/planes/${id}`, salesPlan);
  }

  deleteSalesPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ventas/planes/${id}`);
  }
}
