import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

export interface ListColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status';
  sortable?: boolean;
}

export interface ListAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  action: string;
}

export interface ListConfig {
  title: string;
  columns: ListColumn[];
  actions?: ListAction[];
  showItemActions?: boolean;
  showCreateButton?: boolean;
  createButtonLabel?: string;
  showUploadButton?: boolean;
  uploadButtonLabel?: string;
}

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule
  ],
  standalone: true
})
export class ListItemsComponent {
  @Input() config!: ListConfig;
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No hay datos disponibles';

  @Output() createClick = new EventEmitter<void>();
  @Output() uploadClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();
  @Output() sortClick = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();

  onCreateClick(): void {
    this.createClick.emit();
  }

  onUploadClick(): void {
    this.uploadClick.emit();
  }

  onActionClick(action: string, item: any): void {
    this.actionClick.emit({ action, item });
  }


  onSortChange(sort: Sort): void {
    this.sortClick.emit({ column: sort.active, direction: sort.direction as 'asc' | 'desc' });
  }

  getItemValue(item: any, key: string): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], item);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getDisplayedColumns(): string[] {
    const columns = this.config.columns.map(col => col.key);
    if (this.config.showItemActions && this.config.actions && this.config.actions.length > 0) {
      columns.push('actions');
    }
    return columns;
  }
}
