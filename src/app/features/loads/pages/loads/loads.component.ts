import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { LoadsService, Load } from '../../services/loads.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EntityFormDialogComponent } from '../../../../shared/components/entity-form-dialog/entity-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { getValueForSort, compareValues } from '../../../../shared/utils/table-utils';

@Component({
  standalone: true,
  selector: 'app-loads',
  imports: [CommonModule, DataTableComponent, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.scss'],
})
export class LoadsComponent implements OnInit {
  allLoads: Load[] = [];
  rows: Load[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  loading = false;

  selectedYear: number | null = null;
  selectedType: string | null = null;

  minYear = 2015;
  maxYear = new Date().getFullYear();
  
  columns: DataTableColumn[] = [
    { 
      key: 'teacher', 
      header: 'Teacher', 
      cell: (row) => row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : '' 
    },
    { 
      key: 'subject', 
      header: 'Subject', 
      cell: (row) => row.subject?.name || '' 
    },
    { key: 'group', header: 'Group' },
    { key: 'type', header: 'Type' },
    { key: 'year', header: 'Year' }
  ];

  constructor(
    private loadsService: LoadsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadLoads();
  }

  private updateRows() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.allLoads.slice(start, end);
  }

  loadLoads() {
    if (this.selectedYear && (this.selectedYear < this.minYear || this.selectedYear > this.maxYear)) {
        this.snackBar.open(
          `Year must be between ${this.minYear} and ${this.maxYear}.`,
          'Close',
          { duration: 3000 }
        );
        this.selectedYear = null;
      }

    this.loading = true;
    this.loadsService.getAll().subscribe({
      next: (data) => {
        let filtered = data;

        if (this.selectedYear) {
          filtered = filtered.filter((l) => l.year === this.selectedYear);
        }

        if (this.selectedType) {
          filtered = filtered.filter((l) => l.type === this.selectedType);
        }

        this.allLoads = filtered;
        this.total = filtered.length;
        this.updateRows();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load teaching loads', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onEdit(row: Load) {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '500px',
      data: { entity: { _id: row._id }, type: 'load', existing: this.rows }
    });

    dialogRef.afterClosed().subscribe((updated: Load | null) => {
      if (updated) {
        this.loadsService.update(row._id, updated).subscribe({
          next: () => {
            this.snackBar.open('Teaching load updated successfully!', 'Close', { duration: 3000 });
            this.loadLoads();
          },
          error: () => {
            this.snackBar.open('Failed to update load.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onDelete(row: Load) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Confirm Deletion',
        message: `Delete load for "${row.teacher}" - "${row.subject}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadsService.delete(row._id).subscribe({
          next: () => {
            this.snackBar.open('Load deleted successfully!', 'Close', { duration: 3000 });
            this.loadLoads();
          },
          error: () => {
            this.snackBar.open('Failed to delete load.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '400px',
      data: { entity: null, type: 'load', existing: this.rows }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadsService.create(result).subscribe(() => {
          this.loadLoads();
        });
      }
    });
  }

  onRowClick(row: Load) {
    console.log('row clicked', row);
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateRows();
  }

  onSort(event: Sort) {
    if (!event.active || event.direction === '') {
      this.allLoads = [...this.allLoads]; 
      this.updateRows();
      return;
    }

    const isAsc = event.direction === 'asc';

    this.allLoads = [...this.allLoads].sort((a, b) => {
      const valueA = getValueForSort(a, event.active);
      const valueB = getValueForSort(b, event.active);
      return compareValues(valueA, valueB, isAsc);
    });

    this.updateRows();
  }
}
