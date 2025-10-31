import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { ConductorService } from '../../../services/conductores.service';
import { Conductor } from '../../../models/conductor.model';

@Component({
  selector: 'app-conductor-list',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './conductor-list.component.html',
  styleUrls: ['./conductor-list.component.css'],
})
export class ConductorListComponent implements OnInit {
  private conductorService = inject(ConductorService);

  conductores: Conductor[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'documento', label: 'Documento' },
    { key: 'licencia_conducir', label: 'Licencia' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'activo', label: 'Estado', format: (value: boolean) => (value ? 'Activo' : 'Inactivo') },
  ];

  ngOnInit() {
    this.loadConductores();
  }

  private loadConductores(): void {
    this.isLoading = true;
    this.error = null;

    this.conductorService.getConductores().subscribe({
      next: (conductores: Conductor[]) => {
        this.conductores = conductores;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar conductores:', err);
        this.error = 'Error al cargar los conductores. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
