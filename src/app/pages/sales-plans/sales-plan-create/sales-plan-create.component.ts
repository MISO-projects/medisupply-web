import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesPlanService } from '../../../services/sales-plan.service';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-sales-plan-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './sales-plan-create.component.html',
  styleUrl: './sales-plan-create.component.css',
})
export class SalesPlanCreateComponent {
  private fb = inject(FormBuilder);
  private salesPlanService = inject(SalesPlanService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  // Opciones para el select de zona
  zonas = ['Perú', 'Colombia', 'Ecuador', 'México'];

  salesPlanForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    descripcion: [''],
    meta_venta: [0, [Validators.required, Validators.min(0)]],
    zona_asignada: [''],
  });

  onSubmit(): void {
    if (this.salesPlanForm.invalid) {
      this.salesPlanForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Formatear las fechas al formato ISO esperado por el backend
    const formValue = this.salesPlanForm.value;
    const payload = {
      ...formValue,
      fecha_inicio: this.formatDateToISO(formValue.fecha_inicio),
      fecha_fin: this.formatDateToISO(formValue.fecha_fin, true),
    };

    this.salesPlanService.createSalesPlan(payload).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Plan de venta creado exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/sales-plans']);
      },
      error: (err) => {
        console.error('Error al crear plan de venta:', err);
        const errorMessage =
          err.error?.detail?.detail || 'Error al crear el plan de venta. Por favor, intenta de nuevo.';
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/sales-plans']);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/sales-plans']);
  }

  private formatDateToISO(date: Date, endOfDay = false): string {
    const d = new Date(date);
    if (endOfDay) {
      d.setHours(23, 59, 59, 0);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    return d.toISOString();
  }
}
