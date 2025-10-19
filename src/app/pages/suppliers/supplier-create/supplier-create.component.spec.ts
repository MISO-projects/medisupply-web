import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { SupplierCreateComponent } from './supplier-create.component';
import { SupplierService } from '../../../services/suppliers.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SupplierCreateComponent', () => {
  let component: SupplierCreateComponent;
  let fixture: ComponentFixture<SupplierCreateComponent>;
  let supplierService: jasmine.SpyObj<SupplierService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const supplierServiceSpy = jasmine.createSpyObj('SupplierService', ['createSupplier']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [SupplierCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: SupplierService, useValue: supplierServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    supplierService = TestBed.inject(SupplierService) as jasmine.SpyObj<SupplierService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.supplierForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        nombre: 'Test Supplier',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      expect(form.valid).toBeTruthy();
    });

    it('should validate email format', () => {
      const form = component.supplierForm;
      const emailControl = form.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should have correct initial form structure', () => {
      const form = component.supplierForm;
      expect(form.get('nombre')).toBeTruthy();
      expect(form.get('id_tributario')).toBeTruthy();
      expect(form.get('tipo_proveedor')).toBeTruthy();
      expect(form.get('email')).toBeTruthy();
      expect(form.get('contacto')).toBeTruthy();
      expect(form.get('pais')).toBeTruthy();
      expect(form.get('condiciones_entrega')).toBeTruthy();
    });
  });

  describe('ID Tributario Validator - Perú', () => {
    it('should validate Perú RUC with 11 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Perú' });

      form.get('id_tributario')?.setValue('12345678901');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should invalidate Perú RUC with less than 11 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Perú' });

      form.get('id_tributario')?.setValue('1234567890');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });

    it('should invalidate Perú RUC with more than 11 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Perú' });

      form.get('id_tributario')?.setValue('123456789012');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });

    it('should invalidate Perú RUC with non-numeric characters', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Perú' });

      form.get('id_tributario')?.setValue('1234567890A');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });
  });

  describe('ID Tributario Validator - Colombia', () => {
    it('should validate Colombia NIT with 9 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia' });

      form.get('id_tributario')?.setValue('123456789');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should validate Colombia NIT with 10 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia' });

      form.get('id_tributario')?.setValue('1234567890');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should invalidate Colombia NIT with 8 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia' });

      form.get('id_tributario')?.setValue('12345678');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });

    it('should invalidate Colombia NIT with 11 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia' });

      form.get('id_tributario')?.setValue('12345678901');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });
  });

  describe('ID Tributario Validator - México', () => {
    it('should validate México RFC with valid format (12 characters)', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'México' });

      form.get('id_tributario')?.setValue('ABC123456XYZ');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should validate México RFC with valid format (13 characters)', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'México' });

      form.get('id_tributario')?.setValue('ABCD123456XYZ');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should validate México RFC with lowercase (converts to uppercase)', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'México' });

      form.get('id_tributario')?.setValue('abc123456xyz');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should invalidate México RFC with invalid format', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'México' });

      form.get('id_tributario')?.setValue('123ABC456XYZ');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });

    it('should invalidate México RFC with too few characters', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'México' });

      form.get('id_tributario')?.setValue('AB123456XYZ');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });
  });

  describe('ID Tributario Validator - Ecuador', () => {
    it('should validate Ecuador RUC with 13 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Ecuador' });

      form.get('id_tributario')?.setValue('1234567890123');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });

    it('should invalidate Ecuador RUC with less than 13 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Ecuador' });

      form.get('id_tributario')?.setValue('123456789012');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });

    it('should invalidate Ecuador RUC with more than 13 digits', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Ecuador' });

      form.get('id_tributario')?.setValue('12345678901234');
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });
  });

  describe('ID Tributario Dynamic Validation', () => {
    it('should revalidate id_tributario when pais changes', () => {
      const form = component.supplierForm;
      const idTributarioControl = form.get('id_tributario');

      // Set Colombia NIT (10 digits)
      form.patchValue({ pais: 'Colombia', id_tributario: '1234567890' });
      expect(idTributarioControl?.valid).toBeTruthy();

      // Change to Perú (needs 11 digits)
      form.patchValue({ pais: 'Perú' });
      expect(idTributarioControl?.hasError('idTributarioInvalid')).toBeTruthy();

      // Update to valid Perú RUC
      idTributarioControl?.setValue('12345678901');
      expect(idTributarioControl?.valid).toBeTruthy();
    });

    it('should allow empty id_tributario', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia' });

      form.get('id_tributario')?.setValue('');
      expect(form.get('id_tributario')?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should create supplier successfully', () => {
      supplierService.createSupplier.and.returnValue(of({ message: 'Success', data: {} as any }));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        id_tributario: '123456789',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
        condiciones_entrega: 'Entrega en 5 días',
      });

      component.onSubmit();

      expect(supplierService.createSupplier).toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/suppliers']);
    });

    it('should not submit if form is invalid', () => {
      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        // Missing required fields
      });

      component.onSubmit();

      expect(supplierService.createSupplier).not.toHaveBeenCalled();
      expect(component.supplierForm.touched).toBeTruthy();
    });

    it('should normalize RFC to uppercase for México', () => {
      supplierService.createSupplier.and.returnValue(of({ message: 'Success', data: {} as any }));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        id_tributario: 'abc123456xyz',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'México',
        contacto: 'Juan Pérez',
      });

      component.onSubmit();

      expect(supplierService.createSupplier).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id_tributario: 'ABC123456XYZ',
        }),
      );
    });

    it('should not normalize id_tributario for other countries', () => {
      supplierService.createSupplier.and.returnValue(of({ message: 'Success', data: {} as any }));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        id_tributario: '123456789',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      component.onSubmit();

      expect(supplierService.createSupplier).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id_tributario: '123456789',
        }),
      );
    });

    it('should handle error when creating supplier', () => {
      const errorResponse = { error: { detail: { detail: 'Server error' } } };
      supplierService.createSupplier.and.returnValue(throwError(() => errorResponse));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      component.onSubmit();

      expect(supplierService.createSupplier).toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Server error' },
        }),
      );
      expect(router.navigate).toHaveBeenCalledWith(['/suppliers']);
    });

    it('should handle error with default message', () => {
      const errorResponse = { error: {} };
      supplierService.createSupplier.and.returnValue(throwError(() => errorResponse));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Error al crear el proveedor. Por favor, intenta de nuevo.' },
        }),
      );
    });

    it('should set isLoading to true when submitting', () => {
      supplierService.createSupplier.and.returnValue(of({ message: 'Success', data: {} as any }));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      expect(component.isLoading).toBe(false);
      component.onSubmit();
      expect(component.isLoading).toBe(true);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to suppliers list on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/suppliers']);
    });
  });

  describe('Component Properties', () => {
    it('should have correct paises options', () => {
      expect(component.paises).toEqual(['Perú', 'Colombia', 'Ecuador', 'México']);
    });

    it('should have correct tipos_proveedores options', () => {
      expect(component.tipos_proveedores).toEqual([
        'Fabricante',
        'Distribuidor',
        'Mayorista',
        'Importador',
        'Minorista',
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to pais value changes', () => {
      const form = component.supplierForm;
      form.patchValue({ pais: 'Colombia', id_tributario: '1234567890' });
      expect(form.get('id_tributario')?.valid).toBeTruthy();

      // Change country and verify revalidation
      form.patchValue({ pais: 'Perú' });
      expect(form.get('id_tributario')?.hasError('idTributarioInvalid')).toBeTruthy();
    });
  });

  describe('Optional Fields', () => {
    it('should allow submission without optional fields', () => {
      supplierService.createSupplier.and.returnValue(of({ message: 'Success', data: {} as any }));

      component.supplierForm.patchValue({
        nombre: 'Test Supplier',
        tipo_proveedor: 'Fabricante',
        email: 'test@test.com',
        pais: 'Colombia',
        contacto: 'Juan Pérez',
      });

      component.onSubmit();

      expect(supplierService.createSupplier).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/suppliers']);
    });
  });
});
