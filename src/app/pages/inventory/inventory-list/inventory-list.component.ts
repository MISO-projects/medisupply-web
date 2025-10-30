import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para @if
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  DataTableComponent,
  TableColumn,
} from '../../../components/data-table/data-table.component';
import { InventoryService } from '../../../services/inventory.service';
import { InventoryItem } from '../../../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    DataTableComponent,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css',
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  inventoryItems: any[] = [];
  isLoading = false;
  error: string | null = null;

  columns: TableColumn[] = [
    {
      key: 'producto_completo',
      label: 'Producto (SKU)',
    },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'ubicacion', label: 'Bodega' },
    { key: 'lote', label: 'Lote' },
    { key: 'fecha_vencimiento', label: 'Vencimiento' },
    { key: 'temperatura_requerida', label: 'Condición de almacenamiento' },
  ];

  ngOnInit() {
    this.loadInventory();
  }

  private loadInventory(): void {
    this.isLoading = true;
    this.error = null;

    this.inventoryService.getInventory().subscribe({
      next: (items) => {
        this.inventoryItems = items.map(item => {
          return {
            ...item,
            producto_completo: `${item.producto_nombre} (${item.producto_sku})`
          };
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.error = 'Error al cargar el inventario. Por favor, intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
