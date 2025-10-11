import { Component, input, viewChild, effect, Injectable } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

export interface TableColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

@Injectable()
class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página:';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
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
