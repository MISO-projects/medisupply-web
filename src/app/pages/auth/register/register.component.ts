import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.minLength(2), Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    // Agregar validador personalizado al campo confirmPassword
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    confirmPasswordControl?.setValidators([
      Validators.required,
      this.confirmPasswordValidator.bind(this)
    ]);

    // Actualizar validación cuando cambie el password
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (!confirmPassword || !password) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { email, username, password } = this.registerForm.value;
    const usernameToSend = username?.trim() || email;

    this.authService.register({ email, username: usernameToSend, password }).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Registro exitoso' },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        const errorMessage =
          err.error?.detail || 'Error al registrarse. Por favor, intenta de nuevo.';
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: errorMessage },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.isLoading.set(false);
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }
}
