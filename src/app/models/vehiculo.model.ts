export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  año?: number;
  tipo: string;
  capacidad_kg?: number;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface VehiculoResponse {
  vehiculos: Vehiculo[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
