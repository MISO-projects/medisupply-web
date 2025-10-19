import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from '../../../services/suppliers.service';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-supplier-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './supplier-create.component.html',
  styleUrl: './supplier-create.component.css',
})
export class SupplierCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  // Opciones para los selects
  paises = ['Perú', 'Colombia', 'Ecuador', 'México'];
  tipos_proveedores = ['Fabricante', 'Distribuidor', 'Mayorista', 'Importador', 'Minorista'];

  // Validador personalizado para ID Tributario según el país
  idTributarioValidator = (control: AbstractControl): ValidationErrors | null => {
    const idTributario = control.value;
    const pais = this.supplierForm?.get('pais')?.value;

    if (!idTributario || !pais) {
      return null;
    }

    const idTrib = idTributario.trim();

    switch (pais) {
      case 'Perú':
        if (!/^\d{11}$/.test(idTrib)) {
          return { idTributarioInvalid: 'RUC debe tener 11 dígitos numéricos' };
        }
        break;

      case 'Colombia':
        if (!/^\d{9,10}$/.test(idTrib)) {
          return { idTributarioInvalid: 'NIT debe tener 9 o 10 dígitos numéricos' };
        }
        break;

      case 'México':
        if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(idTrib.toUpperCase())) {
          return {
            idTributarioInvalid: 'RFC debe tener formato válido (12-13 caracteres alfanuméricos)',
          };
        }
        break;

      case 'Ecuador':
        if (!/^\d{13}$/.test(idTrib)) {
          return { idTributarioInvalid: 'RUC debe tener 13 dígitos numéricos' };
        }
        break;
    }

    return null;
  };

  supplierForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    id_tributario: ['', [this.idTributarioValidator]],
    tipo_proveedor: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    contacto: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    condiciones_entrega: [''],
  });

  ngOnInit(): void {
    this.supplierForm.get('pais')?.valueChanges.subscribe(() => {
      this.supplierForm.get('id_tributario')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Normalizar el RFC a mayúsculas si es de México
    const formValue = { ...this.supplierForm.value };
    if (formValue.pais === 'México' && formValue.id_tributario) {
      formValue.id_tributario = formValue.id_tributario.toUpperCase();
    }

    this.supplierService.createSupplier(formValue).subscribe({
      next: () => {
        this.supplierForm.value;
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Proveedor creado exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        console.error('Error al crear proveedor:', err);
        const errorMessage =
          err.error?.detail?.detail || 'Error al crear el proveedor. Por favor, intenta de nuevo.';
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/suppliers']);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }
}
