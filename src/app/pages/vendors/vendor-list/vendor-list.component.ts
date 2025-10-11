import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Vendor } from '../../../models/vendor.model';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-vendor-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent implements OnInit {
  private vendorService = inject(VendorService);

  // Estado simple
  vendedores: Vendor[] = [];
  isLoading = false;
  error: string | null = null;

  // Columnas que se mostrarán en la tabla
  displayedColumns = [
    'nombre',
    'documento_identidad',
    'email',
    'zona_asignada',
    'plan_venta',
    'meta_venta',
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
