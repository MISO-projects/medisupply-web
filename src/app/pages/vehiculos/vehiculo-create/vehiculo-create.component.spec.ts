import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehiculoCreateComponent } from './vehiculo-create.component';
import { VehiculoService } from '../../../services/vehiculos.service';
import { Vehiculo } from '../../../models/vehiculo.model';

describe('VehiculoCreateComponent', () => {
  let component: VehiculoCreateComponent;
  let fixture: ComponentFixture<VehiculoCreateComponent>;
  let vehiculoService: jasmine.SpyObj<VehiculoService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const vehiculoServiceSpy = jasmine.createSpyObj('VehiculoService', ['createVehiculo']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [VehiculoCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: VehiculoService, useValue: vehiculoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    vehiculoService = TestBed.inject(VehiculoService) as jasmine.SpyObj<VehiculoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.vehiculoForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        tipo: 'Furgón',
      });

      expect(form.valid).toBeTruthy();
    });

    it('should validate año range', () => {
      const añoControl = component.vehiculoForm.get('año');
      añoControl?.setValue(1800);
      expect(añoControl?.hasError('min')).toBeTruthy();
      añoControl?.setValue(2020);
      expect(añoControl?.hasError('min')).toBeFalsy();
    });

    it('should have activo default to true', () => {
      expect(component.vehiculoForm.get('activo')?.value).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.vehiculoForm.patchValue({
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        tipo: 'Furgón',
        año: 2020,
        capacidad_kg: 1500,
        activo: true,
      });
    });

    it('should convert año and capacidad_kg to numbers', () => {
      const mockVehiculo: Vehiculo = {
        id: 1,
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Hiace',
        tipo: 'Furgón',
        activo: true,
      };
      vehiculoService.createVehiculo.and.returnValue(of(mockVehiculo));

      component.onSubmit();

      const callArgs = vehiculoService.createVehiculo.calls.mostRecent().args[0];
      expect(typeof callArgs.año).toBe('number');
      expect(typeof callArgs.capacidad_kg).toBe('number');
    });

    it('should navigate to /vehiculos on success', () => {
      vehiculoService.createVehiculo.and.returnValue(of({} as Vehiculo));
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/vehiculos']);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /vehiculos on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/vehiculos']);
    });
  });
});
