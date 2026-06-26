import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AdminTableColumn<T> {
  key: keyof T | string;
  label: string;
  formatter?: (item: T) => string;
}

@Component({
  selector: 'app-admin-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-data-table.html',
})
export class AdminDataTableComponent<T> {
  @Input() items: T[] = [];
  @Input() columns: AdminTableColumn<T>[] = [];
  @Input() emptyMessage = 'No hay registros disponibles.';

  @Output() edit = new EventEmitter<T>();
  @Output() remove = new EventEmitter<T>();

  protected getCellValue(item: T, column: AdminTableColumn<T>): string {
    if (column.formatter) {
      return column.formatter(item);
    }

    const path = String(column.key).split('.');
    let value: unknown = item as Record<string, unknown>;

    for (const segment of path) {
      if (value == null || typeof value !== 'object') {
        value = '';
        break;
      }
      value = (value as Record<string, unknown>)[segment];
    }

    if (value == null) {
      return '';
    }

    return String(value);
  }
}
