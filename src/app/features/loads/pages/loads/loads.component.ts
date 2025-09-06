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

@Component({
  standalone: true,
  selector: 'app-loads',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.scss'],
})
export class LoadsComponent implements OnInit {
  rows: Load[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  loading = false;

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
    { key: 'type', header: 'Type' }
  ];

  constructor(
    private loadsService: LoadsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadLoads();
  }

  loadLoads() {
    this.loading = true;
    this.loadsService.getAll().subscribe({
      next: (data) => {
        this.rows = data;
        this.total = data.length;
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
    console.log('pagination event', event);
  }

  onSort(event: Sort) {
    console.log('sort event', event);
  }
}
