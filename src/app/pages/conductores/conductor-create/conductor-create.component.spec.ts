import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConductorCreateComponent } from './conductor-create.component';
import { ConductorService } from '../../../services/conductores.service';
import { Conductor } from '../../../models/conductor.model';

describe('ConductorCreateComponent', () => {
  let component: ConductorCreateComponent;
  let fixture: ComponentFixture<ConductorCreateComponent>;
  let conductorService: jasmine.SpyObj<ConductorService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const conductorServiceSpy = jasmine.createSpyObj('ConductorService', ['createConductor']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ConductorCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: ConductorService, useValue: conductorServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    conductorService = TestBed.inject(ConductorService) as jasmine.SpyObj<ConductorService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.conductorForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        licencia_conducir: 'LIC123456',
      });

      expect(form.valid).toBeTruthy();
    });

    it('should mark nombre as required', () => {
      const nombreControl = component.conductorForm.get('nombre');
      expect(nombreControl?.hasError('required')).toBeTruthy();
      nombreControl?.setValue('Juan');
      expect(nombreControl?.hasError('required')).toBeFalsy();
    });

    it('should validate email format', () => {
      const emailControl = component.conductorForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should have activo default to true', () => {
      expect(component.conductorForm.get('activo')?.value).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.conductorForm.patchValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        licencia_conducir: 'LIC123456',
        telefono: '3001234567',
        email: 'juan@test.com',
        activo: true,
      });
    });

    it('should not submit if form is invalid', () => {
      component.conductorForm.patchValue({ nombre: '' });
      component.onSubmit();
      expect(conductorService.createConductor).not.toHaveBeenCalled();
    });

    it('should call createConductor on valid form submission', () => {
      const mockConductor: Conductor = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        licencia_conducir: 'LIC123456',
        activo: true,
      };
      conductorService.createConductor.and.returnValue(of(mockConductor));

      component.onSubmit();

      expect(conductorService.createConductor).toHaveBeenCalled();
      expect(component.isLoading).toBe(true);
    });

    it('should navigate to /conductores on success', () => {
      conductorService.createConductor.and.returnValue(of({} as Conductor));
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/conductores']);
    });

    it('should show error message on failure', () => {
      const errorResponse = { error: { detail: 'Error del servidor' } };
      conductorService.createConductor.and.returnValue(throwError(() => errorResponse));
      component.onSubmit();
      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /conductores on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/conductores']);
    });
  });
});
