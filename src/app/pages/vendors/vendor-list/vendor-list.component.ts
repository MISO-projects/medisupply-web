import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Vendor } from '../../../models/vendor.model';

@Component({
  selector: 'app-vendor-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent {
  // Estado local usando signals
  vendedores = signal<Vendor[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Columnas que se mostrarán en la tabla
  displayedColumns = signal<string[]>([
    'nombre',
    'documento_identidad',
    'email',
    'zona_asignada',
    'plan_venta',
    'meta_venta',
    'acciones',
  ]);
}
