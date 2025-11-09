export interface Pedido {
  id: string;
  numero_pedido?: string;
  numero_orden?: string;
  cliente_id?: string;
  cliente_nombre?: string;
  nombre_cliente?: string;
  fecha_pedido?: string;
  fecha_entrega?: string;
  estado?: string;
  direccion_entrega?: string;
  contacto?: string;
  total?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface PedidoResponse {
  pedidos: Pedido[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
