import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConductorService } from '../../../services/conductores.service';
import { Conductor } from '../../../models/conductor.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-conductor-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './conductor-create.component.html',
  styleUrls: ['./conductor-create.component.css'],
})
export class ConductorCreateComponent {
  private fb = inject(FormBuilder);
  private conductorService = inject(ConductorService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  conductorForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    documento: ['', [Validators.required, Validators.maxLength(20)]],
    telefono: ['', [Validators.maxLength(20)]],
    email: ['', [Validators.email, Validators.maxLength(255)]],
    licencia_conducir: ['', [Validators.required, Validators.maxLength(50)]],
    activo: [true],
  });

  onSubmit(): void {
    if (this.conductorForm.invalid) {
      this.conductorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.conductorService.createConductor(this.conductorForm.value).subscribe({
      next: (conductor: Conductor) => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Conductor creado exitosamente' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/conductores']);
      },
      error: (err: any) => {
        console.error('Error al crear conductor:', err);
        const errorMessage =
          err.error?.detail || 'Error al crear el conductor. Por favor, intenta de nuevo.';
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
    this.router.navigate(['/conductores']);
  }
}
