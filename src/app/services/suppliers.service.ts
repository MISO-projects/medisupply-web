import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  PaisEnum,
  Supplier,
  TipoProveedorEnum,
  ListSuppliersResponse,
} from '../models/supplier.model';

export interface CreateSupplierSchema {
  nombre: string;
  id_tributario: string;
  tipo_proveedor: TipoProveedorEnum;
  email: string;
  pais: PaisEnum;
  contacto?: string | null;
  condiciones_entrega?: string | null;
}

export interface UpdateSupplierSchema {
  nombre?: string | null;
  tipo_proveedor?: TipoProveedorEnum | null;
  email?: string | null;
  contacto?: string | null;
  condiciones_entrega?: string | null;
}

export interface ListSuppliersParams {
  pais?: PaisEnum | null;
  tipo_proveedor?: TipoProveedorEnum | null;
  page?: number;
  page_size?: number;
}

export interface CreateSupplierResponse {
  message: string;
  data: Supplier;
}

export interface UpdateSupplierResponse {
  message: string;
  data: Supplier;
}

export interface DeleteSupplierResponse {
  message: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly baseUrl = 'http://localhost:3013';

  constructor(private http: HttpClient) {}

  createSupplier(proveedor: CreateSupplierSchema): Observable<CreateSupplierResponse> {
    return this.http.post<CreateSupplierResponse>(`${this.baseUrl}/proveedores`, proveedor);
  }

  listSuppliers(params?: ListSuppliersParams): Observable<Supplier[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.pais !== undefined && params.pais !== null) {
        httpParams = httpParams.set('pais', params.pais);
      }
      if (params.tipo_proveedor !== undefined && params.tipo_proveedor !== null) {
        httpParams = httpParams.set('tipo_proveedor', params.tipo_proveedor);
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.page_size !== undefined) {
        httpParams = httpParams.set('page_size', params.page_size.toString());
      }
    }

    return this.http
      .get<ListSuppliersResponse>(`${this.baseUrl}/proveedores/`, {
        params: httpParams,
      })
      .pipe(map((response) => response.data));
  }

  getSupplier(proveedorId: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/proveedores/${proveedorId}`);
  }

  updateSupplier(
    proveedorId: string,
    proveedor: UpdateSupplierSchema,
  ): Observable<UpdateSupplierResponse> {
    return this.http.put<UpdateSupplierResponse>(
      `${this.baseUrl}/proveedores/${proveedorId}`,
      proveedor,
    );
  }

  deleteSupplier(supplierId: string): Observable<DeleteSupplierResponse> {
    return this.http.delete<DeleteSupplierResponse>(`${this.baseUrl}/proveedores/${supplierId}`);
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }
}
