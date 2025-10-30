// src/app/models/inventory.model.ts

export interface InventoryItem {
  id: string;
  producto_id: string;
  lote: string;
  fecha_vencimiento: string | null;
  cantidad: number;
  ubicacion: string;
  temperatura_requerida: string;
  estado: string;
  fecha_recepcion: string;
  producto_nombre: string;
  producto_sku: string;
}

export interface InventoryListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: InventoryItem[];
}
