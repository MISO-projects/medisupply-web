import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Vendor } from '../../../models/vendor.model';
import { VendorService } from '../../../services/vendor.service';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';

@Component({
  selector: 'app-vendor-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent implements OnInit {
  private vendorService = inject(VendorService);

  // Estado simple
  vendedores: Vendor[] = [];
  isLoading = false;
  error: string | null = null;

  // Definición de columnas para la tabla reutilizable
  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'documento_identidad', label: 'Documento de identidad' },
    { key: 'email', label: 'Correo corporativo' },
    { key: 'zona_asignada', label: 'Zona asignada' },
    {
      key: 'plan_venta_id',
      label: 'Plan de venta',
      format: (value, row) => (row as Vendor).plan_venta?.nombre || value,
    },
  ];

  ngOnInit(): void {
    this.loadVendors();
  }

  private loadVendors(): void {
    this.isLoading = true;
    this.error = null;

    this.vendorService.getVendors().subscribe({
      next: (vendors) => {
        this.vendedores = vendors;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar vendedores:', err);
        this.error = 'Error al cargar los vendedores. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
