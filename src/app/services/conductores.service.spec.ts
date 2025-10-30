import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConductorService } from './conductores.service';
import { Conductor, ConductorResponse } from '../models/conductor.model';
import { environment } from '../../environments/environment';

describe('ConductorService', () => {
  let service: ConductorService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConductorService],
    });
    service = TestBed.inject(ConductorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConductores', () => {
    it('should retrieve all conductores', () => {
      const mockConductores: Conductor[] = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          nombre_completo: 'Juan Pérez',
          documento: '12345678',
          telefono: '3001234567',
          email: 'juan@test.com',
          licencia_conducir: 'LIC123456',
          activo: true,
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'García',
          nombre_completo: 'María García',
          documento: '87654321',
          telefono: '3007654321',
          email: 'maria@test.com',
          licencia_conducir: 'LIC789012',
          activo: true,
        },
      ];

      const mockResponse: ConductorResponse = {
        conductores: mockConductores,
        total: 2,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getConductores().subscribe((conductores) => {
        expect(conductores.length).toBe(2);
        expect(conductores).toEqual(mockConductores);
        expect(conductores[0].nombre_completo).toBe('Juan Pérez');
        expect(conductores[1].licencia_conducir).toBe('LIC789012');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores?page=1&page_size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve conductores with activo filter', () => {
      const mockResponse: ConductorResponse = {
        conductores: [
          {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            documento: '12345678',
            licencia_conducir: 'LIC123456',
            activo: true,
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getConductores(1, 20, true).subscribe((conductores) => {
        expect(conductores.length).toBe(1);
        expect(conductores[0].activo).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores?page=1&page_size=20&activo=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve conductores with custom pagination', () => {
      const mockResponse: ConductorResponse = {
        conductores: [],
        total: 0,
        page: 2,
        page_size: 10,
        total_pages: 0,
      };

      service.getConductores(2, 10).subscribe((conductores) => {
        expect(conductores).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores?page=2&page_size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should extract only conductores array from response', () => {
      const mockConductores: Conductor[] = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          documento: '12345678',
          licencia_conducir: 'LIC123456',
          activo: true,
        },
      ];

      const mockResponse: ConductorResponse = {
        conductores: mockConductores,
        total: 100,
        page: 2,
        page_size: 20,
        total_pages: 5,
      };

      service.getConductores().subscribe((conductores) => {
        expect(conductores).toEqual(mockConductores);
        expect((conductores as any).total).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores?page=1&page_size=20`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error for getConductores', () => {
      service.getConductores().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores?page=1&page_size=20`);
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getConductor', () => {
    it('should retrieve a single conductor by id', () => {
      const mockConductor: Conductor = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        nombre_completo: 'Juan Pérez',
        documento: '12345678',
        telefono: '3001234567',
        email: 'juan@test.com',
        licencia_conducir: 'LIC123456',
        activo: true,
      };

      service.getConductor(1).subscribe((conductor) => {
        expect(conductor).toEqual(mockConductor);
        expect(conductor.id).toBe(1);
        expect(conductor.nombre_completo).toBe('Juan Pérez');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConductor);
    });

    it('should handle HTTP 404 error when conductor not found', () => {
      service.getConductor(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/999`);
      req.flush('Conductor not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createConductor', () => {
    it('should create a new conductor', () => {
      const newConductor = {
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        telefono: '3001234567',
        email: 'juan@test.com',
        licencia_conducir: 'LIC123456',
        activo: true,
      };

      const createdConductor: Conductor = {
        id: 1,
        nombre_completo: 'Juan Pérez',
        fecha_creacion: '2024-01-15T10:00:00',
        ...newConductor,
      };

      service.createConductor(newConductor).subscribe((conductor) => {
        expect(conductor.id).toBe(1);
        expect(conductor.nombre).toBe('Juan');
        expect(conductor.apellido).toBe('Pérez');
        expect(conductor.nombre_completo).toBe('Juan Pérez');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newConductor);
      req.flush(createdConductor);
    });

    it('should handle HTTP error when creating conductor', () => {
      const newConductor = {
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        licencia_conducir: 'LIC123456',
        activo: true,
      };

      const errorResponse = {
        detail: 'Error al crear el conductor',
      };

      service.createConductor(newConductor).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.detail).toBe('Error al crear el conductor');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateConductor', () => {
    it('should update an existing conductor', () => {
      const conductorUpdate = {
        telefono: '3009999999',
        email: 'nuevo@test.com',
      };

      const updatedConductor: Conductor = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        telefono: '3009999999',
        email: 'nuevo@test.com',
        licencia_conducir: 'LIC123456',
        activo: true,
      };

      service.updateConductor(1, conductorUpdate).subscribe((conductor) => {
        expect(conductor.telefono).toBe('3009999999');
        expect(conductor.email).toBe('nuevo@test.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(conductorUpdate);
      req.flush(updatedConductor);
    });

    it('should handle HTTP error when updating conductor', () => {
      const conductorUpdate = {
        telefono: '3009999999',
      };

      service.updateConductor(1, conductorUpdate).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/1`);
      req.flush('Conductor not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteConductor', () => {
    it('should delete a conductor', () => {
      const mockResponse = { mensaje: 'Conductor eliminado exitosamente' };

      service.deleteConductor(1).subscribe((response) => {
        expect(response.mensaje).toBe('Conductor eliminado exitosamente');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when deleting conductor', () => {
      service.deleteConductor(1).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/conductores/1`);
      req.flush('Conductor not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
