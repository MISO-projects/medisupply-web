import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductResponse } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.bffApiUrl;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductResponse>(`${this.apiUrl}/productos/disponibles`)
      .pipe(map((response) => response.productos));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/productos/${id}`);
  }

  createProduct(product: Product & { precio_unitario: number }): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/productos/`, product);
  }

  bulkUpload(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/productos/bulk-upload`, formData);
  }
}
