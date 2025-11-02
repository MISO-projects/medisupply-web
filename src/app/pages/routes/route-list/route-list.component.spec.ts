import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteListComponent } from './route-list.component';
import { RouteService } from '../../../services/routes.service';
import { Route } from '../../../models/route.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouteListComponent', () => {
  let component: RouteListComponent;
  let fixture: ComponentFixture<RouteListComponent>;
  let routeService: jasmine.SpyObj<RouteService>;

  const mockRoutes: Route[] = [
    {
      id: 1,
      fecha: '2024-01-15',
      bodega_origen: 'Bodega Central',
      estado: 'Pendiente',
      vehiculo_placa: 'ABC123',
      vehiculo_info: 'Toyota Hiace',
      conductor_nombre: 'Juan Pérez',
      paradas: [],
    },
    {
      id: 2,
      fecha: '2024-01-16',
      vehiculo_placa: 'XYZ789',
      vehiculo_info: 'Ford Transit',
      conductor_nombre: 'María García',
      paradas: [],
    },
  ];

  beforeEach(async () => {
    const routeServiceSpy = jasmine.createSpyObj('RouteService', ['getRoutes']);

    await TestBed.configureTestingModule({
      imports: [RouteListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: RouteService, useValue: routeServiceSpy }],
    }).compileComponents();

    routeService = TestBed.inject(RouteService) as jasmine.SpyObj<RouteService>;
  });

  beforeEach(() => {
    routeService.getRoutes.and.returnValue(of(mockRoutes));
    fixture = TestBed.createComponent(RouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load routes on init', () => {
      expect(routeService.getRoutes).toHaveBeenCalled();
      expect(component.routes.length).toBe(2);
      expect(component.routes).toEqual(mockRoutes);
    });

    it('should define columns correctly', () => {
      expect(component.columns.length).toBe(5);
      expect(component.columns[0].key).toBe('id');
      expect(component.columns[4].key).toBe('paradas');
    });

    it('should set isLoading to false after loading', () => {
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle error when loading routes fails', () => {
      routeService.getRoutes.and.returnValue(throwError(() => ({ status: 500 })));
      fixture = TestBed.createComponent(RouteListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.error).toBe('Error al cargar las rutas. Por favor, intenta de nuevo.');
      expect(component.isLoading).toBe(false);
    });
  });
});
