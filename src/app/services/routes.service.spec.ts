import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouteService } from './routes.service';
import { Route, RouteResponse, Parada } from '../models/route.model';
import { environment } from '../../environments/environment';

describe('RouteService', () => {
  let service: RouteService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RouteService],
    });
    service = TestBed.inject(RouteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoutes', () => {
    it('should retrieve all routes', () => {
      const mockRoutes: Route[] = [
        {
          id: 1,
          fecha: '2024-01-15',
          bodega_origen: 'Bodega Central',
          estado: 'Pendiente',
          vehiculo_id: 1,
          conductor_id: 1,
          vehiculo_placa: 'ABC123',
          vehiculo_info: 'Toyota Hiace',
          conductor_nombre: 'Juan Pérez',
          condiciones_almacenamiento: 'Ambiente',
          paradas: [],
        },
        {
          id: 2,
          fecha: '2024-01-16',
          bodega_origen: 'Bodega Norte',
          estado: 'En Curso',
          vehiculo_id: 2,
          conductor_id: 2,
          vehiculo_placa: 'XYZ789',
          vehiculo_info: 'Ford Transit',
          conductor_nombre: 'María García',
          condiciones_almacenamiento: 'Refrigerado',
          paradas: [],
        },
      ];

      const mockResponse: RouteResponse = {
        rutas: mockRoutes,
        total: 2,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getRoutes().subscribe((routes) => {
        expect(routes.length).toBe(2);
        expect(routes).toEqual(mockRoutes);
        expect(routes[0].vehiculo_placa).toBe('ABC123');
        expect(routes[1].conductor_nombre).toBe('María García');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas?page=1&page_size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve routes with custom pagination', () => {
      const mockResponse: RouteResponse = {
        rutas: [],
        total: 0,
        page: 2,
        page_size: 10,
        total_pages: 0,
      };

      service.getRoutes(2, 10).subscribe((routes) => {
        expect(routes).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas?page=2&page_size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should extract only rutas array from response', () => {
      const mockRoutes: Route[] = [
        {
          id: 1,
          fecha: '2024-01-15',
          vehiculo_placa: 'ABC123',
          vehiculo_info: 'Toyota Hiace',
          conductor_nombre: 'Juan Pérez',
          paradas: [],
        },
      ];

      const mockResponse: RouteResponse = {
        rutas: mockRoutes,
        total: 100,
        page: 2,
        page_size: 20,
        total_pages: 5,
      };

      service.getRoutes().subscribe((routes) => {
        expect(routes).toEqual(mockRoutes);
        expect((routes as any).total).toBeUndefined();
        expect((routes as any).page).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas?page=1&page_size=20`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error for getRoutes', () => {
      service.getRoutes().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas?page=1&page_size=20`);
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle routes with paradas', () => {
      const mockParadas: Parada[] = [
        {
          id: 1,
          ruta_id: 1,
          direccion: 'Calle 123',
          contacto: 'Juan',
          latitud: 4.6097,
          longitud: -74.0817,
          orden: 1,
          estado: 'Pendiente',
        },
      ];

      const mockRoute: Route = {
        id: 1,
        fecha: '2024-01-15',
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        paradas: mockParadas,
      };

      const mockResponse: RouteResponse = {
        rutas: [mockRoute],
        total: 1,
        page: 1,
        page_size: 20,
        total_pages: 1,
      };

      service.getRoutes().subscribe((routes) => {
        expect(routes[0].paradas.length).toBe(1);
        expect(routes[0].paradas[0].latitud).toBe(4.6097);
        expect(routes[0].paradas[0].longitud).toBe(-74.0817);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas?page=1&page_size=20`);
      req.flush(mockResponse);
    });
  });

  describe('getRoute', () => {
    it('should retrieve a single route by id', () => {
      const mockRoute: Route = {
        id: 1,
        fecha: '2024-01-15',
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        condiciones_almacenamiento: 'Ambiente',
        paradas: [],
      };

      service.getRoute('1').subscribe((route) => {
        expect(route).toEqual(mockRoute);
        expect(route.id).toBe(1);
        expect(route.vehiculo_placa).toBe('ABC123');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRoute);
    });

    it('should handle HTTP 404 error when route not found', () => {
      service.getRoute('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/999`);
      req.flush('Route not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createRoute', () => {
    it('should create a new route', () => {
      const newRoute = {
        fecha: '2024-01-15',
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        condiciones_almacenamiento: 'Ambiente',
        paradas: [],
      };

      const createdRoute: Route = {
        id: 1,
        ...newRoute,
        fecha_creacion: '2024-01-15T10:00:00',
      };

      service.createRoute(newRoute).subscribe((route) => {
        expect(route.id).toBe(1);
        expect(route.fecha).toBe('2024-01-15');
        expect(route.bodega_origen).toBe('Bodega Central');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newRoute);
      req.flush(createdRoute);
    });

    it('should create a route with paradas', () => {
      const newRoute = {
        fecha: '2024-01-15',
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        paradas: [
          {
            cliente_id: 'cliente-1',
            direccion: 'Calle 123',
            contacto: 'Juan',
            latitud: 4.6097,
            longitud: -74.0817,
            orden: 1,
          },
        ],
      };

      const createdRoute: Route = {
        id: 1,
        ...newRoute,
        fecha_creacion: '2024-01-15T10:00:00',
      };

      service.createRoute(newRoute).subscribe((route) => {
        expect(route.paradas.length).toBe(1);
        expect(route.paradas[0].latitud).toBe(4.6097);
        expect(route.paradas[0].longitud).toBe(-74.0817);
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas`);
      req.flush(createdRoute);
    });

    it('should handle HTTP error when creating route', () => {
      const newRoute = {
        fecha: '2024-01-15',
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        paradas: [],
      };

      const errorResponse = {
        detail: 'Error al crear la ruta',
      };

      service.createRoute(newRoute).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.detail).toBe('Error al crear la ruta');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateRoute', () => {
    it('should update an existing route', () => {
      const routeUpdate = {
        estado: 'Completada',
      };

      const updatedRoute: Route = {
        id: 1,
        fecha: '2024-01-15',
        bodega_origen: 'Bodega Central',
        estado: 'Completada',
        vehiculo_id: 1,
        conductor_id: 1,
        vehiculo_placa: 'ABC123',
        vehiculo_info: 'Toyota Hiace',
        conductor_nombre: 'Juan Pérez',
        paradas: [],
      };

      service.updateRoute('1', routeUpdate).subscribe((route) => {
        expect(route.estado).toBe('Completada');
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(routeUpdate);
      req.flush(updatedRoute);
    });

    it('should handle HTTP error when updating route', () => {
      const routeUpdate = {
        estado: 'Completada',
      };

      service.updateRoute('1', routeUpdate).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/1`);
      req.flush('Route not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteRoute', () => {
    it('should delete a route', () => {
      service.deleteRoute('1').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle HTTP error when deleting route', () => {
      service.deleteRoute('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/logistica/rutas/1`);
      req.flush('Route not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
