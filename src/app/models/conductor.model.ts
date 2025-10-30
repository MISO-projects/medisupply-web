export interface Conductor {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  documento: string;
  telefono?: string;
  email?: string;
  licencia_conducir: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface ConductorResponse {
  conductores: Conductor[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}


