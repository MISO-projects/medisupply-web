import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { VendorCreateComponent } from './vendor-create.component';
import { VendorService } from '../../../services/vendor.service';
import { SalesPlanService } from '../../../services/sales-plan.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VendorCreateComponent', () => {
  let component: VendorCreateComponent;
  let fixture: ComponentFixture<VendorCreateComponent>;
  let vendorService: jasmine.SpyObj<VendorService>;
  let salesPlanService: jasmine.SpyObj<SalesPlanService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const vendorServiceSpy = jasmine.createSpyObj('VendorService', ['createVendor']);
    const salesPlanServiceSpy = jasmine.createSpyObj('SalesPlanService', ['listSalesPlans']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    salesPlanServiceSpy.listSalesPlans.and.returnValue(
      of([
        {
          id: 'plan-uuid-123',
          nombre: 'Plan Test 1',
          fecha_inicio: '2024-01-01',
          fecha_fin: '2024-12-31',
          descripcion: 'Plan de prueba',
          meta_venta: 10000,
          zona_asignada: 'Perú',
        },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [VendorCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: VendorService, useValue: vendorServiceSpy },
        { provide: SalesPlanService, useValue: salesPlanServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    vendorService = TestBed.inject(VendorService) as jasmine.SpyObj<VendorService>;
    salesPlanService = TestBed.inject(SalesPlanService) as jasmine.SpyObj<SalesPlanService>;
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
      plan_venta_id: 'plan-uuid-123',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should create vendor successfully', () => {
    vendorService.createVendor.and.returnValue(of({} as any));

    component.vendorForm.patchValue({
      nombre: 'Test Vendor',
      email: 'test@test.com',
      zona_asignada: 'Perú',
      plan_venta_id: 'plan-uuid-123',
    });

    component.onSubmit();

    expect(vendorService.createVendor).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/vendors']);
  });
});
