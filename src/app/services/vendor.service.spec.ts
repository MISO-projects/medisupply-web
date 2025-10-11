import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorService } from './vendor.service';
import { Vendor } from '../models/vendor.model';
import { environment } from '../../environments/environment';

describe('VendorService', () => {
  let service: VendorService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.vendorApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorService],
    });
    service = TestBed.inject(VendorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new vendor', () => {
    const newVendor: Vendor = {
      nombre: 'New Vendor',
      documento_identidad: '123456',
      email: 'new@test.com',
      zona_asignada: 'Perú',
      plan_venta: 'plan-123',
      meta_venta: 1500,
    };

    const createdVendor: Vendor = {
      ...newVendor,
      id: '3',
    };

    service.createVendor(newVendor).subscribe((vendor) => {
      expect(vendor.id).toBe('3');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdVendor);
  });
});
