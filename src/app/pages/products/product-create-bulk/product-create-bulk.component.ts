import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/products.service';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';
import { CommonModule } from '@angular/common';
import { BulkUploadResponse } from '../../../models/product.model';

interface MissingData {
  row: number;
  missing_fields: string[];
}

interface BulkUploadError {
  detail: {
    message: string;
    missing_data?: MissingData[];
  };
}

@Component({
  selector: 'app-product-create-bulk',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './product-create-bulk.component.html',
  styleUrls: ['./product-create-bulk.component.css'],
})
export class ProductCreateBulkComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  selectedFile: File | null = null;
  isDragging = false;
  isLoading = false;

  ngOnInit() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isExcelFile(file)) {
        this.selectedFile = file;
      } else {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Por favor, selecciona un archivo Excel (.xlsx, .xls)' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        // Reset the input
        input.value = '';
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (this.isExcelFile(file)) {
        this.selectedFile = file;
      } else {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Por favor, selecciona un archivo Excel (.xlsx, .xls)' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: { message: 'Por favor, selecciona un archivo para cargar' },
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
      return;
    }

    this.isLoading = true;

    this.productService.bulkUpload(this.selectedFile).subscribe({
      next: (response: BulkUploadResponse) => {
        const message = this.formatSuccessMessage(response);
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message },
          duration: 8000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        const errorMessage = this.formatErrorMessage(err);
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  private isExcelFile(file: File): boolean {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some((ext) => fileName.endsWith(ext));
  }

  private formatSuccessMessage(response: BulkUploadResponse): string {
    const parts: string[] = [];
    
    parts.push(`Total: ${response.total_rows} filas`);
    parts.push(`Exitosas: ${response.successful}`);
    
    if (response.created > 0) {
      parts.push(`Creados: ${response.created}`);
    }
    
    if (response.updated > 0) {
      parts.push(`Actualizados: ${response.updated}`);
    }
    
    if (response.skipped_duplicates > 0) {
      parts.push(`Duplicados omitidos: ${response.skipped_duplicates}`);
    }
    
    if (response.failed > 0) {
      parts.push(`Fallidas: ${response.failed}`);
    }
    
    return `Carga completada.\n\n${parts.join('\n')}`;
  }

  private formatErrorMessage(err: unknown): string {
    const error = err as { error?: BulkUploadError };
    
    if (!error.error?.detail) {
      return 'Error al cargar los productos. Por favor, intenta de nuevo.';
    }

    const detail = error.error.detail;
    const parts: string[] = [detail.message || 'Error en la carga de productos'];

    if (detail.missing_data && detail.missing_data.length > 0) {
      parts.push('\nCampos faltantes por fila:');
      detail.missing_data.forEach((item) => {
        const fields = item.missing_fields.join(', ');
        parts.push(`• Fila ${item.row}: ${fields}`);
      });
    }

    return parts.join('\n');
  }
}