export interface SalesReportVendor {
  vendedor_id: string;
  vendedor_nombre: string;
  zona_asignada: string;
  numero_pedidos: number;
  porcentaje_meta: number;
  ultima_actividad: string;
  meta_venta: number;
  ventas_totales: number;
  plan_venta_nombre: string;
}

export interface SalesReportResponse {
  vendedores: SalesReportVendor[];
  total: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface SalesReportFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  zona?: string;
}
