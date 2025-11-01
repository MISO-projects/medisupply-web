import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteCreateComponent } from './route-create.component';
import { RouteService } from '../../../services/routes.service';
import { VehiculoService } from '../../../services/vehiculos.service';
import { ConductorService } from '../../../services/conductores.service';
import { ClienteService } from '../../../services/clientes.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { Conductor } from '../../../models/conductor.model';
import { Cliente } from '../../../models/cliente.model';

describe('RouteCreateComponent', () => {
  let component: RouteCreateComponent;
  let fixture: ComponentFixture<RouteCreateComponent>;
  let routeService: jasmine.SpyObj<RouteService>;
  let vehiculoService: jasmine.SpyObj<VehiculoService>;
  let conductorService: jasmine.SpyObj<ConductorService>;
  let clienteService: jasmine.SpyObj<ClienteService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

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

  const mockConductores: Conductor[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      nombre_completo: 'Juan Pérez',
      documento: '12345678',
      licencia_conducir: 'LIC123456',
      activo: true,
    },
  ];

  const mockClientes: Cliente[] = [
    {
      id: 'cliente-1',
      nombre: 'Cliente Test',
    },
  ];

  beforeEach(async () => {
    const routeServiceSpy = jasmine.createSpyObj('RouteService', ['createRoute']);
    const vehiculoServiceSpy = jasmine.createSpyObj('VehiculoService', ['getVehiculos']);
    const conductorServiceSpy = jasmine.createSpyObj('ConductorService', ['getConductores']);
    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [RouteCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: RouteService, useValue: routeServiceSpy },
        { provide: VehiculoService, useValue: vehiculoServiceSpy },
        { provide: ConductorService, useValue: conductorServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    routeService = TestBed.inject(RouteService) as jasmine.SpyObj<RouteService>;
    vehiculoService = TestBed.inject(VehiculoService) as jasmine.SpyObj<VehiculoService>;
    conductorService = TestBed.inject(ConductorService) as jasmine.SpyObj<ConductorService>;
    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    vehiculoService.getVehiculos.and.returnValue(of(mockVehiculos));
    conductorService.getConductores.and.returnValue(of(mockConductores));
    clienteService.getClientes.and.returnValue(of(mockClientes));

    fixture = TestBed.createComponent(RouteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load vehiculos, conductores and clientes on init', () => {
      expect(vehiculoService.getVehiculos).toHaveBeenCalledWith(1, 100, true);
      expect(conductorService.getConductores).toHaveBeenCalledWith(1, 100, true);
      expect(clienteService.getClientes).toHaveBeenCalledWith(1, 100, true);
      expect(component.vehiculos.length).toBe(1);
      expect(component.conductores.length).toBe(1);
      expect(component.clientes.length).toBe(1);
    });

    it('should initialize with a default parada', () => {
      expect(component.paradas.length).toBe(1);
    });

    it('should have predefined bodegas, estados and condiciones', () => {
      expect(component.bodegas.length).toBeGreaterThan(0);
      expect(component.estados.length).toBeGreaterThan(0);
      expect(component.condicionesAlmacenamiento.length).toBeGreaterThan(0);
    });
  });

  describe('Paradas Management', () => {
    it('should add a new parada', () => {
      const initialCount = component.paradas.length;
      component.addParada();
      expect(component.paradas.length).toBe(initialCount + 1);
    });

    it('should remove a parada when more than one exists', () => {
      component.addParada();
      const count = component.paradas.length;
      component.removeParada(0);
      expect(component.paradas.length).toBe(count - 1);
    });

    it('should not remove the last parada', () => {
      const count = component.paradas.length;
      component.removeParada(0);
      expect(component.paradas.length).toBe(count);
    });

    it('should create parada form with correct structure', () => {
      const paradaForm = component.createParadaForm();
      expect(paradaForm.get('cliente_id')).toBeTruthy();
      expect(paradaForm.get('direccion')).toBeTruthy();
      expect(paradaForm.get('contacto')).toBeTruthy();
      expect(paradaForm.get('latitud')).toBeTruthy();
      expect(paradaForm.get('longitud')).toBeTruthy();
    });

    it('should have latitud and longitud with default value 0', () => {
      const paradaForm = component.createParadaForm();
      expect(paradaForm.get('latitud')?.value).toBe(0);
      expect(paradaForm.get('longitud')?.value).toBe(0);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.routeForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        fecha: new Date('2024-01-15'),
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
      });

      const paradaForm = component.paradas.at(0);
      paradaForm.patchValue({
        cliente_id: 'cliente-1',
        direccion: 'Calle 123',
      });

      expect(form.valid).toBeTruthy();
    });

    it('should not submit if form is invalid', () => {
      component.routeForm.patchValue({ fecha: '' });
      component.onSubmit();

      expect(routeService.createRoute).not.toHaveBeenCalled();
      expect(component.routeForm.touched).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      const date = new Date(Date.UTC(2024, 0, 15));
      component.routeForm.patchValue({
        fecha: date,
        bodega_origen: 'Bodega Central',
        estado: 'Pendiente',
        vehiculo_id: 1,
        conductor_id: 1,
        condiciones_almacenamiento: 'Ambiente',
      });

      const paradaForm = component.paradas.at(0);
      paradaForm.patchValue({
        cliente_id: 'cliente-1',
        direccion: 'Calle 123',
        contacto: 'Juan',
        latitud: 4.6097,
        longitud: -74.0817,
      });
    });

    it('should call createRoute service on valid form submission', () => {
      routeService.createRoute.and.returnValue(of({} as any));

      component.onSubmit();

      expect(routeService.createRoute).toHaveBeenCalledWith(
        jasmine.objectContaining({
          fecha: '2024-01-15',
          bodega_origen: 'Bodega Central',
          estado: 'Pendiente',
          vehiculo_id: 1,
          conductor_id: 1,
        }),
      );
    });

    it('should format paradas correctly with latitud and longitud', () => {
      routeService.createRoute.and.returnValue(of({} as any));

      component.onSubmit();

      const callArgs = routeService.createRoute.calls.mostRecent().args[0];
      expect(callArgs.paradas[0].latitud).toBe(4.6097);
      expect(callArgs.paradas[0].longitud).toBe(-74.0817);
      // expect(callArgs.paradas[0].orden).toBe(1);
    });

    it('should navigate to /routes on successful submission', () => {
      routeService.createRoute.and.returnValue(of({} as any));

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/routes']);
    });

    it('should show success snackbar on successful submission', () => {
      routeService.createRoute.and.returnValue(of({} as any));

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Ruta creada exitosamente' },
        }),
      );
    });

    it('should handle error on submission failure', () => {
      const errorResponse = { error: { detail: { detail: 'Error del servidor' } } };
      routeService.createRoute.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Error del servidor' },
        }),
      );
    });

    it('should set isLoading to false on error', () => {
      routeService.createRoute.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /routes on cancel', () => {
      component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/routes']);
    });
  });
});
