import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/products.service';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-create-bulk',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
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
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Productos cargados exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        const errorMessage =
          err.error?.detail || 'Error al cargar los productos. Por favor, intenta de nuevo.';
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 5000,
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
}