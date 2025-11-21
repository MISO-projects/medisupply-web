export type Severidad = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type EstadoAlerta = 'PENDIENTE' | 'REVISADO' | 'RESUELTO' | 'FALSA_ALARMA';

export interface EventoRelacionado {
  event_type: string;
  operation: string;
  timestamp: string;
  inventario_id?: string;
  producto_id?: string;
  usuario_id?: string;
  ip_origen?: string;
  datos?: Record<string, any>;
  cambios?: Record<string, any>;
}

export interface Alerta {
  id: string;
  tipo: string;
  severidad: Severidad;
  mensaje: string;
  estado: EstadoAlerta;
  descripcion_detallada?: string;
  evento_relacionado?: EventoRelacionado;
  audit_log_id?: string;
  revisado_por?: string | null;
  notas_revision?: string | null;
  notificacion_enviada?: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface AlertaListResponse {
  items: Alerta[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AlertaFilters {
  page?: number;
  page_size?: number;
  severidad?: Severidad | '';
  estado?: EstadoAlerta | '';
  tipo?: string;
}

export interface RevisarAlertaData {
  estado: Exclude<EstadoAlerta, 'PENDIENTE'>;
  revisado_por?: string;
  notas_revision?: string;
}

export interface EstadisticasResumen {
  total_alertas: number;
  por_severidad: Record<Severidad, number>;
  por_estado: Record<EstadoAlerta, number>;
  por_tipo: Record<string, number>;
  alertas_ultimas_24h: number;
  alertas_pendientes: number;
}

export interface EmailData {
  email: string;
  nombre?: string;
  cargo?: string;
  severidades_minimas?: Severidad[];
}

export interface EmailDestinatario {
  id: string;
  email: string;
  nombre?: string;
  cargo?: string;
  activo: boolean;
  severidades_minimas: Severidad[];
  created_at: string;
  updated_at?: string | null;
}
