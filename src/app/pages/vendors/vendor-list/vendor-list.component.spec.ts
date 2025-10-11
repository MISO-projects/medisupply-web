import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { VendorListComponent } from './vendor-list.component';
import { VendorService } from '../../../services/vendor.service';
import { Vendor } from '../../../models/vendor.model';

describe('VendorListComponent', () => {
  let component: VendorListComponent;
  let fixture: ComponentFixture<VendorListComponent>;
  let vendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    const vendorServiceSpy = jasmine.createSpyObj('VendorService', ['getVendors']);

    await TestBed.configureTestingModule({
      imports: [VendorListComponent],
      providers: [{ provide: VendorService, useValue: vendorServiceSpy }, provideRouter([])],
    }).compileComponents();

    vendorService = TestBed.inject(VendorService) as jasmine.SpyObj<VendorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vendors on init', () => {
    const mockVendors: Vendor[] = [
      {
        id: '1',
        nombre: 'Vendor 1',
        email: 'vendor1@test.com',
        zona_asignada: 'Perú',
        plan_venta: 'plan-123',
        meta_venta: 1000,
      },
    ];

    vendorService.getVendors.and.returnValue(of(mockVendors));

    fixture.detectChanges(); // triggers ngOnInit

    expect(vendorService.getVendors).toHaveBeenCalled();
    expect(component.vendedores.length).toBe(1);
    expect(component.isLoading).toBeFalsy();
  });
});
