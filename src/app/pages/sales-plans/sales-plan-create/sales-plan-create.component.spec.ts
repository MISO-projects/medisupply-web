import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { SalesPlanCreateComponent } from './sales-plan-create.component';
import { SalesPlanService } from '../../../services/sales-plan.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SalesPlanCreateComponent', () => {
  let component: SalesPlanCreateComponent;
  let fixture: ComponentFixture<SalesPlanCreateComponent>;
  let salesPlanService: jasmine.SpyObj<SalesPlanService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const salesPlanServiceSpy = jasmine.createSpyObj('SalesPlanService', ['createSalesPlan']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [SalesPlanCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: SalesPlanService, useValue: salesPlanServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    salesPlanService = TestBed.inject(SalesPlanService) as jasmine.SpyObj<SalesPlanService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPlanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.salesPlanForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      nombre: 'Plan Q1 2025',
      fecha_inicio: new Date('2025-01-01'),
      fecha_fin: new Date('2025-03-31'),
      meta_venta: 10000,
    });

    expect(form.valid).toBeTruthy();
  });

  it('should create sales plan successfully', () => {
    salesPlanService.createSalesPlan.and.returnValue(of({} as any));

    component.salesPlanForm.patchValue({
      nombre: 'Plan Q1 2025',
      fecha_inicio: new Date('2025-01-01'),
      fecha_fin: new Date('2025-03-31'),
      meta_venta: 10000,
    });

    component.onSubmit();

    expect(salesPlanService.createSalesPlan).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sales-plans']);
  });

  it('should validate meta_venta is greater than 0', () => {
    const form = component.salesPlanForm;

    form.patchValue({
      nombre: 'Plan Q1 2025',
      fecha_inicio: new Date('2025-01-01'),
      fecha_fin: new Date('2025-03-31'),
      meta_venta: -1000,
    });

    expect(form.get('meta_venta')?.hasError('min')).toBeTruthy();
    expect(form.valid).toBeFalsy();
  });
});
