import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from '../../../services/suppliers.service';
import { Supplier } from '../../../models/supplier.model';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-product-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  categories = [
    'Medicamento',
    'Insumos médicos',
    'Equipamiento',
    'Dispositivos',
    'Consumibles',
    'Material quirúrgico',
    'Reactivos',
    'Otros',
  ];
  suppliers: Supplier[] = [];
  productForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    sku: [''],
    categoria: ['', [Validators.required]],
    proveedor_id: ['', [Validators.required]],
    precio_unitario: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    unidad_medida: ['', [Validators.required]],
    tipo_almacenamiento: ['', [Validators.required]],
    observaciones: [''],
  });

  ngOnInit(): void {
    this.supplierService.listSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.productService
      .createProduct({
        ...this.productForm.value,
        precio_unitario: parseFloat(this.productForm.value.precio_unitario),
      })
      .subscribe({
        next: () => {
          this.productForm.value;
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: { message: 'Producto creado exitosamente' },
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          const errorMessage =
            err.error?.detail || 'Error al crear el producto. Por favor, intenta de nuevo.';
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
}
