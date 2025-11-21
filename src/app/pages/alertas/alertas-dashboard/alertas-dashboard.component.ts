import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { AlertasService } from '../../../services/alertas.service';
import { Alerta, EstadisticasResumen } from '../../../models/alerta.model';

@Component({
  selector: 'app-alertas-dashboard',
  imports: [CommonModule, MatButtonModule, DataTableComponent],
  templateUrl: './alertas-dashboard.component.html',
  styleUrls: ['./alertas-dashboard.component.css'],
})
export class AlertasDashboardComponent implements OnInit {
  private alertasService = inject(AlertasService);
  private router = inject(Router);

  stats = signal<EstadisticasResumen | null>(null);
  recientes = signal<Alerta[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  readonly columns: TableColumn[] = [
    { key: 'severidad', label: 'Severidad' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'mensaje', label: 'Mensaje' },
    { key: 'estado', label: 'Estado' },
    {
      key: 'created_at',
      label: 'Creado',
      format: (value: string) => this.formatUtc5Es(value),
    },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.alertasService.getEstadisticas().subscribe({
      next: (stats) => {
        // Normalizar con valores por defecto por si faltan claves sin repetir propiedades
        const porSeveridad = {
          ...(stats?.por_severidad ?? {}),
        } as EstadisticasResumen['por_severidad'];
        porSeveridad.BAJA = porSeveridad.BAJA ?? 0;
        porSeveridad.MEDIA = porSeveridad.MEDIA ?? 0;
        porSeveridad.ALTA = porSeveridad.ALTA ?? 0;
        porSeveridad.CRITICA = porSeveridad.CRITICA ?? 0;

        const porEstado = { ...(stats?.por_estado ?? {}) } as EstadisticasResumen['por_estado'];
        porEstado.PENDIENTE = porEstado.PENDIENTE ?? 0;
        porEstado.REVISADO = porEstado.REVISADO ?? 0;
        porEstado.RESUELTO = porEstado.RESUELTO ?? 0;
        porEstado.FALSA_ALARMA = porEstado.FALSA_ALARMA ?? 0;

        const normalized: EstadisticasResumen = {
          total_alertas: stats?.total_alertas ?? 0,
          por_severidad: porSeveridad,
          por_estado: porEstado,
          por_tipo: stats?.por_tipo ?? {},
          alertas_ultimas_24h: stats?.alertas_ultimas_24h ?? 0,
          alertas_pendientes: stats?.alertas_pendientes ?? 0,
        };
        this.stats.set(normalized);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar estadísticas');
      },
    });

    this.alertasService.getAlertas({ page: 1, page_size: 10 }).subscribe({
      next: (res) => {
        this.recientes.set(res.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar alertas recientes');
        this.isLoading.set(false);
      },
    });
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

  onRowClick(row: Alerta): void {
    this.router.navigate(['/alerts', row.id]);
  }
}
