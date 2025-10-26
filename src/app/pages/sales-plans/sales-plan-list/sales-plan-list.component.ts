import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, TableColumn } from '../../../components/data-table/data-table.component';
import { SalesPlanService } from '../../../services/sales-plan.service';
import { SalesPlan } from '../../../models/sales-plan.model';

@Component({
  selector: 'app-sales-plan-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './sales-plan-list.component.html',
  styleUrl: './sales-plan-list.component.css',
})
export class SalesPlanListComponent implements OnInit {
  private salesPlanService = inject(SalesPlanService);

  salesPlans: SalesPlan[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'fecha_inicio',
      label: 'Fecha inicio',
      format: (value) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'fecha_fin',
      label: 'Fecha fin',
      format: (value) => new Date(value).toLocaleDateString('es-ES'),
    },
    { key: 'zona_asignada', label: 'Zona asignada' },
    {
      key: 'meta_venta',
      label: 'Meta de ventas',
      format: (value) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value),
    },
  ];

  ngOnInit(): void {
    this.loadSalesPlans();
  }

  private loadSalesPlans(): void {
    this.isLoading = true;
    this.error = null;

    this.salesPlanService.listSalesPlans().subscribe({
      next: (salesPlans) => {
        this.salesPlans = salesPlans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar planes de venta:', err);
        this.error = 'Error al cargar los planes de venta. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
