import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { VehiculoService } from '../../../services/vehiculos.service';
import { Vehiculo } from '../../../models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './vehiculo-list.component.html',
  styleUrls: ['./vehiculo-list.component.css'],
})
export class VehiculoListComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);

  vehiculos: Vehiculo[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'capacidad_kg', label: 'Capacidad (kg)' },
    { key: 'activo', label: 'Estado', format: (value: boolean) => (value ? 'Activo' : 'Inactivo') },
  ];

  ngOnInit() {
    this.loadVehiculos();
  }

  private loadVehiculos(): void {
    this.isLoading = true;
    this.error = null;

    this.vehiculoService.getVehiculos().subscribe({
      next: (vehiculos: Vehiculo[]) => {
        this.vehiculos = vehiculos;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar vehículos:', err);
        this.error = 'Error al cargar los vehículos. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
