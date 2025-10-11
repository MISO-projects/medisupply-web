import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vendor, VendorResponse } from '../models/vendor.model';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3009/vendedores';

  getVendors(): Observable<Vendor[]> {
    return this.http.get<VendorResponse>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getVendor(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${id}`);
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.apiUrl, vendor);
  }

  updateVendor(id: string, vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, vendor);
  }
}
