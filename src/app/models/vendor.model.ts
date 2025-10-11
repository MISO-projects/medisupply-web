export interface Vendor {
  id?: string;
  nombre: string;
  documento_identidad: string;
  email: string;
  zona_asignada: string;
  plan_venta: string;
  meta_venta: number;
}

export interface VendorResponse {
  data: Vendor[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
