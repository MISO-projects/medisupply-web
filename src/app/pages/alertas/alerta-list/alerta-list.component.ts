import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DataTableComponent, TableColumn } from '../../../components/data-table/data-table.component';
import { AlertasService } from '../../../services/alertas.service';
import { Alerta, AlertaFilters, EstadoAlerta, Severidad } from '../../../models/alerta.model';

@Component({
  selector: 'app-alerta-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    DataTableComponent,
  ],
  templateUrl: './alerta-list.component.html',
  styleUrls: ['./alerta-list.component.css'],
})
export class AlertaListComponent implements OnInit {
  private router = inject(Router);
  private alertasService = inject(AlertasService);

  alertas = signal<Alerta[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  filters = signal<AlertaFilters>({
    page: 1,
    page_size: 100,
    severidad: '',
    estado: '',
    tipo: '',
  });

  readonly severidadOpts: (Severidad | 'TODAS')[] = ['TODAS', 'BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
  readonly estadoOpts: (EstadoAlerta | 'TODOS')[] = [
    'TODOS',
    'PENDIENTE',
    'REVISADO',
    'RESUELTO',
    'FALSA_ALARMA',
  ];

  readonly columns: TableColumn[] = [
    { key: 'severidad', label: 'Severidad' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'mensaje', label: 'Mensaje' },
    {
      key: 'created_at',
      label: 'Creado',
      format: (value: string) => this.formatUtc5Es(value),
    },
    { key: 'estado', label: 'Estado' },
  ];

  ngOnInit(): void {
    this.loadAlertas();
  }

  loadAlertas(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const f = this.filters();
    const apiFilters: AlertaFilters = {
      page: 1,
      page_size: f.page_size,
      severidad: f.severidad ? f.severidad : undefined,
      estado: f.estado ? f.estado : undefined,
      tipo: f.tipo || undefined,
    };

    this.alertasService.getAlertas(apiFilters).subscribe({
      next: (res) => {
        this.alertas.set(res.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar alertas');
        this.isLoading.set(false);
      },
    });
  }

  verDetalle(row: Alerta): void {
    this.router.navigate(['/alerts', row.id]);
  }

  private formatUtc5Es(value: string): string {
    if (!value) return '';
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat('es-ES', {
        timeZone: 'America/Bogota', // UTC-5
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
      }).format(date);
    } catch {
      return value;
    }
  }
}


