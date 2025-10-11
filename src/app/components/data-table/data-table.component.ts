import { Component, input, viewChild, effect } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

export interface TableColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();

  dataSource = new MatTableDataSource<any>([]);
  paginator = viewChild.required(MatPaginator);

  constructor() {
    // Actualizar dataSource cuando cambie data
    effect(() => {
      this.dataSource.data = this.data();
    });

    // Conectar paginator cuando esté disponible
    effect(() => {
      const paginatorInstance = this.paginator();
      if (paginatorInstance) {
        this.dataSource.paginator = paginatorInstance;
      }
    });
  }

  get displayedColumns(): string[] {
    return this.columns().map(col => col.key);
  }
}
