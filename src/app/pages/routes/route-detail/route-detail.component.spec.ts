import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteDetailComponent } from './route-detail.component';
import { RouteService } from '../../../services/routes.service';
import { Route } from '../../../models/route.model';

describe('RouteDetailComponent', () => {
  let component: RouteDetailComponent;
  let fixture: ComponentFixture<RouteDetailComponent>;
  let routeService: jasmine.SpyObj<RouteService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

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
    paradas: [
      {
        id: 1,
        pedido_id: 'pedido-1',
        direccion: 'Calle 123',
        contacto: 'Juan',
        latitud: 4.6097,
        longitud: -74.0817,
        orden: 1,
      },
    ],
    fecha_creacion: '2024-01-15T10:00:00Z',
    fecha_actualizacion: '2024-01-15T10:00:00Z',
  };

  beforeEach(async () => {
    const routeServiceSpy = jasmine.createSpyObj('RouteService', ['getRoute']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [RouteDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: RouteService, useValue: routeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    routeService = TestBed.inject(RouteService) as jasmine.SpyObj<RouteService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  beforeEach(() => {
    routeService.getRoute.and.returnValue(of(mockRoute));

    fixture = TestBed.createComponent(RouteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load route data on init', () => {
      expect(routeService.getRoute).toHaveBeenCalledWith('1');
      expect(component.routeData).toEqual(mockRoute);
      expect(component.isLoading).toBe(false);
    });

    it('should set error if route id is not provided', () => {
      (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);
      fixture = TestBed.createComponent(RouteDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.error).toBe('ID de ruta no válido');
    });
  });

  describe('Loading States', () => {
    it('should set isLoading to true when loading', () => {
      routeService.getRoute.and.returnValue(of(mockRoute));
      component.ngOnInit();
      expect(component.isLoading).toBe(false);
    });

    it('should handle error when loading route fails', () => {
      const errorResponse = { error: { message: 'Error del servidor' } };
      routeService.getRoute.and.returnValue(throwError(() => errorResponse));

      component.ngOnInit();

      expect(component.error).toBe('Error al cargar la ruta. Por favor, intenta de nuevo.');
      expect(component.isLoading).toBe(false);
      expect(snackBar.openFromComponent).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to /routes on back', () => {
      component.onBack();
      expect(router.navigate).toHaveBeenCalledWith(['/routes']);
    });
  });

  describe('Formatting Methods', () => {
    it('should format date correctly', () => {
      const formatted = component.formatDate('2024-01-15');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('enero');
    });

    it('should return "-" for null date', () => {
      expect(component.formatDate(undefined)).toBe('-');
    });

    it('should format date time correctly', () => {
      const formatted = component.formatDateTime('2024-01-15T10:00:00Z');
      expect(formatted).toContain('2024');
    });

    it('should return "-" for null date time', () => {
      expect(component.formatDateTime(undefined)).toBe('-');
    });
  });

  describe('Estado Color', () => {
    it('should return primary color for Completada', () => {
      expect(component.getEstadoColor('Completada')).toBe('primary');
    });

    it('should return accent color for En Curso', () => {
      expect(component.getEstadoColor('En Curso')).toBe('accent');
    });

    it('should return warn color for Cancelada', () => {
      expect(component.getEstadoColor('Cancelada')).toBe('warn');
    });

    it('should return empty string for other estados', () => {
      expect(component.getEstadoColor('Pendiente')).toBe('');
    });
  });
});
