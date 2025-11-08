import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ProductCreateBulkComponent } from './product-create-bulk.component';
import { ProductService } from '../../../services/products.service';
import { BulkUploadResponse } from '../../../models/product.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductCreateBulkComponent', () => {
  let component: ProductCreateBulkComponent;
  let fixture: ComponentFixture<ProductCreateBulkComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const createMockFile = (name: string, type: string): File => {
    const file = new File([''], name, { type });
    return file;
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['bulkUpload']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ProductCreateBulkComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with no selected file', () => {
      expect(component.selectedFile).toBeNull();
    });

    it('should initialize with isDragging as false', () => {
      expect(component.isDragging).toBe(false);
    });

    it('should initialize with isLoading as false', () => {
      expect(component.isLoading).toBe(false);
    });
  });

  describe('File Selection', () => {
    it('should accept valid Excel file (.xlsx)', () => {
      const file = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const event = {
        target: {
          files: [file],
          value: 'test.xlsx',
        },
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toEqual(file);
    });

    it('should accept valid Excel file (.xls)', () => {
      const file = createMockFile('test.xls', 'application/vnd.ms-excel');
      const event = {
        target: {
          files: [file],
          value: 'test.xls',
        },
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toEqual(file);
    });

    it('should reject non-Excel files', () => {
      const file = createMockFile('test.pdf', 'application/pdf');
      const event = {
        target: {
          files: [file],
          value: 'test.pdf',
        },
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Por favor, selecciona un archivo Excel (.xlsx, .xls)' },
        }),
      );
    });

    it('should reset input value when invalid file is selected', () => {
      const file = createMockFile('test.txt', 'text/plain');
      const input = {
        files: [file],
        value: 'test.txt',
      } as unknown as HTMLInputElement;

      const event = {
        target: input,
      } as unknown as Event;

      component.onFileSelected(event);

      expect(input.value).toBe('');
    });

    it('should handle event with no files', () => {
      const event = {
        target: {
          files: null,
        },
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
    });
  });

  describe('Drag and Drop', () => {
    it('should set isDragging to true on drag over', () => {
      const event = new DragEvent('dragover', { bubbles: true });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onDragOver(event);

      expect(component.isDragging).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should set isDragging to false on drag leave', () => {
      component.isDragging = true;
      const event = new DragEvent('dragleave', { bubbles: true });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onDragLeave(event);

      expect(component.isDragging).toBe(false);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should accept valid Excel file on drop', () => {
      const file = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const dataTransfer = {
        files: [file],
      } as unknown as DataTransfer;

      const event = new DragEvent('drop', { bubbles: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: dataTransfer,
        writable: false,
      });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onDrop(event);

      expect(component.selectedFile).toEqual(file);
      expect(component.isDragging).toBe(false);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should reject non-Excel file on drop', () => {
      const file = createMockFile('test.pdf', 'application/pdf');
      const dataTransfer = {
        files: [file],
      } as unknown as DataTransfer;

      const event = new DragEvent('drop', { bubbles: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: dataTransfer,
        writable: false,
      });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onDrop(event);

      expect(component.selectedFile).toBeNull();
      expect(component.isDragging).toBe(false);
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Por favor, selecciona un archivo Excel (.xlsx, .xls)' },
        }),
      );
    });

    it('should handle drop event with no files', () => {
      const dataTransfer = {
        files: null,
      } as unknown as DataTransfer;

      const event = new DragEvent('drop', { bubbles: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: dataTransfer,
        writable: false,
      });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onDrop(event);

      expect(component.selectedFile).toBeNull();
    });
  });

  describe('File Upload', () => {
    let mockFile: File;

    beforeEach(() => {
      mockFile = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      component.selectedFile = mockFile;
    });

    it('should not upload if no file is selected', () => {
      component.selectedFile = null;

      component.onUpload();

      expect(productService.bulkUpload).not.toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message: 'Por favor, selecciona un archivo para cargar' },
        }),
      );
    });

    it('should set isLoading to true when upload starts', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 9,
        successful: 7,
        failed: 0,
        created: 7,
        updated: 0,
        skipped_duplicates: 2,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      expect(component.isLoading).toBe(true);
    });

    it('should call productService.bulkUpload with selected file', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 9,
        successful: 7,
        failed: 0,
        created: 7,
        updated: 0,
        skipped_duplicates: 2,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      expect(productService.bulkUpload).toHaveBeenCalledWith(mockFile);
    });

    it('should show success message and navigate on successful upload', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 9,
        successful: 7,
        failed: 0,
        created: 7,
        updated: 0,
        skipped_duplicates: 2,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          duration: 8000,
        }),
      );
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should format success message correctly', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 9,
        successful: 7,
        failed: 0,
        created: 7,
        updated: 0,
        skipped_duplicates: 2,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toContain('Carga completada');
      expect(message).toContain('Total: 9 filas');
      expect(message).toContain('Exitosas: 7');
      expect(message).toContain('Creados: 7');
      expect(message).toContain('Duplicados omitidos: 2');
    });

    it('should include updated count in success message when updated > 0', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 5,
        successful: 5,
        failed: 0,
        created: 3,
        updated: 2,
        skipped_duplicates: 0,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toContain('Actualizados: 2');
    });

    it('should include failed count in success message when failed > 0', () => {
      const mockResponse: BulkUploadResponse = {
        total_rows: 10,
        successful: 8,
        failed: 2,
        created: 8,
        updated: 0,
        skipped_duplicates: 0,
      };
      productService.bulkUpload.and.returnValue(of(mockResponse));

      component.onUpload();

      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toContain('Fallidas: 2');
    });

    it('should handle upload error with missing data', () => {
      const errorResponse = {
        error: {
          detail: {
            message: 'Campos requeridos faltantes en algunas filas',
            missing_data: [
              { row: 2, missing_fields: ['nombre', 'categoria'] },
              { row: 4, missing_fields: ['nombre', 'categoria'] },
            ],
          },
        },
      };
      productService.bulkUpload.and.returnValue(throwError(() => errorResponse));

      component.onUpload();

      expect(component.isLoading).toBe(false);
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          duration: 10000,
        }),
      );

      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toContain('Campos requeridos faltantes en algunas filas');
      expect(message).toContain('Campos faltantes por fila:');
      expect(message).toContain('Fila 2: nombre, categoria');
      expect(message).toContain('Fila 4: nombre, categoria');
    });

    it('should handle upload error without detail', () => {
      const errorResponse = {};
      productService.bulkUpload.and.returnValue(throwError(() => errorResponse));

      component.onUpload();

      expect(component.isLoading).toBe(false);
      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toBe('Error al cargar los productos. Por favor, intenta de nuevo.');
    });

    it('should handle upload error with detail but no missing_data', () => {
      const errorResponse = {
        error: {
          detail: {
            message: 'Error general en la carga',
          },
        },
      };
      productService.bulkUpload.and.returnValue(throwError(() => errorResponse));

      component.onUpload();

      const snackBarCall = snackBar.openFromComponent.calls.mostRecent();
      const config = snackBarCall.args[1] as { data: { message: string } };
      const message = config.data.message;
      expect(message).toBe('Error general en la carga');
    });
  });

  describe('File Removal', () => {
    it('should remove selected file', () => {
      const file = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      component.selectedFile = file;

      component.removeFile();

      expect(component.selectedFile).toBeNull();
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to /products on cancel', () => {
      component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('File Input Trigger', () => {
    it('should trigger file input click', () => {
      // Ensure component has no selected file so the input is rendered
      component.selectedFile = null;
      fixture.detectChanges();

      const fileInput = fixture.nativeElement.querySelector('#file-input') as HTMLInputElement;
      expect(fileInput).toBeTruthy();
      spyOn(fileInput, 'click');

      component.triggerFileInput();

      expect(fileInput.click).toHaveBeenCalled();
    });

    it('should handle missing file input gracefully', () => {
      // Remove the file input from DOM to test graceful handling
      const fileInput = fixture.nativeElement.querySelector('#file-input');
      if (fileInput) {
        fileInput.remove();
      }

      expect(() => component.triggerFileInput()).not.toThrow();
    });
  });

  describe('Excel File Validation', () => {
    it('should validate .xlsx extension', () => {
      const file = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const isValid = (component as any).isExcelFile(file);
      expect(isValid).toBe(true);
    });

    it('should validate .xls extension', () => {
      const file = createMockFile('test.xls', 'application/vnd.ms-excel');
      const isValid = (component as any).isExcelFile(file);
      expect(isValid).toBe(true);
    });

    it('should reject .pdf extension', () => {
      const file = createMockFile('test.pdf', 'application/pdf');
      const isValid = (component as any).isExcelFile(file);
      expect(isValid).toBe(false);
    });

    it('should reject .txt extension', () => {
      const file = createMockFile('test.txt', 'text/plain');
      const isValid = (component as any).isExcelFile(file);
      expect(isValid).toBe(false);
    });

    it('should be case insensitive for file extensions', () => {
      const file1 = createMockFile('test.XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const file2 = createMockFile('test.XLS', 'application/vnd.ms-excel');
      expect((component as any).isExcelFile(file1)).toBe(true);
      expect((component as any).isExcelFile(file2)).toBe(true);
    });
  });
});

