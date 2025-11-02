import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productServiceSpy }, provideRouter([])],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        nombre: 'Producto 1',
        categoria: 'Medicamento',
        sku: 'SKU001',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor 1',
        precio_unitario: '100.50',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Ninguna',
        imagen_url: 'https://example.com/image1.jpg',
        disponible: true,
        descripcion: 'Descripción del producto 1',
      },
      {
        id: '2',
        nombre: 'Producto 2',
        categoria: 'Insumos médicos',
        sku: 'SKU002',
        proveedor_id: 'prov2',
        proveedor_nombre: 'Proveedor 2',
        precio_unitario: '25.99',
        unidad_medida: 'caja',
        tipo_almacenamiento: 'refrigerado',
        observaciones: 'Mantener refrigerado',
        imagen_url: 'https://example.com/image2.jpg',
        disponible: true,
        descripcion: 'Descripción del producto 2',
      },
    ];

    productService.getProducts.and.returnValue(of(mockProducts));

    fixture.detectChanges(); // triggers ngOnInit

    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should set isLoading to true while loading products', () => {
    productService.getProducts.and.returnValue(of([]));

    expect(component.isLoading).toBe(false);

    fixture.detectChanges(); // triggers ngOnInit

    // After the observable completes, isLoading should be false
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty product list', () => {
    productService.getProducts.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.products.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading products fails', () => {
    const errorResponse = { message: 'Server error' };
    productService.getProducts.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.products.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('Error al cargar los productos. Por favor, intenta de nuevo.');
  });

  it('should have correct column definitions', () => {
    expect(component.columns.length).toBe(5);
    expect(component.columns[0]).toEqual({ key: 'nombre', label: 'Nombre' });
    expect(component.columns[1]).toEqual({ key: 'sku', label: 'SKU' });
    expect(component.columns[2]).toEqual({ key: 'categoria', label: 'Categoría' });
    expect(component.columns[3]).toEqual({ key: 'proveedor_nombre', label: 'Proveedor' });
    expect(component.columns[4]).toEqual({ key: 'precio_unitario', label: 'Precio unitario' });
  });

  it('should load products with all fields populated', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        nombre: 'Producto Completo',
        categoria: 'Equipamiento',
        sku: 'SKU999',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor Completo',
        precio_unitario: '500.00',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Observaciones completas',
        imagen_url: 'https://example.com/complete.jpg',
        disponible: true,
        descripcion: 'Descripción completa del producto',
      },
    ];

    productService.getProducts.and.returnValue(of(mockProducts));

    fixture.detectChanges();

    expect(component.products[0].nombre).toBe('Producto Completo');
    expect(component.products[0].categoria).toBe('Equipamiento');
    expect(component.products[0].sku).toBe('SKU999');
    expect(component.products[0].proveedor_nombre).toBe('Proveedor Completo');
    expect(component.products[0].precio_unitario).toBe('500.00');
  });

  it('should reset error before loading products', () => {
    // First call fails
    productService.getProducts.and.returnValue(throwError(() => ({ message: 'Error' })));
    fixture.detectChanges();
    expect(component.error).not.toBeNull();

    // Second call succeeds
    const mockProducts: Product[] = [
      {
        id: '1',
        nombre: 'Producto 1',
        categoria: 'Medicamento',
        sku: 'SKU001',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor 1',
        precio_unitario: '100.00',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: '',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      },
    ];
    productService.getProducts.and.returnValue(of(mockProducts));

    // Trigger another load by calling ngOnInit manually
    component.ngOnInit();

    expect(component.error).toBeNull();
    expect(component.products.length).toBe(1);
  });

  it('should display products with different categories', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        nombre: 'Medicamento Test',
        categoria: 'Medicamento',
        sku: 'MED001',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Farmacéutica 1',
        precio_unitario: '50.00',
        unidad_medida: 'tableta',
        tipo_almacenamiento: 'ambiente',
        observaciones: '',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      },
      {
        id: '2',
        nombre: 'Equipo Quirúrgico',
        categoria: 'Equipamiento',
        sku: 'EQU001',
        proveedor_id: 'prov2',
        proveedor_nombre: 'Equipos Médicos S.A.',
        precio_unitario: '1500.00',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Mantenimiento anual',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      },
    ];

    productService.getProducts.and.returnValue(of(mockProducts));

    fixture.detectChanges();

    expect(component.products.length).toBe(2);
    expect(component.products[0].categoria).toBe('Medicamento');
    expect(component.products[1].categoria).toBe('Equipamiento');
  });
});
