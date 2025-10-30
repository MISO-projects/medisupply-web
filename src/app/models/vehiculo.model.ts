export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  capacidad_kg: number;
  activo: boolean;
  conductor_id?: string;
  conductor_nombre?: string;
}

export interface VehiculoResponse {
  vehiculos: Vehiculo[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

