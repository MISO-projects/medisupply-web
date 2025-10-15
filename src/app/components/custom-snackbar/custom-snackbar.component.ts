import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="snackbar-content">
      <span>{{ data.message }}</span>
      <button mat-icon-button (click)="dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: `
    .snackbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    button {
      margin-left: auto;
      color: white;
    }

    mat-icon {
      color: white;
    }
  `,
})
export class CustomSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
