import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  SupplierService,
  CreateSupplierSchema,
  UpdateSupplierSchema,
  ListSuppliersParams,
} from './suppliers.service';
import {
  Supplier,
  PaisEnum,
  TipoProveedorEnum,
  ListSuppliersResponse,
} from '../models/supplier.model';
import { environment } from '../../environments/environment';

describe('SupplierService', () => {
  let service: SupplierService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplierService],
    });
    service = TestBed.inject(SupplierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSupplier', () => {
    it('should create a new supplier', () => {
      const newSupplier: CreateSupplierSchema = {
        nombre: 'Proveedor Test',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'test@proveedor.com',
        pais: PaisEnum.COLOMBIA,
        contacto: 'Juan Pérez',
        condiciones_entrega: 'Entrega en 5 días',
      };

      const createdSupplier: Supplier = {
        id: '1',
        nombre: 'Proveedor Test',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'test@proveedor.com',
        pais: PaisEnum.COLOMBIA,
        contacto: 'Juan Pérez',
        condiciones_entrega: 'Entrega en 5 días',
      };

      const response = {
        message: 'Proveedor creado exitosamente',
        data: createdSupplier,
      };

      service.createSupplier(newSupplier).subscribe((res) => {
        expect(res.message).toBe('Proveedor creado exitosamente');
        expect(res.data.id).toBe('1');
        expect(res.data.nombre).toBe('Proveedor Test');
        expect(res.data.pais).toBe(PaisEnum.COLOMBIA);
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newSupplier);
      req.flush(response);
    });

    it('should create a supplier without optional fields', () => {
      const newSupplier: CreateSupplierSchema = {
        nombre: 'Proveedor Básico',
        id_tributario: '987654321',
        tipo_proveedor: TipoProveedorEnum.DISTRIBUIDOR,
        email: 'basico@proveedor.com',
        pais: PaisEnum.PERU,
      };

      const createdSupplier: Supplier = {
        id: '2',
        nombre: 'Proveedor Básico',
        id_tributario: '987654321',
        tipo_proveedor: TipoProveedorEnum.DISTRIBUIDOR,
        email: 'basico@proveedor.com',
        pais: PaisEnum.PERU,
      };

      const response = {
        message: 'Proveedor creado exitosamente',
        data: createdSupplier,
      };

      service.createSupplier(newSupplier).subscribe((res) => {
        expect(res.data.id).toBe('2');
        expect(res.data.contacto).toBeUndefined();
        expect(res.data.condiciones_entrega).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
  });

  describe('listSuppliers', () => {
    it('should retrieve all suppliers without filters', () => {
      const mockResponse: ListSuppliersResponse = {
        data: [
          {
            id: '1',
            nombre: 'Proveedor 1',
            id_tributario: '111',
            tipo_proveedor: TipoProveedorEnum.FABRICANTE,
            email: 'prov1@test.com',
            pais: PaisEnum.COLOMBIA,
          },
          {
            id: '2',
            nombre: 'Proveedor 2',
            id_tributario: '222',
            tipo_proveedor: TipoProveedorEnum.DISTRIBUIDOR,
            email: 'prov2@test.com',
            pais: PaisEnum.PERU,
          },
        ],
        total: 2,
        page: 1,
        page_size: 10,
      };

      service.listSuppliers().subscribe((suppliers) => {
        expect(suppliers.length).toBe(2);
        expect(suppliers[0].nombre).toBe('Proveedor 1');
        expect(suppliers[1].nombre).toBe('Proveedor 2');
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve suppliers filtered by country', () => {
      const params: ListSuppliersParams = {
        pais: PaisEnum.COLOMBIA,
      };

      const mockResponse: ListSuppliersResponse = {
        data: [
          {
            id: '1',
            nombre: 'Proveedor Colombia',
            id_tributario: '111',
            tipo_proveedor: TipoProveedorEnum.FABRICANTE,
            email: 'colombia@test.com',
            pais: PaisEnum.COLOMBIA,
          },
        ],
        total: 1,
        page: 1,
        page_size: 10,
      };

      service.listSuppliers(params).subscribe((suppliers) => {
        expect(suppliers.length).toBe(1);
        expect(suppliers[0].pais).toBe(PaisEnum.COLOMBIA);
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/?pais=Colombia`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('pais')).toBe('Colombia');
      req.flush(mockResponse);
    });

    it('should retrieve suppliers filtered by type', () => {
      const params: ListSuppliersParams = {
        tipo_proveedor: TipoProveedorEnum.MAYORISTA,
      };

      const mockResponse: ListSuppliersResponse = {
        data: [
          {
            id: '3',
            nombre: 'Mayorista Test',
            id_tributario: '333',
            tipo_proveedor: TipoProveedorEnum.MAYORISTA,
            email: 'mayorista@test.com',
            pais: PaisEnum.MEXICO,
          },
        ],
        total: 1,
        page: 1,
        page_size: 10,
      };

      service.listSuppliers(params).subscribe((suppliers) => {
        expect(suppliers.length).toBe(1);
        expect(suppliers[0].tipo_proveedor).toBe(TipoProveedorEnum.MAYORISTA);
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/?tipo_proveedor=Mayorista`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('tipo_proveedor')).toBe('Mayorista');
      req.flush(mockResponse);
    });

    it('should retrieve suppliers with pagination', () => {
      const params: ListSuppliersParams = {
        page: 2,
        page_size: 5,
      };

      const mockResponse: ListSuppliersResponse = {
        data: [],
        total: 10,
        page: 2,
        page_size: 5,
      };

      service.listSuppliers(params).subscribe((suppliers) => {
        expect(suppliers).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/?page=2&page_size=5`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('page_size')).toBe('5');
      req.flush(mockResponse);
    });

    it('should retrieve suppliers with multiple filters', () => {
      const params: ListSuppliersParams = {
        pais: PaisEnum.ECUADOR,
        tipo_proveedor: TipoProveedorEnum.IMPORTADOR,
        page: 1,
        page_size: 20,
      };

      const mockResponse: ListSuppliersResponse = {
        data: [
          {
            id: '4',
            nombre: 'Importador Ecuador',
            id_tributario: '444',
            tipo_proveedor: TipoProveedorEnum.IMPORTADOR,
            email: 'importador@test.com',
            pais: PaisEnum.ECUADOR,
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
      };

      service.listSuppliers(params).subscribe((suppliers) => {
        expect(suppliers.length).toBe(1);
        expect(suppliers[0].pais).toBe(PaisEnum.ECUADOR);
        expect(suppliers[0].tipo_proveedor).toBe(TipoProveedorEnum.IMPORTADOR);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/proveedores/?pais=Ecuador&tipo_proveedor=Importador&page=1&page_size=20`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getSupplier', () => {
    it('should retrieve a single supplier by id', () => {
      const mockSupplier: Supplier = {
        id: '1',
        nombre: 'Proveedor Específico',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'especifico@test.com',
        pais: PaisEnum.COLOMBIA,
        contacto: 'María García',
        condiciones_entrega: 'Entrega inmediata',
      };

      service.getSupplier('1').subscribe((supplier) => {
        expect(supplier.id).toBe('1');
        expect(supplier.nombre).toBe('Proveedor Específico');
        expect(supplier.contacto).toBe('María García');
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSupplier);
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier', () => {
      const updateData: UpdateSupplierSchema = {
        nombre: 'Proveedor Actualizado',
        email: 'actualizado@test.com',
        contacto: 'Pedro Ramírez',
      };

      const updatedSupplier: Supplier = {
        id: '1',
        nombre: 'Proveedor Actualizado',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'actualizado@test.com',
        pais: PaisEnum.COLOMBIA,
        contacto: 'Pedro Ramírez',
      };

      const response = {
        message: 'Proveedor actualizado exitosamente',
        data: updatedSupplier,
      };

      service.updateSupplier('1', updateData).subscribe((res) => {
        expect(res.message).toBe('Proveedor actualizado exitosamente');
        expect(res.data.nombre).toBe('Proveedor Actualizado');
        expect(res.data.email).toBe('actualizado@test.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(response);
    });

    it('should update supplier with partial data', () => {
      const updateData: UpdateSupplierSchema = {
        condiciones_entrega: 'Nuevas condiciones',
      };

      const updatedSupplier: Supplier = {
        id: '1',
        nombre: 'Proveedor Original',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'original@test.com',
        pais: PaisEnum.COLOMBIA,
        condiciones_entrega: 'Nuevas condiciones',
      };

      const response = {
        message: 'Proveedor actualizado exitosamente',
        data: updatedSupplier,
      };

      service.updateSupplier('1', updateData).subscribe((res) => {
        expect(res.data.condiciones_entrega).toBe('Nuevas condiciones');
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(response);
    });
  });

  describe('deleteSupplier', () => {
    it('should delete a supplier', () => {
      const response = {
        message: 'Proveedor eliminado exitosamente',
      };

      service.deleteSupplier('1').subscribe((res) => {
        expect(res.message).toBe('Proveedor eliminado exitosamente');
      });

      const req = httpMock.expectOne(`${apiUrl}/proveedores/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });
  });

  describe('healthCheck', () => {
    it('should perform a health check', () => {
      const mockResponse = { status: 'ok' };

      service.healthCheck().subscribe((response) => {
        expect(response.status).toBe('ok');
      });

      const req = httpMock.expectOne(`${apiUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
