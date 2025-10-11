import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-vendor-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './vendor-create.component.html',
  styleUrl: './vendor-create.component.css',
})
export class VendorCreateComponent {
  private fb = inject(FormBuilder);
  private vendorService = inject(VendorService);
  private router = inject(Router);

  isLoading = false;
  error: string | null = null;

  // Opciones para los selects
  zonas = ['Perú', 'Colombia', 'Chile', 'Argentina', 'México'];
  planes = ['plan-123', 'plan-456', 'plan-789'];

  vendorForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    documento_identidad: [''],
    email: ['', [Validators.required, Validators.email]],
    zona_asignada: ['', [Validators.required]],
    plan_venta: ['', [Validators.required]],
    meta_venta: [''],
  });

  onSubmit(): void {
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.vendorService.createVendor(this.vendorForm.value).subscribe({
      next: () => {
        this.router.navigate(['/vendors']);
      },
      error: (err) => {
        console.error('Error al crear vendedor:', err);
        this.error = 'Error al crear el vendedor. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/vendors']);
  }
}
