import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { RouteService } from '../../../services/routes.service';
import { Route } from '../../../models/route.model';

@Component({
  selector: 'app-route-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css'],
})
export class RouteListComponent implements OnInit {
  private routeService = inject(RouteService);
  private router = inject(Router);

  routes: Route[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID de ruta' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'vehiculo_info', label: 'Vehículo' },
    { key: 'conductor_nombre', label: 'Conductor' },
    { key: 'paradas', label: 'Paradas', format: (value: any[]) => String(value?.length || 0) },
  ];

  ngOnInit() {
    this.loadRoutes();
  }

  private loadRoutes(): void {
    this.isLoading = true;
    this.error = null;

    this.routeService.getRoutes().subscribe({
      next: (routes) => {
        this.routes = routes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar rutas:', err);
        this.error = 'Error al cargar las rutas. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }

  onRouteClick(route: Route): void {
    this.router.navigate(['/routes', route.id]);
  }
}

