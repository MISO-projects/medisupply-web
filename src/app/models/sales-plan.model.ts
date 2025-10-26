export interface SalesPlan {
  id?: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
  meta_venta: number;
  zona_asignada: string;
}

export interface SalesPlanResponse {
  data: SalesPlan[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
