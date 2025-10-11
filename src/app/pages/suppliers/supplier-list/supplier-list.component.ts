import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SupplierService } from '../../../services/suppliers.service';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css',
})
export class SupplierListComponent implements OnInit {
  private supplierService = inject(SupplierService);

  // Estado simple
  suppliers: Supplier[] = [];
  isLoading = false;
  error: string | null = null;

  // Definición de columnas para la tabla reutilizable
  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo_proveedor', label: 'Tipo de proveedor' },
    { key: 'id_tributario', label: 'ID tributario' },
    { key: 'pais', label: 'País' },
    { key: 'contacto', label: 'Contacto' },
  ];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.isLoading = true;
    this.error = null;

    this.supplierService.listSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.error = 'Error al cargar los proveedores. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
