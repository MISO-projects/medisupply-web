import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VehiculoService } from '../../../services/vehiculos.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-vehiculo-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './vehiculo-create.component.html',
  styleUrls: ['./vehiculo-create.component.css'],
})
export class VehiculoCreateComponent {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  vehiculoForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.maxLength(20)]],
    marca: ['', [Validators.required, Validators.maxLength(100)]],
    modelo: ['', [Validators.required, Validators.maxLength(100)]],
    año: ['', [Validators.min(1900), Validators.max(2100)]],
    tipo: ['', [Validators.required, Validators.maxLength(50)]],
    capacidad_kg: ['', [Validators.min(0)]],
    activo: [true],
  });

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = {
      ...this.vehiculoForm.value,
      año: this.vehiculoForm.value.año ? parseInt(this.vehiculoForm.value.año) : undefined,
      capacidad_kg: this.vehiculoForm.value.capacidad_kg ? parseFloat(this.vehiculoForm.value.capacidad_kg) : undefined,
    };

    this.vehiculoService.createVehiculo(formData).subscribe({
      next: (vehiculo: Vehiculo) => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Vehículo creado exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/vehiculos']);
      },
      error: (err: any) => {
        console.error('Error al crear vehículo:', err);
        const errorMessage =
          err.error?.detail || 'Error al crear el vehículo. Por favor, intenta de nuevo.';
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
    this.router.navigate(['/vehiculos']);
  }
}




