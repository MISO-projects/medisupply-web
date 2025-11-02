import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { InventoryCreateComponent } from './inventory-create.component';
import { InventoryService } from '../../../services/inventory.service';
import { ProductService } from '../../../services/products.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { Product } from '../../../models/product.model';
import { InventoryCreatePayload } from '../../../models/inventory.model';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    nombre: 'Producto 1 (Tijeras)',
    sku: 'SKU-001',
    categoria: 'Equipamiento',
    proveedor_id: 'prov-1',
    proveedor_nombre: 'Proveedor A',
    precio_unitario: '150',
    unidad_medida: 'unidad',
    disponible: true,
    tipo_almacenamiento: 'AMBIENTE',
    descripcion: '',
    imagen_url: '',
    observaciones: '',
  },
  {
    id: 'prod-2',
    nombre: 'Producto 2 (Gasa)',
    sku: 'SKU-002',
    categoria: 'Insumos',
    proveedor_id: 'prov-2',
    proveedor_nombre: 'Proveedor B',
    precio_unitario: '25',
    unidad_medida: 'caja',
    disponible: true,
    tipo_almacenamiento: 'AMBIENTE',
    descripcion: '',
    imagen_url: '',
    observaciones: '',
  },
];

describe('InventoryCreateComponent', () => {
  let component: InventoryCreateComponent;
  let fixture: ComponentFixture<InventoryCreateComponent>;
  let inventoryService: jasmine.SpyObj<InventoryService>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let datePipe: DatePipe;

  beforeEach(async () => {
    // Spies
    const inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['createInventoryRecord']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [InventoryCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        DatePipe,
      ],
    }).compileComponents();

    // Inyección de Mocks
    inventoryService = TestBed.inject(InventoryService) as jasmine.SpyObj<InventoryService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    datePipe = TestBed.inject(DatePipe);
  });

  beforeEach(() => {
    productService.getProducts.and.returnValue(of(mockProducts));
    fixture = TestBed.createComponent(InventoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load products on init', () => {
      expect(productService.getProducts).toHaveBeenCalled();
      component.products$?.subscribe((products) => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });
    });

    it('should initialize form with default values', () => {
      const formValue = component.inventoryForm.value;
      expect(formValue.bodega).toBe('Bodega Principal');
      expect(formValue.condiciones_almacenamiento).toBe('AMBIENTE');
      expect(formValue.estado).toBe('DISPONIBLE');
    });

    it('should set minDate to today', () => {
      const today = new Date();
      expect(component['minDate'].getDate()).toEqual(today.getDate());
      expect(component['minDate'].getMonth()).toEqual(today.getMonth());
      expect(component['minDate'].getFullYear()).toEqual(today.getFullYear());
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.inventoryForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        producto_id: 'prod-1',
        cantidad: 100,
        lote: 'LOTE-123',
        fecha_vencimiento: new Date(),
      });
      expect(form.valid).toBeTruthy();
    });

    it('should mark producto_id as required', () => {
      const control = component.inventoryForm.get('producto_id');
      expect(control?.hasError('required')).toBeTruthy();
      control?.setValue('prod-1');
      expect(control?.hasError('required')).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    let testDate: Date;
    let testDateISO: string;

    beforeEach(() => {
      testDate = new Date();
      testDateISO = datePipe.transform(testDate, 'yyyy-MM-dd')!;

      component.inventoryForm.patchValue({
        producto_id: 'prod-1',
        cantidad: 150,
        bodega: 'Bodega Refrigerada',
        ubicacion_interna: 'Estante C4',
        condiciones_almacenamiento: 'REFRIGERADO',
        lote: 'LOTE-ABC-123',
        fecha_vencimiento: testDate,
        estado: 'DISPONIBLE',
        observaciones: 'Test obs',
        condiciones_especiales: 'Test cond',
      });

      inventoryService.createInventoryRecord.and.returnValue(of({} as any));
    });

    it('should not submit if form is invalid', () => {
      component.inventoryForm.patchValue({ producto_id: '' });
      component.onSubmit();
      expect(inventoryService.createInventoryRecord).not.toHaveBeenCalled();
    });

    it('should call createInventoryRecord with the correctly formatted payload', () => {
      component.onSubmit();

      const expectedPayload: InventoryCreatePayload = {
        producto_id: 'prod-1',
        lote: 'LOTE-ABC-123',
        fecha_vencimiento: testDateISO,
        cantidad: 150,
        ubicacion: 'Bodega Refrigerada - Estante C4',
        temperatura_requerida: 'REFRIGERADO',
        estado: 'DISPONIBLE',
        observaciones: 'Test obs',
        condiciones_especiales: 'Test cond',
      };
      expect(inventoryService.createInventoryRecord).toHaveBeenCalledWith(expectedPayload);
    });

    it('should build payload ubicacion correctly if ubicacion_interna is empty', () => {
      component.inventoryForm.patchValue({ ubicacion_interna: '' });
      component.onSubmit();
      const payload = inventoryService.createInventoryRecord.calls.mostRecent().args[0];
      expect(payload.ubicacion).toBe('Bodega Refrigerada');
    });

    it('should navigate to /inventory on successful submission', () => {
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/inventory']);
    });

    it('should show success snackbar on successful submission', () => {
      component.onSubmit();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Ingreso registrado exitosamente' },
        }),
      );
    });

    it('should handle error on submission failure', () => {
      const errorResponse = { error: { detail: 'Error de prueba' } };
      inventoryService.createInventoryRecord.and.returnValue(throwError(() => errorResponse));
      component.onSubmit();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Error de prueba' },
        }),
      );
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /inventory on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/inventory']);
    });
  });
});
