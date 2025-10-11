// Enums
export enum PaisEnum {
  COLOMBIA = 'Colombia',
  PERU = 'Perú',
  ECUADOR = 'Ecuador',
  MEXICO = 'México',
}

export enum TipoProveedorEnum {
  FABRICANTE = 'Fabricante',
  DISTRIBUIDOR = 'Distribuidor',
  MAYORISTA = 'Mayorista',
  IMPORTADOR = 'Importador',
  MINORISTA = 'Minorista',
}

export interface Supplier {
  id: string;
  nombre: string;
  id_tributario: string;
  tipo_proveedor: TipoProveedorEnum;
  email: string;
  pais: PaisEnum;
  contacto?: string;
  condiciones_entrega?: string;
}

export interface ListSuppliersResponse {
  data: Supplier[];
  total: number;
  page: number;
  page_size: number;
}
