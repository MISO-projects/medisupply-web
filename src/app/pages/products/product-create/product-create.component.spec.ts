import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ProductCreateComponent } from './product-create.component';
import { ProductService } from '../../../services/products.service';
import { SupplierService } from '../../../services/suppliers.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Supplier, PaisEnum, TipoProveedorEnum } from '../../../models/supplier.model';

describe('ProductCreateComponent', () => {
  let component: ProductCreateComponent;
  let fixture: ComponentFixture<ProductCreateComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let supplierService: jasmine.SpyObj<SupplierService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

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

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['createProduct']);
    const supplierServiceSpy = jasmine.createSpyObj('SupplierService', ['listSuppliers']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ProductCreateComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: SupplierService, useValue: supplierServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    supplierService = TestBed.inject(SupplierService) as jasmine.SpyObj<SupplierService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    supplierService.listSuppliers.and.returnValue(of(mockSuppliers));
    fixture = TestBed.createComponent(ProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load suppliers on init', () => {
      expect(supplierService.listSuppliers).toHaveBeenCalled();
      expect(component.suppliers.length).toBe(2);
      expect(component.suppliers).toEqual(mockSuppliers);
    });

    it('should have categories defined', () => {
      expect(component.categories.length).toBe(8);
      expect(component.categories).toContain('Medicamento');
      expect(component.categories).toContain('Insumos médicos');
      expect(component.categories).toContain('Equipamiento');
    });

    it('should initialize with isLoading as false', () => {
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.productForm;
      expect(form.valid).toBeFalsy();

      form.patchValue({
        nombre: 'Test Product',
        categoria: 'Medicamento',
        proveedor_id: '1',
        precio_unitario: '100.50',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
      });

      expect(form.valid).toBeTruthy();
    });

    it('should have correct initial form structure', () => {
      const form = component.productForm;
      expect(form.get('nombre')).toBeTruthy();
      expect(form.get('sku')).toBeTruthy();
      expect(form.get('categoria')).toBeTruthy();
      expect(form.get('proveedor_id')).toBeTruthy();
      expect(form.get('precio_unitario')).toBeTruthy();
      expect(form.get('unidad_medida')).toBeTruthy();
      expect(form.get('tipo_almacenamiento')).toBeTruthy();
      expect(form.get('observaciones')).toBeTruthy();
    });

    it('should mark nombre as required', () => {
      const nombreControl = component.productForm.get('nombre');
      expect(nombreControl?.hasError('required')).toBeTruthy();

      nombreControl?.setValue('Test Product');
      expect(nombreControl?.hasError('required')).toBeFalsy();
    });

    it('should mark categoria as required', () => {
      const categoriaControl = component.productForm.get('categoria');
      expect(categoriaControl?.hasError('required')).toBeTruthy();

      categoriaControl?.setValue('Medicamento');
      expect(categoriaControl?.hasError('required')).toBeFalsy();
    });

    it('should mark proveedor_id as required', () => {
      const proveedorControl = component.productForm.get('proveedor_id');
      expect(proveedorControl?.hasError('required')).toBeTruthy();

      proveedorControl?.setValue('1');
      expect(proveedorControl?.hasError('required')).toBeFalsy();
    });

    it('should mark unidad_medida as required', () => {
      const unidadControl = component.productForm.get('unidad_medida');
      expect(unidadControl?.hasError('required')).toBeTruthy();

      unidadControl?.setValue('unidad');
      expect(unidadControl?.hasError('required')).toBeFalsy();
    });

    it('should mark tipo_almacenamiento as required', () => {
      const tipoControl = component.productForm.get('tipo_almacenamiento');
      expect(tipoControl?.hasError('required')).toBeTruthy();

      tipoControl?.setValue('ambiente');
      expect(tipoControl?.hasError('required')).toBeFalsy();
    });

    it('should not mark sku as required', () => {
      const skuControl = component.productForm.get('sku');
      expect(skuControl?.hasError('required')).toBeFalsy();
    });

    it('should not mark observaciones as required', () => {
      const observacionesControl = component.productForm.get('observaciones');
      expect(observacionesControl?.hasError('required')).toBeFalsy();
    });
  });

  describe('Precio Unitario Validation', () => {
    it('should validate precio_unitario as required', () => {
      const precioControl = component.productForm.get('precio_unitario');
      expect(precioControl?.hasError('required')).toBeTruthy();

      precioControl?.setValue('100');
      expect(precioControl?.hasError('required')).toBeFalsy();
    });

    it('should accept valid prices with no decimals', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('100');
      expect(precioControl?.hasError('pattern')).toBeFalsy();
      expect(precioControl?.valid).toBeTruthy();
    });

    it('should accept valid prices with 1 decimal place', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('100.5');
      expect(precioControl?.hasError('pattern')).toBeFalsy();
      expect(precioControl?.valid).toBeTruthy();
    });

    it('should accept valid prices with 2 decimal places', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('100.99');
      expect(precioControl?.hasError('pattern')).toBeFalsy();
      expect(precioControl?.valid).toBeTruthy();
    });

    it('should reject prices with more than 2 decimal places', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('100.999');
      expect(precioControl?.hasError('pattern')).toBeTruthy();
    });

    it('should reject negative prices', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('-100');
      expect(precioControl?.hasError('pattern')).toBeTruthy();
    });

    it('should reject non-numeric values', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('abc');
      expect(precioControl?.hasError('pattern')).toBeTruthy();
    });

    it('should accept zero as valid price', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('0');
      expect(precioControl?.hasError('pattern')).toBeFalsy();
      expect(precioControl?.valid).toBeTruthy();
    });

    it('should accept large numbers with valid decimals', () => {
      const precioControl = component.productForm.get('precio_unitario');
      precioControl?.setValue('999999.99');
      expect(precioControl?.hasError('pattern')).toBeFalsy();
      expect(precioControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.productForm.patchValue({
        nombre: 'Test Product',
        sku: 'TEST-001',
        categoria: 'Medicamento',
        proveedor_id: '1',
        precio_unitario: '100.50',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Test observations',
      });
    });

    it('should not submit if form is invalid', () => {
      component.productForm.patchValue({ nombre: '' });
      component.onSubmit();

      expect(productService.createProduct).not.toHaveBeenCalled();
      expect(component.productForm.touched).toBeTruthy();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.productForm.reset();
      component.onSubmit();

      expect(component.productForm.get('nombre')?.touched).toBeTruthy();
      expect(component.productForm.get('categoria')?.touched).toBeTruthy();
      expect(component.productForm.get('proveedor_id')?.touched).toBeTruthy();
    });

    it('should call createProduct service on valid form submission', () => {
      const mockProduct = {
        id: '1',
        nombre: 'Test Product',
        sku: 'TEST-001',
        categoria: 'Medicamento',
        proveedor_id: '1',
        proveedor_nombre: 'Proveedor 1',
        precio_unitario: '100.50',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Test observations',
        imagen_url: '',
        stock_disponible: 0,
        disponible: true,
        descripcion: '',
      };

      productService.createProduct.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(productService.createProduct).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nombre: 'Test Product',
          sku: 'TEST-001',
          categoria: 'Medicamento',
          proveedor_id: '1',
          precio_unitario: 100.50,
          unidad_medida: 'unidad',
          tipo_almacenamiento: 'ambiente',
          observaciones: 'Test observations',
        })
      );
    });

    it('should convert precio_unitario to number on submission', () => {
      const mockProduct = {
        id: '1',
        nombre: 'Test Product',
        categoria: 'Medicamento',
        proveedor_id: '1',
        proveedor_nombre: 'Proveedor 1',
        precio_unitario: '250.75',
        unidad_medida: 'caja',
        tipo_almacenamiento: 'refrigerado',
        sku: 'SKU-001',
        observaciones: '',
        imagen_url: '',
        stock_disponible: 0,
        disponible: true,
        descripcion: '',
      };

      productService.createProduct.and.returnValue(of(mockProduct));

      component.onSubmit();

      const callArgs = productService.createProduct.calls.mostRecent().args[0];
      expect(typeof callArgs.precio_unitario).toBe('number');
      expect(callArgs.precio_unitario).toBe(100.50);
    });

    it('should set isLoading to true during submission', () => {
      productService.createProduct.and.returnValue(of({} as any));

      expect(component.isLoading).toBe(false);
      component.onSubmit();
      expect(component.isLoading).toBe(true);
    });

    it('should navigate to /products on successful submission', () => {
      productService.createProduct.and.returnValue(of({} as any));

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should show success snackbar on successful submission', () => {
      productService.createProduct.and.returnValue(of({} as any));

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Producto creado exitosamente' },
          duration: 5000,
        })
      );
    });

    it('should handle error on submission failure', () => {
      const errorResponse = { error: { detail: 'Error del servidor' } };
      productService.createProduct.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Error del servidor' },
          duration: 5000,
        })
      );
    });

    it('should show default error message when no detail provided', () => {
      productService.createProduct.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Error al crear el producto. Por favor, intenta de nuevo.' },
        })
      );
    });

    it('should set isLoading to false on error', () => {
      productService.createProduct.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /products on cancel', () => {
      component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Form with optional fields', () => {
    it('should submit successfully with only required fields', () => {
      component.productForm.patchValue({
        nombre: 'Minimal Product',
        categoria: 'Equipamiento',
        proveedor_id: '2',
        precio_unitario: '50',
        unidad_medida: 'pieza',
        tipo_almacenamiento: 'seco',
      });

      productService.createProduct.and.returnValue(of({} as any));

      component.onSubmit();

      expect(productService.createProduct).toHaveBeenCalled();
      expect(component.productForm.valid).toBeTruthy();
    });

    it('should include optional fields when provided', () => {
      component.productForm.patchValue({
        nombre: 'Complete Product',
        sku: 'COMP-001',
        categoria: 'Dispositivos',
        proveedor_id: '1',
        precio_unitario: '150.25',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Observaciones especiales',
      });

      productService.createProduct.and.returnValue(of({} as any));

      component.onSubmit();

      const callArgs = productService.createProduct.calls.mostRecent().args[0];
      expect(callArgs.sku).toBe('COMP-001');
      expect(callArgs.observaciones).toBe('Observaciones especiales');
    });
  });
});
