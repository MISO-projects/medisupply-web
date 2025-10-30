export interface Parada {
  id?: number;
  ruta_id?: number;
  cliente_id?: number;
  direccion: string;
  contacto?: string;
  latitud: number;
  longitud: number;
  orden: number;
  estado?: string;
  notas?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Route {
  id: number | string;
  fecha: string;
  bodega_origen?: string;
  estado?: string;
  vehiculo_id?: number;
  conductor_id?: number;
  vehiculo_placa: string;
  vehiculo_info: string;
  conductor_nombre: string;
  condiciones_almacenamiento?: string;
  paradas: Parada[];
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface RouteResponse {
  rutas: Route[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

