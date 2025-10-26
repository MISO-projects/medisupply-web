import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SalesPlanListComponent } from './sales-plan-list.component';
import { SalesPlanService } from '../../../services/sales-plan.service';
import { SalesPlan } from '../../../models/sales-plan.model';

describe('SalesPlanListComponent', () => {
  let component: SalesPlanListComponent;
  let fixture: ComponentFixture<SalesPlanListComponent>;
  let salesPlanService: jasmine.SpyObj<SalesPlanService>;

  beforeEach(async () => {
    const salesPlanServiceSpy = jasmine.createSpyObj('SalesPlanService', ['listSalesPlans']);

    await TestBed.configureTestingModule({
      imports: [SalesPlanListComponent],
      providers: [{ provide: SalesPlanService, useValue: salesPlanServiceSpy }, provideRouter([])],
    }).compileComponents();

    salesPlanService = TestBed.inject(SalesPlanService) as jasmine.SpyObj<SalesPlanService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPlanListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sales plans on init', () => {
    const mockSalesPlans: SalesPlan[] = [
      {
        id: '1',
        nombre: 'Plan Q1 2024',
        fecha_inicio: '2024-01-01T00:00:00',
        fecha_fin: '2024-03-31T23:59:59',
        descripcion: 'Plan de ventas del primer trimestre',
        meta_venta: 100000,
        zona_asignada: 'Perú',
      },
    ];

    salesPlanService.listSalesPlans.and.returnValue(of(mockSalesPlans));

    fixture.detectChanges(); // triggers ngOnInit

    expect(salesPlanService.listSalesPlans).toHaveBeenCalled();
    expect(component.salesPlans.length).toBe(1);
    expect(component.isLoading).toBeFalsy();
  });
});
