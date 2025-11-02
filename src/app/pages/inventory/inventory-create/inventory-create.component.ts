// src/app/pages/inventory/inventory-create/inventory-create.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';

// Imports de Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Servicios y Modelos
import { InventoryService } from '../../../services/inventory.service';
import { ProductService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';
import { InventoryCreatePayload } from '../../../models/inventory.model';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DatePipe],
  templateUrl: './inventory-create.component.html',
  styleUrl: './inventory-create.component.css',
})
export class InventoryCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);

  isLoading = false;
  products$: Observable<Product[]> | undefined;
  protected readonly minDate: Date = new Date();

  bodegas = ['Bodega Principal', 'Bodega Refrigerada', 'Bodega Cuarentena'];
  condiciones = ['AMBIENTE', 'REFRIGERADO', 'CONGELADO'];
  estados = ['DISPONIBLE', 'BLOQUEADO', 'EN REVISION'];

  inventoryForm: FormGroup = this.fb.group({
    producto_id: ['', [Validators.required]],
    cantidad: [null, [Validators.required, Validators.min(1)]],

    bodega: ['Bodega Principal', [Validators.required]],
    ubicacion_interna: [''],
    condiciones_almacenamiento: ['AMBIENTE', [Validators.required]],

    lote: ['', [Validators.required]],
    fecha_vencimiento: ['', [Validators.required]],

    estado: ['DISPONIBLE', [Validators.required]],
    observaciones: [''],
    condiciones_especiales: [''],
  });

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  onSubmit(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.inventoryForm.value;

    const ubicacionFinal = formValue.ubicacion_interna
      ? `${formValue.bodega} - ${formValue.ubicacion_interna}`
      : formValue.bodega;

    const fechaVencimientoISO = this.datePipe.transform(formValue.fecha_vencimiento, 'yyyy-MM-dd');

    const payload: InventoryCreatePayload = {
      producto_id: formValue.producto_id,
      lote: formValue.lote,
      fecha_vencimiento: fechaVencimientoISO!,
      cantidad: Number(formValue.cantidad),
      ubicacion: ubicacionFinal,
      temperatura_requerida: formValue.condiciones_almacenamiento,
      estado: formValue.estado,
      observaciones: formValue.observaciones,
      condiciones_especiales: formValue.condiciones_especiales,
    };

    this.inventoryService.createInventoryRecord(payload).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Ingreso registrado exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Error al registrar ingreso:', err);
        const errorMessage =
          err.error?.detail || 'Error al registrar el ingreso. Por favor, intenta de nuevo.';
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
    this.router.navigate(['/inventory']);
  }
}
