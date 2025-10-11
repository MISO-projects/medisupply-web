import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface TableColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();

  get displayedColumns(): string[] {
    return this.columns().map(col => col.key);
  }
}
