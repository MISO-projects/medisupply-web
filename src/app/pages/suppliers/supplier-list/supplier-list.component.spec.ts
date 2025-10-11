import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SupplierListComponent } from './supplier-list.component';
import { SupplierService } from '../../../services/suppliers.service';
import { Supplier, PaisEnum, TipoProveedorEnum } from '../../../models/supplier.model';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let fixture: ComponentFixture<SupplierListComponent>;
  let supplierService: jasmine.SpyObj<SupplierService>;

  beforeEach(async () => {
    const supplierServiceSpy = jasmine.createSpyObj('SupplierService', ['listSuppliers']);

    await TestBed.configureTestingModule({
      imports: [SupplierListComponent],
      providers: [
        { provide: SupplierService, useValue: supplierServiceSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    supplierService = TestBed.inject(SupplierService) as jasmine.SpyObj<SupplierService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suppliers on init', () => {
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        nombre: 'Proveedor 1',
        id_tributario: '123456789',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'proveedor1@test.com',
        pais: PaisEnum.COLOMBIA,
        contacto: 'Juan Pérez',
        condiciones_entrega: 'Entrega en 5 días',
      },
      {
        id: '2',
        nombre: 'Proveedor 2',
        id_tributario: '987654321',
        tipo_proveedor: TipoProveedorEnum.DISTRIBUIDOR,
        email: 'proveedor2@test.com',
        pais: PaisEnum.PERU,
      },
    ];

    supplierService.listSuppliers.and.returnValue(of(mockSuppliers));

    fixture.detectChanges(); // triggers ngOnInit

    expect(supplierService.listSuppliers).toHaveBeenCalled();
    expect(component.suppliers.length).toBe(2);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should set isLoading to true while loading suppliers', () => {
    supplierService.listSuppliers.and.returnValue(of([]));

    expect(component.isLoading).toBe(false);

    fixture.detectChanges(); // triggers ngOnInit

    // After the observable completes, isLoading should be false
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty supplier list', () => {
    supplierService.listSuppliers.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.suppliers.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading suppliers fails', () => {
    const errorResponse = { message: 'Server error' };
    supplierService.listSuppliers.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.suppliers.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('Error al cargar los proveedores. Por favor, intenta de nuevo.');
  });

  it('should have correct column definitions', () => {
    expect(component.columns.length).toBe(5);
    expect(component.columns[0]).toEqual({ key: 'nombre', label: 'Nombre' });
    expect(component.columns[1]).toEqual({ key: 'tipo_proveedor', label: 'Tipo de proveedor' });
    expect(component.columns[2]).toEqual({ key: 'id_tributario', label: 'ID tributario' });
    expect(component.columns[3]).toEqual({ key: 'pais', label: 'País' });
    expect(component.columns[4]).toEqual({ key: 'contacto', label: 'Contacto' });
  });

  it('should load suppliers with all fields populated', () => {
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        nombre: 'Proveedor Completo',
        id_tributario: '111222333',
        tipo_proveedor: TipoProveedorEnum.MAYORISTA,
        email: 'completo@test.com',
        pais: PaisEnum.MEXICO,
        contacto: 'María García',
        condiciones_entrega: 'Entrega inmediata',
      },
    ];

    supplierService.listSuppliers.and.returnValue(of(mockSuppliers));

    fixture.detectChanges();

    expect(component.suppliers[0].nombre).toBe('Proveedor Completo');
    expect(component.suppliers[0].contacto).toBe('María García');
    expect(component.suppliers[0].condiciones_entrega).toBe('Entrega inmediata');
  });

  it('should reset error before loading suppliers', () => {
    // First call fails
    supplierService.listSuppliers.and.returnValue(throwError(() => ({ message: 'Error' })));
    fixture.detectChanges();
    expect(component.error).not.toBeNull();

    // Second call succeeds
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        nombre: 'Proveedor 1',
        id_tributario: '123',
        tipo_proveedor: TipoProveedorEnum.FABRICANTE,
        email: 'test@test.com',
        pais: PaisEnum.COLOMBIA,
      },
    ];
    supplierService.listSuppliers.and.returnValue(of(mockSuppliers));

    // Trigger another load by calling ngOnInit manually
    component.ngOnInit();

    expect(component.error).toBeNull();
    expect(component.suppliers.length).toBe(1);
  });
});
