import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export type DataTableColumn = {
  key: string;
  header: string;
  cell?: (row: any) => string | number | boolean | null | undefined;
  width?: string;
};

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnChanges {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;
  @Input() loading = false;
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @Output() rowClick = new EventEmitter<any>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<Sort>();
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  displayedColumns: string[] = [];

  @ViewChild(MatTable) table?: MatTable<any>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sortRef?: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.columns && Array.isArray(this.columns) && this.columns.length > 0) {
      this.displayedColumns = this.columns.map((c) => c.key);
      if (this.showActions) {
        this.displayedColumns.push('actions');
      }

      queueMicrotask(() => this.table?.renderRows());
    }
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.remove.emit(row);
  }

  onPage(e: PageEvent) {
    this.page.emit(e);
  }

  onSort(e: Sort) {
    this.sort.emit(e);
  }

  cellValue(col: DataTableColumn, row: any) {
    if (col.cell) return col.cell(row);

    if (col.key.includes('.')) {
      return col.key.split('.').reduce((acc, part) => acc?.[part], row) ?? '';
    }

    const v = row?.[col.key];
    return v === null || v === undefined ? '' : String(v);
  }

  trackByIndex = (_: number, item: any) => item;
}