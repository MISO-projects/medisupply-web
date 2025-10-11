import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { VendorCreateComponent } from './vendor-create.component';
import { VendorService } from '../../../services/vendor.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VendorCreateComponent', () => {
  let component: VendorCreateComponent;
  let fixture: ComponentFixture<VendorCreateComponent>;
  let vendorService: jasmine.SpyObj<VendorService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const vendorServiceSpy = jasmine.createSpyObj('VendorService', ['createVendor']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [VendorCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: VendorService, useValue: vendorServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    vendorService = TestBed.inject(VendorService) as jasmine.SpyObj<VendorService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.vendorForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      nombre: 'Test Vendor',
      email: 'test@test.com',
      zona_asignada: 'Perú',
      plan_venta: 'plan-123',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should create vendor successfully', () => {
    vendorService.createVendor.and.returnValue(of({} as any));

    component.vendorForm.patchValue({
      nombre: 'Test Vendor',
      email: 'test@test.com',
      zona_asignada: 'Perú',
      plan_venta: 'plan-123',
      meta_venta: 1000,
    });

    component.onSubmit();

    expect(vendorService.createVendor).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/vendors']);
  });
});
