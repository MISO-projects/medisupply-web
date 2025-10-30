import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { InventoryItem, InventoryListResponse } from '../models/inventory.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.bffApiUrl}`;

  getInventory(): Observable<InventoryItem[]> {
    const params = new HttpParams().set('page', 1).set('page_size', 20);

    return this.http
      .get<InventoryListResponse>(`${this.apiUrl}/inventario/`, { params })
      .pipe(
        map((response) => response.items)
      );
  }
}
