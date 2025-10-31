import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { InventoryItem, InventoryListResponse, InventoryCreatePayload } from '../models/inventory.model';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  // --- Mock Data (Datos Falsos) ---
  const mockInventoryItems: InventoryItem[] = [
    {
      id: 'uuid-1',
      producto_id: 'prod-1',
      lote: 'LOTE-A',
      fecha_vencimiento: '2025-12-01',
      cantidad: 100,
      ubicacion: 'Bodega A',
      temperatura_requerida: 'AMBIENTE',
      estado: 'DISPONIBLE',
      fecha_recepcion: '2025-10-30T10:00:00Z',
      producto_nombre: 'Producto 1',
      producto_sku: 'SKU-001',
      created_at: '2025-10-30T10:00:00Z',
      updated_at: null
    },
    {
      id: 'uuid-2',
      producto_id: 'prod-2',
      lote: 'LOTE-B',
      fecha_vencimiento: '2026-01-01',
      cantidad: 50,
      ubicacion: 'Bodega B',
      temperatura_requerida: 'REFRIGERADO',
      estado: 'DISPONIBLE',
      fecha_recepcion: '2025-10-30T11:00:00Z',
      producto_nombre: 'Producto 2',
      producto_sku: 'SKU-002',
      created_at: '2025-10-30T11:00:00Z',
      updated_at: null
    }
  ];

  const mockListResponse: InventoryListResponse = {
    items: mockInventoryItems,
    total: 2,
    page: 1,
    page_size: 20,
    total_pages: 1,
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService],
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInventory', () => {
    it('should retrieve inventory list and map to items array', () => {
      service.getInventory().subscribe((items) => {
        expect(items.length).toBe(2);
        expect(items).toEqual(mockInventoryItems);
        expect(items[0].producto_nombre).toBe('Producto 1');
        expect(items[1].lote).toBe('LOTE-B');
      });

      const expectedParams = new HttpParams().set('page', 1).set('page_size', 20);

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${apiUrl}/inventario/` &&
          request.params.toString() === expectedParams.toString()
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockListResponse);
    });

    it('should handle empty inventory list', () => {
      const emptyResponse: InventoryListResponse = {
        items: [],
        total: 0,
        page: 1,
        page_size: 20,
        total_pages: 0,
      };

      service.getInventory().subscribe((items) => {
        expect(items.length).toBe(0);
        expect(items).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/inventario/?page=1&page_size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });

    it('should extract only items array from response', () => {
      service.getInventory().subscribe((items) => {
        expect(items).toEqual(mockInventoryItems);
        expect((items as any).total).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/inventario/?page=1&page_size=20`);
      req.flush(mockListResponse);
    });

    it('should handle HTTP error for getInventory', () => {
      const errorMessage = 'Error al cargar inventario';

      service.getInventory().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/inventario/?page=1&page_size=20`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createInventoryRecord', () => {
    it('should create a new inventory record', () => {
      const newRecordPayload: InventoryCreatePayload = {
        producto_id: 'prod-1',
        lote: 'LOTE-NUEVO',
        fecha_vencimiento: '2027-01-01',
        cantidad: 500,
        ubicacion: 'Bodega C - Estante 1',
        temperatura_requerida: 'AMBIENTE',
        estado: 'DISPONIBLE',
        observaciones: 'Nuevo ingreso',
        condiciones_especiales: null
      };

      const createdRecord: InventoryItem = {
        id: 'uuid-new-record',
        fecha_recepcion: '2025-10-30T14:00:00Z',
        created_at: '2025-10-30T14:00:00Z',
        updated_at: null,
        producto_nombre: 'Producto 1',
        producto_sku: 'SKU-001',
        ...newRecordPayload
      };

      service.createInventoryRecord(newRecordPayload).subscribe((record) => {
        expect(record).toEqual(createdRecord);
        expect(record.id).toBe('uuid-new-record');
        expect(record.lote).toBe('LOTE-NUEVO');
      });

      const req = httpMock.expectOne(`${apiUrl}/inventario/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newRecordPayload);
      req.flush(createdRecord);
    });

    it('should handle 422 validation error on create', () => {
      const invalidPayload: any = {
        producto_id: 'prod-1',
        lote: 'LOTE-INVALIDO',
        cantidad: -100,
      };

      const errorResponse = {
        detail: 'La cantidad debe ser mayor a 0',
      };

      service.createInventoryRecord(invalidPayload).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error) => {
          expect(error.status).toBe(422);
          expect(error.error.detail).toBe('La cantidad debe ser mayor a 0');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/inventario/`);
      expect(req.request.method).toBe('POST');
      req.flush(errorResponse, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });
});
