import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataTableComponent,
  DataTableColumn,
} from '../../../../shared/components/data-table/data-table.component';
import { TeachersService, Teacher } from '../../services/teachers.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EntityFormDialogComponent } from '../../../../shared/components/entity-form-dialog/entity-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { getValueForSort, compareValues } from '../../../../shared/utils/table-utils';

@Component({
  standalone: true,
  selector: 'app-teachers',
  imports: [CommonModule, DataTableComponent, EntityFormDialogComponent, ConfirmDialogComponent],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  allTeachers: Teacher[] = [];
  rows: Teacher[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  loading = false;

  private updateRows() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.allTeachers.slice(start, end);
  }

  columns: DataTableColumn[] = [
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'middleName', header: 'Middle Name' },
    { key: 'degree', header: 'Degree' },
    { key: 'position', header: 'Position' },
    { key: 'experience', header: 'Experience (years)' }
  ];

  constructor(private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private teachersService: TeachersService
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;
    this.teachersService.getAll().subscribe({
      next: (teachers) => {
        this.allTeachers = teachers;
        this.total = teachers.length;
        this.updateRows();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load teachers', err);
        this.loading = false;
      }
    });
  }

  onEdit(row: Teacher) {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '500px',
      data: {
        entity: { _id: row._id },
        existing: this.rows,
        type: 'teacher'
      }
    });

    dialogRef.afterClosed().subscribe((updated: Teacher | null) => {
      if (updated) {
        this.teachersService.update(row._id, updated).subscribe({
          next: () => {
            this.snackBar.open('Teacher updated successfully!', 'Close', { duration: 3000 });
            this.loadTeachers();
          },
          error: () => {
            this.snackBar.open('Failed to update teacher.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onDelete(row: Teacher) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Confirm Deletion',
        message: `Delete "${row.firstName} ${row.lastName}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teachersService.delete(row._id).subscribe({
          next: () => {
            this.snackBar.open('Teacher deleted successfully!', 'Close', { duration: 3000 });
            this.loadTeachers();
          },
          error: () => {
            this.snackBar.open('Failed to delete teacher.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onRowClick(row: Teacher) {
    console.log('row clicked', row);
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateRows();
  }

  onSort(event: Sort) {
    if (!event.active || event.direction === '') {
      this.allTeachers = [...this.allTeachers]; 
      this.updateRows();
      return;
    }

    const isAsc = event.direction === 'asc';

    this.allTeachers = [...this.allTeachers].sort((a, b) => {
      const valueA = getValueForSort(a, event.active);
      const valueB = getValueForSort(b, event.active);
      return compareValues(valueA, valueB, isAsc);
    });

    this.updateRows();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '400px',
      data: { entity: null, existing: this.rows, type: 'teacher' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teachersService.create(result).subscribe(() => {
          this.loadTeachers();
        });
      }
    });
  }
}
