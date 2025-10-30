export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  imagen_url: string;
  disponible: boolean;
  precio_unitario: string;
  unidad_medida: string;
  descripcion: string;
  sku: string;
  tipo_almacenamiento: string;
  observaciones: string;
  proveedor_id: string;
  proveedor_nombre: string;
}

export interface ProductResponse {
  productos: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
