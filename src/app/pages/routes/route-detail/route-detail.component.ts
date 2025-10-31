import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { RouteService } from '../../../services/routes.service';
import { Route } from '../../../models/route.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-route-detail',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.css'],
})
export class RouteDetailComponent implements OnInit {
  private routeService = inject(RouteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  routeData: Route | null = null;
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.loadRoute(routeId);
    } else {
      this.error = 'ID de ruta no válido';
    }
  }

  private loadRoute(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.routeService.getRoute(id).subscribe({
      next: (route) => {
        this.routeData = route;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la ruta:', err);
        this.error = 'Error al cargar la ruta. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: this.error },
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/routes']);
  }

  getEstadoColor(estado?: string): string {
    switch (estado) {
      case 'Completada':
        return 'primary';
      case 'En Curso':
        return 'accent';
      case 'Cancelada':
        return 'warn';
      default:
        return '';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatDateTime(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get paradasCount(): number {
    return this.routeData?.paradas?.length ?? 0;
  }
}

