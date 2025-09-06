import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SubjectsService, Subject } from '../../services/subjects.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EntityFormDialogComponent } from '../../../../shared/components/entity-form-dialog/entity-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-subjects',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  rows: Subject[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  loading = false;

  columns: DataTableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'hours', header: 'Hours' }
  ];

  constructor(
    private subjectsService: SubjectsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.subjectsService.getAll().subscribe({
      next: (data) => {
        this.rows = data;
        this.total = data.length;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onEdit(row: Subject) {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '500px',
      data: {
        entity: { _id: row._id },
        type: 'subject',
        existing: this.rows
      }
    });

    dialogRef.afterClosed().subscribe((updated: Subject | null) => {
      if (updated) {
        this.subjectsService.update(row._id, updated).subscribe({
          next: () => {
            this.snackBar.open('Subject updated successfully!', 'Close', { duration: 3000 });
            this.loadSubjects();
          },
          error: () => {
            this.snackBar.open('Failed to update subject.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onDelete(row: Subject) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Confirm Deletion',
        message: `Delete subject "${row.name}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectsService.delete(row._id).subscribe({
          next: () => {
            this.snackBar.open('Subject deleted successfully!', 'Close', { duration: 3000 });
            this.loadSubjects();
          },
          error: () => {
            this.snackBar.open('Failed to delete subject.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '400px',
      data: {
        entity: null,
        type: 'subject',
        existing: this.rows
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectsService.create(result).subscribe(() => {
          this.loadSubjects();
        });
      }
    });
  }

  onRowClick(row: Subject) {
    console.log('row clicked', row);
  }

  onPage(event: PageEvent) {
    console.log('pagination event', event);
  }

  onSort(event: Sort) {
    console.log('sort event', event);
  }
}
