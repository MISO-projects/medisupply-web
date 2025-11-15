import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import { SalesReportService } from '../../services/sales-report.service';
import {
  SalesReportVendor,
  SalesReportFilters,
} from '../../models/sales-report.model';

@Component({
  selector: 'app-sales-report',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DataTableComponent,
  ],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css',
})
export class SalesReportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private salesReportService = inject(SalesReportService);

  vendedores: SalesReportVendor[] = [];
  isLoading = false;
  error: string | null = null;

  zonas = ['Perú', 'Colombia', 'Ecuador', 'México'];

  filterForm: FormGroup = this.fb.group({
    fecha_inicio: [null],
    fecha_fin: [null],
    zona: [''],
  });

  columns: TableColumn[] = [
    { key: 'vendedor_nombre', label: 'Vendedor' },
    { key: 'zona_asignada', label: 'Zona' },
    { key: 'numero_pedidos', label: 'Pedidos (#)' },
    {
      key: 'porcentaje_meta',
      label: '% meta',
      format: (value) => `${value.toFixed(2)}%`,
    },
    {
      key: 'ultima_actividad',
      label: 'Última actividad',
      format: (value) => value ? new Date(value).toLocaleDateString('es-ES') : '-',
    },
  ];

  ngOnInit(): void {
    this.loadReport();
  }

  onSearch(): void {
    this.loadReport();
  }

  private loadReport(): void {
    this.isLoading = true;
    this.error = null;

    const filters: SalesReportFilters = {};

    const fechaInicio = this.filterForm.value.fecha_inicio;
    const fechaFin = this.filterForm.value.fecha_fin;
    const zona = this.filterForm.value.zona;

    if (fechaInicio) {
      filters.fecha_inicio = new Date(fechaInicio).toISOString();
    }
    if (fechaFin) {
      filters.fecha_fin = new Date(fechaFin).toISOString();
    }
    if (zona) {
      filters.zona = zona;
    }

    this.salesReportService.getSalesReport(filters).subscribe({
      next: (response) => {
        this.vendedores = response.vendedores;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reporte:', err);
        this.error = 'Error al cargar el reporte. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
