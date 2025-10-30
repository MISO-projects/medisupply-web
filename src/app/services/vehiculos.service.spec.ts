import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehiculoService } from './vehiculos.service';
import { Vehiculo, VehiculoResponse } from '../models/vehiculo.model';
import { environment } from '../../environments/environment';

describe('VehiculoService', () => {
  let service: VehiculoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehiculoService],
    });
    service = TestBed.inject(VehiculoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVehiculos', () => {
    it('should retrieve all vehiculos', () => {
      const mockVehiculos: Vehiculo[] = [
        {
          id: 1,
          placa: 'ABC123',
          marca: 'Toyota',
          modelo: 'Hiace',
          año: 2020,
          tipo: 'Furgón',
          capacidad_kg: 1500,
          activo: true,
        },
        {
          id: 2,
          placa: 'XYZ789',
          marca: 'Ford',
          modelo: 'Transit',
          año: 2021,
          tipo: 'Camión',
          capacidad_kg: 3000,
          activo: true,
        },
      ];

      const mockResponse: VehiculoResponse = {
        vehiculos: mockVehiculos,
        total: 2,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getVehiculos().subscribe((vehiculos) => {
        expect(vehiculos.length).toBe(2);
        expect(vehiculos).toEqual(mockVehiculos);
        expect(vehiculos[0].placa).toBe('ABC123');
        expect(vehiculos[1].marca).toBe('Ford');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos?page=1&page_size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve vehiculos with activo filter', () => {
      const mockResponse: VehiculoResponse = {
        vehiculos: [
          {
            id: 1,
            placa: 'ABC123',
            marca: 'Toyota',
            modelo: 'Hiace',
            tipo: 'Furgón',
            activo: true,
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getVehiculos(1, 20, true).subscribe((vehiculos) => {
        expect(vehiculos.length).toBe(1);
        expect(vehiculos[0].activo).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos?page=1&page_size=20&activo=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve vehiculos with custom pagination', () => {
      const mockResponse: VehiculoResponse = {
        vehiculos: [],
        total: 0,
        page: 2,
        page_size: 10,
        total_pages: 0,
      };

      service.getVehiculos(2, 10).subscribe((vehiculos) => {
        expect(vehiculos).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos?page=2&page_size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should extract only vehiculos array from response', () => {
      const mockVehiculos: Vehiculo[] = [
        {
          id: 1,
          placa: 'ABC123',
          marca: 'Toyota',
          modelo: 'Hiace',
          tipo: 'Furgón',
          activo: true,
        },
      ];

      const mockResponse: VehiculoResponse = {
        vehiculos: mockVehiculos,
        total: 100,
        page: 2,
        page_size: 20,
        total_pages: 5,
      };

      service.getVehiculos().subscribe((vehiculos) => {
        expect(vehiculos).toEqual(mockVehiculos);
        expect((vehiculos as any).total).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos?page=1&page_size=20`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error for getVehiculos', () => {
      service.getVehiculos().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos?page=1&page_size=20`);
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getVehiculo', () => {
    it('should retrieve a single vehiculo by id', () => {
      const mockVehiculo: Vehiculo = {
        id: 1,
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        año: 2020,
        tipo: 'Furgón',
        capacidad_kg: 1500,
        activo: true,
      };

      service.getVehiculo(1).subscribe((vehiculo) => {
        expect(vehiculo).toEqual(mockVehiculo);
        expect(vehiculo.id).toBe(1);
        expect(vehiculo.placa).toBe('ABC123');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVehiculo);
    });

    it('should handle HTTP 404 error when vehiculo not found', () => {
      service.getVehiculo(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/999`);
      req.flush('Vehiculo not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createVehiculo', () => {
    it('should create a new vehiculo', () => {
      const newVehiculo = {
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        año: 2020,
        tipo: 'Furgón',
        capacidad_kg: 1500,
        activo: true,
      };

      const createdVehiculo: Vehiculo = {
        id: 1,
        fecha_creacion: '2024-01-15T10:00:00',
        ...newVehiculo,
      };

      service.createVehiculo(newVehiculo).subscribe((vehiculo) => {
        expect(vehiculo.id).toBe(1);
        expect(vehiculo.placa).toBe('ABC123');
        expect(vehiculo.marca).toBe('Toyota');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newVehiculo);
      req.flush(createdVehiculo);
    });

    it('should handle HTTP error when creating vehiculo', () => {
      const newVehiculo = {
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        tipo: 'Furgón',
        activo: true,
      };

      const errorResponse = {
        detail: 'Error al crear el vehículo',
      };

      service.createVehiculo(newVehiculo).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.detail).toBe('Error al crear el vehículo');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateVehiculo', () => {
    it('should update an existing vehiculo', () => {
      const vehiculoUpdate = {
        capacidad_kg: 2000,
        activo: false,
      };

      const updatedVehiculo: Vehiculo = {
        id: 1,
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        tipo: 'Furgón',
        capacidad_kg: 2000,
        activo: false,
      };

      service.updateVehiculo(1, vehiculoUpdate).subscribe((vehiculo) => {
        expect(vehiculo.capacidad_kg).toBe(2000);
        expect(vehiculo.activo).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(vehiculoUpdate);
      req.flush(updatedVehiculo);
    });

    it('should handle HTTP error when updating vehiculo', () => {
      const vehiculoUpdate = {
        capacidad_kg: 2000,
      };

      service.updateVehiculo(1, vehiculoUpdate).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/1`);
      req.flush('Vehiculo not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteVehiculo', () => {
    it('should delete a vehiculo', () => {
      const mockResponse = { mensaje: 'Vehículo eliminado exitosamente' };

      service.deleteVehiculo(1).subscribe((response) => {
        expect(response.mensaje).toBe('Vehículo eliminado exitosamente');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when deleting vehiculo', () => {
      service.deleteVehiculo(1).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/vehiculos/1`);
      req.flush('Vehiculo not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
