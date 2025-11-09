import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './products.service';
import { BulkUploadResponse, Product, ProductResponse } from '../models/product.model';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.bffApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should retrieve all products', () => {
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

      const mockResponse: ProductResponse = {
        productos: mockProducts,
        total: 2,
        page: 1,
        page_size: 10,
        total_pages: 1,
      };

      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
        expect(products[0].nombre).toBe('Producto 1');
        expect(products[1].nombre).toBe('Producto 2');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/disponibles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty products list', () => {
      const mockResponse: ProductResponse = {
        productos: [],
        total: 0,
        page: 1,
        page_size: 10,
        total_pages: 0,
      };

      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(0);
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/disponibles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should extract only productos array from response', () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          nombre: 'Producto Test',
          categoria: 'Equipamiento',
          sku: 'TEST001',
          proveedor_id: 'prov1',
          proveedor_nombre: 'Proveedor Test',
          precio_unitario: '500.00',
          unidad_medida: 'unidad',
          tipo_almacenamiento: 'ambiente',
          observaciones: '',
          imagen_url: '',
          disponible: true,
          descripcion: '',
        },
      ];

      const mockResponse: ProductResponse = {
        productos: mockProducts,
        total: 100,
        page: 2,
        page_size: 20,
        total_pages: 5,
      };

      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        // Verify pagination data is not included in the result
        expect((products as any).total).toBeUndefined();
        expect((products as any).page).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/disponibles`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error for getProducts', () => {
      const errorMessage = 'Error al cargar productos';

      service.getProducts().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/disponibles`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getProduct', () => {
    it('should retrieve a single product by id', () => {
      const mockProduct: Product = {
        id: '123',
        nombre: 'Producto Específico',
        categoria: 'Medicamento',
        sku: 'SPEC001',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor Específico',
        precio_unitario: '250.75',
        unidad_medida: 'caja',
        tipo_almacenamiento: 'refrigerado',
        observaciones: 'Mantener entre 2-8°C',
        imagen_url: 'https://example.com/specific.jpg',
        disponible: true,
        descripcion: 'Descripción detallada del producto',
      };

      service.getProduct('123').subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe('123');
        expect(product.nombre).toBe('Producto Específico');
        expect(product.precio_unitario).toBe('250.75');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle different product categories', () => {
      const mockProduct: Product = {
        id: '456',
        nombre: 'Equipo Quirúrgico',
        categoria: 'Equipamiento',
        sku: 'EQU001',
        proveedor_id: 'prov2',
        proveedor_nombre: 'Equipos Médicos S.A.',
        precio_unitario: '1500.00',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Mantenimiento anual requerido',
        imagen_url: 'https://example.com/equipo.jpg',
        disponible: true,
        descripcion: 'Equipo de última generación',
      };

      service.getProduct('456').subscribe((product) => {
        expect(product.categoria).toBe('Equipamiento');
        expect(product.sku).toBe('EQU001');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/456`);
      req.flush(mockProduct);
    });

    it('should handle HTTP 404 error when product not found', () => {
      const errorMessage = 'Producto no encontrado';

      service.getProduct('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/999`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle product with unavailable status', () => {
      const mockProduct: Product = {
        id: '789',
        nombre: 'Producto No Disponible',
        categoria: 'Medicamento',
        sku: 'ND001',
        proveedor_id: 'prov3',
        proveedor_nombre: 'Proveedor 3',
        precio_unitario: '100.00',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Fuera de stock',
        imagen_url: '',
        disponible: false,
        descripcion: '',
      };

      service.getProduct('789').subscribe((product) => {
        expect(product.disponible).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/789`);
      req.flush(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const newProduct = {
        nombre: 'Nuevo Producto',
        sku: 'NEW001',
        categoria: 'Medicamento',
        proveedor_id: 'prov1',
        precio_unitario: 150.5,
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Producto nuevo',
      };

      const createdProduct: Product = {
        id: 'new-id-123',
        nombre: 'Nuevo Producto',
        sku: 'NEW001',
        categoria: 'Medicamento',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor 1',
        precio_unitario: '150.50',
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
        observaciones: 'Producto nuevo',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      };

      service.createProduct(newProduct as any).subscribe((product) => {
        expect(product.id).toBe('new-id-123');
        expect(product.nombre).toBe('Nuevo Producto');
        expect(product.sku).toBe('NEW001');
        expect(product.categoria).toBe('Medicamento');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });

    it('should create a product with numeric precio_unitario', () => {
      const newProduct = {
        nombre: 'Producto con Precio',
        categoria: 'Dispositivos',
        proveedor_id: 'prov2',
        precio_unitario: 99.99,
        unidad_medida: 'pieza',
        tipo_almacenamiento: 'seco',
      };

      const createdProduct: Product = {
        id: 'price-test-id',
        nombre: 'Producto con Precio',
        categoria: 'Dispositivos',
        proveedor_id: 'prov2',
        proveedor_nombre: 'Proveedor 2',
        precio_unitario: '99.99',
        unidad_medida: 'pieza',
        tipo_almacenamiento: 'seco',
        sku: 'AUTO-GEN-001',
        observaciones: '',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      };

      service.createProduct(newProduct as any).subscribe((product) => {
        expect(product.precio_unitario).toBe('99.99');
        expect(typeof product.precio_unitario).toBe('string');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      expect(req.request.body.precio_unitario).toBe(99.99);
      expect(typeof req.request.body.precio_unitario).toBe('number');
      req.flush(createdProduct);
    });

    it('should create a product without optional fields', () => {
      const newProduct = {
        nombre: 'Producto Mínimo',
        categoria: 'Consumibles',
        proveedor_id: 'prov3',
        precio_unitario: 10.0,
        unidad_medida: 'paquete',
        tipo_almacenamiento: 'ambiente',
      };

      const createdProduct: Product = {
        id: 'min-id',
        nombre: 'Producto Mínimo',
        categoria: 'Consumibles',
        proveedor_id: 'prov3',
        proveedor_nombre: 'Proveedor 3',
        precio_unitario: '10.00',
        unidad_medida: 'paquete',
        tipo_almacenamiento: 'ambiente',
        sku: 'AUTO-SKU-001',
        observaciones: '',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      };

      service.createProduct(newProduct as any).subscribe((product) => {
        expect(product.id).toBe('min-id');
        expect(product.sku).toBe('AUTO-SKU-001');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      expect(req.request.method).toBe('POST');
      req.flush(createdProduct);
    });

    it('should create a product with all fields including optional ones', () => {
      const newProduct = {
        nombre: 'Producto Completo',
        sku: 'COMP-001',
        categoria: 'Material quirúrgico',
        proveedor_id: 'prov1',
        precio_unitario: 500.25,
        unidad_medida: 'caja',
        tipo_almacenamiento: 'refrigerado',
        observaciones: 'Requiere refrigeración constante entre 2-8°C',
      };

      const createdProduct: Product = {
        id: 'comp-id-123',
        nombre: 'Producto Completo',
        sku: 'COMP-001',
        categoria: 'Material quirúrgico',
        proveedor_id: 'prov1',
        proveedor_nombre: 'Proveedor Quirúrgico',
        precio_unitario: '500.25',
        unidad_medida: 'caja',
        tipo_almacenamiento: 'refrigerado',
        observaciones: 'Requiere refrigeración constante entre 2-8°C',
        imagen_url: 'https://example.com/complete.jpg',
        disponible: true,
        descripcion: 'Material quirúrgico de alta calidad',
      };

      service.createProduct(newProduct as any).subscribe((product) => {
        expect(product.id).toBe('comp-id-123');
        expect(product.nombre).toBe('Producto Completo');
        expect(product.sku).toBe('COMP-001');
        expect(product.observaciones).toBe('Requiere refrigeración constante entre 2-8°C');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });

    it('should handle HTTP error when creating product', () => {
      const newProduct = {
        nombre: 'Producto Error',
        categoria: 'Medicamento',
        proveedor_id: 'prov-invalid',
        precio_unitario: 100.0,
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
      };

      const errorResponse = {
        detail: 'Proveedor no encontrado',
      };

      service.createProduct(newProduct as any).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.detail).toBe('Proveedor no encontrado');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle validation error when creating product', () => {
      const invalidProduct = {
        nombre: '',
        categoria: 'Medicamento',
        proveedor_id: 'prov1',
        precio_unitario: -10,
        unidad_medida: 'unidad',
        tipo_almacenamiento: 'ambiente',
      };

      const errorResponse = {
        detail: 'Datos de producto inválidos',
      };

      service.createProduct(invalidProduct as any).subscribe({
        next: () => fail('should have failed with validation error'),
        error: (error) => {
          expect(error.status).toBe(422);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/`);
      req.flush(errorResponse, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  describe('bulkUpload', () => {
    const createMockFile = (name: string, type: string): File => {
      return new File([''], name, { type });
    };

    it('should upload a file successfully', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 9,
        successful: 7,
        failed: 0,
        created: 7,
        updated: 0,
        skipped_duplicates: 2,
        duplicate_rows: [9, 10],
        created_products: [
          'b4e6830e-f9e9-462b-977f-2e32435db463',
          '8b8e0506-8028-4882-8e6b-78ab29b8acca',
        ],
      };

      service.bulkUpload(mockFile).subscribe((response) => {
        expect(response.total_rows).toBe(9);
        expect(response.successful).toBe(7);
        expect(response.created).toBe(7);
        expect(response.skipped_duplicates).toBe(2);
        expect(response.duplicate_rows).toEqual([9, 10]);
        expect(response.created_products?.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeInstanceOf(FormData);
      expect(req.request.body.get('file')).toBe(mockFile);
      req.flush(mockResponse);
    });

    it('should handle bulk upload with all products created', () => {
      const mockFile = createMockFile('productos.xls', 'application/vnd.ms-excel');
      const mockResponse: BulkUploadResponse = {
        total_rows: 5,
        successful: 5,
        failed: 0,
        created: 5,
        updated: 0,
        skipped_duplicates: 0,
        created_products: ['id1', 'id2', 'id3', 'id4', 'id5'],
      };

      service.bulkUpload(mockFile).subscribe((response) => {
        expect(response.total_rows).toBe(5);
        expect(response.successful).toBe(5);
        expect(response.failed).toBe(0);
        expect(response.created_products?.length).toBe(5);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle bulk upload with some products updated', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 10,
        successful: 10,
        failed: 0,
        created: 7,
        updated: 3,
        skipped_duplicates: 0,
        created_products: ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7'],
        updated_products: ['id8', 'id9', 'id10'],
      };

      service.bulkUpload(mockFile).subscribe((response) => {
        expect(response.created).toBe(7);
        expect(response.updated).toBe(3);
        expect(response.updated_products?.length).toBe(3);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      req.flush(mockResponse);
    });

    it('should handle bulk upload with duplicates', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 10,
        successful: 8,
        failed: 0,
        created: 8,
        updated: 0,
        skipped_duplicates: 2,
        duplicate_rows: [5, 8],
      };

      service.bulkUpload(mockFile).subscribe((response) => {
        expect(response.skipped_duplicates).toBe(2);
        expect(response.duplicate_rows).toEqual([5, 8]);
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      req.flush(mockResponse);
    });

    it('should handle bulk upload with failed rows', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 10,
        successful: 7,
        failed: 3,
        created: 7,
        updated: 0,
        skipped_duplicates: 0,
        errors: ['Error en fila 3', 'Error en fila 6', 'Error en fila 9'],
      };

      service.bulkUpload(mockFile).subscribe((response) => {
        expect(response.failed).toBe(3);
        expect(response.errors?.length).toBe(3);
        expect(response.errors).toContain('Error en fila 3');
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      req.flush(mockResponse);
    });

    it('should create FormData with correct file', () => {
      const mockFile = createMockFile(
        'test.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 1,
        successful: 1,
        failed: 0,
        created: 1,
        updated: 0,
        skipped_duplicates: 0,
      };

      service.bulkUpload(mockFile).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      const formData = req.request.body as FormData;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(mockFile);
      req.flush(mockResponse);
    });

    it('should handle HTTP 400 error with missing data', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const errorResponse = {
        detail: {
          message: 'Campos requeridos faltantes en algunas filas',
          missing_data: [
            { row: 2, missing_fields: ['nombre', 'categoria'] },
            { row: 4, missing_fields: ['nombre', 'categoria'] },
          ],
        },
      };

      service.bulkUpload(mockFile).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.detail.message).toBe('Campos requeridos faltantes en algunas filas');
          expect(error.error.detail.missing_data.length).toBe(2);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP 500 error', () => {
      const mockFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const errorMessage = 'Error del servidor';

      service.bulkUpload(mockFile).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should use correct endpoint URL', () => {
      const mockFile = createMockFile(
        'test.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const mockResponse: BulkUploadResponse = {
        total_rows: 1,
        successful: 1,
        failed: 0,
        created: 1,
        updated: 0,
        skipped_duplicates: 0,
      };

      service.bulkUpload(mockFile).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      expect(req.request.url).toBe(`${apiUrl}/productos/bulk-upload`);
      expect(req.request.url).toContain('/productos/bulk-upload');
      req.flush(mockResponse);
    });

    it('should handle different file types', () => {
      const xlsxFile = createMockFile(
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      const xlsFile = createMockFile('productos.xls', 'application/vnd.ms-excel');
      const mockResponse: BulkUploadResponse = {
        total_rows: 1,
        successful: 1,
        failed: 0,
        created: 1,
        updated: 0,
        skipped_duplicates: 0,
      };

      // Test .xlsx file
      service.bulkUpload(xlsxFile).subscribe();
      const req1 = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      expect(req1.request.body.get('file')).toBe(xlsxFile);
      req1.flush(mockResponse);

      // Test .xls file
      service.bulkUpload(xlsFile).subscribe();
      const req2 = httpMock.expectOne(`${apiUrl}/productos/bulk-upload`);
      expect(req2.request.body.get('file')).toBe(xlsFile);
      req2.flush(mockResponse);
    });
  });

  describe('API endpoint configuration', () => {
    it('should use correct base API URL from environment', () => {
      const mockResponse: ProductResponse = {
        productos: [],
        total: 0,
        page: 1,
        page_size: 10,
        total_pages: 0,
      };

      service.getProducts().subscribe();

      const req = httpMock.expectOne(`${environment.bffApiUrl}/productos/disponibles`);
      expect(req.request.url).toContain(environment.bffApiUrl);
      req.flush(mockResponse);
    });

    it('should construct correct URL for getProduct', () => {
      const mockProduct: Product = {
        id: 'test-id',
        nombre: 'Test',
        categoria: 'Test',
        sku: 'TEST',
        proveedor_id: 'test',
        proveedor_nombre: 'Test',
        precio_unitario: '0',
        unidad_medida: 'test',
        tipo_almacenamiento: 'test',
        observaciones: '',
        imagen_url: '',
        disponible: true,
        descripcion: '',
      };

      service.getProduct('test-id').subscribe();

      const req = httpMock.expectOne(`${environment.bffApiUrl}/productos/test-id`);
      expect(req.request.url).toBe(`${environment.bffApiUrl}/productos/test-id`);
      req.flush(mockProduct);
    });
  });
});
