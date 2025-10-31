export interface Cliente {
  id: string;
  nombre: string;
  logoUrl?: string;
  address?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  id_vendedor?: string;
}

export interface ClienteResponse {
  clientes: Cliente[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
