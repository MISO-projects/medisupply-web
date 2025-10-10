import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Enums
export enum PaisEnum {
  COLOMBIA = 'Colombia',
  PERU = 'Perú',
  ECUADOR = 'Ecuador',
  MEXICO = 'México'
}

export enum TipoProveedorEnum {
  FABRICANTE = 'Fabricante',
  DISTRIBUIDOR = 'Distribuidor',
  MAYORISTA = 'Mayorista',
  IMPORTADOR = 'Importador',
  MINORISTA = 'Minorista'
}

// Interfaces
export interface CrearProveedorSchema {
  nombre: string;
  id_tributario: string;
  tipo_proveedor: TipoProveedorEnum;
  email: string;
  pais: PaisEnum;
  contacto?: string | null;
  condiciones_entrega?: string | null;
}

export interface ActualizarProveedorSchema {
  nombre?: string | null;
  tipo_proveedor?: TipoProveedorEnum | null;
  email?: string | null;
  contacto?: string | null;
  condiciones_entrega?: string | null;
}

export interface Proveedor {
  id: string;
  nombre: string;
  id_tributario: string;
  tipo_proveedor: TipoProveedorEnum;
  email: string;
  pais: PaisEnum;
  contacto?: string;
  condiciones_entrega?: string;
}

export interface ListarProveedoresParams {
  pais?: PaisEnum | null;
  tipo_proveedor?: TipoProveedorEnum | null;
  page?: number;
  page_size?: number;
}

export interface ListarProveedoresResponse {
  data: Proveedor[];
  total: number;
  page: number;
  page_size: number;
}

export interface CrearProveedorResponse {
  message: string;
  data: Proveedor;
}

export interface ActualizarProveedorResponse {
  message: string;
  data: Proveedor;
}

export interface EliminarProveedorResponse {
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
  providedIn: 'root'
})
export class SuppliersService {
  private readonly baseUrl = 'http://localhost:3013';

  constructor(private http: HttpClient) {}

  /**
   * Crear nuevo proveedor
   */
  crearProveedor(proveedor: CrearProveedorSchema): Observable<CrearProveedorResponse> {
    return this.http.post<CrearProveedorResponse>(`${this.baseUrl}/proveedores/`, proveedor);
  }

  /**
   * Listar proveedores con filtros opcionales y paginación
   */
  listarProveedores(params?: ListarProveedoresParams): Observable<ListarProveedoresResponse> {
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

    return this.http.get<ListarProveedoresResponse>(`${this.baseUrl}/proveedores/`, { params: httpParams });
  }

  /**
   * Obtener proveedor por ID
   */
  obtenerProveedor(proveedorId: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/proveedores/${proveedorId}`);
  }

  /**
   * Actualizar proveedor
   */
  actualizarProveedor(proveedorId: string, proveedor: ActualizarProveedorSchema): Observable<ActualizarProveedorResponse> {
    return this.http.put<ActualizarProveedorResponse>(`${this.baseUrl}/proveedores/${proveedorId}`, proveedor);
  }

  /**
   * Eliminar proveedor
   */
  eliminarProveedor(proveedorId: string): Observable<EliminarProveedorResponse> {
    return this.http.delete<EliminarProveedorResponse>(`${this.baseUrl}/proveedores/${proveedorId}`);
  }

  /**
   * Health check
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }
}
