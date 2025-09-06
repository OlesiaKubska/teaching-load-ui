import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TeachersService } from '../../../features/teachers/services/teachers.service';
import { SubjectsService } from '../../../features/subjects/services/subjects.service';
import { LoadsService } from '../../../features/loads/services/loads.service';

@Component({
  standalone: true,
  selector: 'app-entity-form-dialog',
  templateUrl: './entity-form-dialog.component.html',
  styleUrls: ['./entity-form-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
  ]
})
export class EntityFormDialogComponent {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  teachers: any[] = [];
  subjects: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<EntityFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entity?: any;
      existing?: any[];
      type: 'teacher' | 'subject' | 'load';
    },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private teachersService: TeachersService,
    private subjectsService: SubjectsService,
    private loadsService: LoadsService
  ) {
    this.isEditMode = !!data.entity;

    this.form = this.fb.group(this.getFormConfig());

    if (this.data.type === 'load') {
      this.loadTeachersAndSubjects();
    }

    if (this.isEditMode && data.entity && Object.keys(data.entity).length === 1 && data.entity._id) {
      this.loadEntityById(data.entity._id);
    } else if (this.isEditMode && data.entity) {
      this.form.patchValue(data.entity);
    }
  }

  private loadTeachersAndSubjects() {
    this.teachersService.getAll().subscribe({
      next: (res) => (this.teachers = res),
      error: () => this.snackBar.open('Failed to load teachers', 'Close', { duration: 3000 })
    });

    this.subjectsService.getAll().subscribe({
      next: (res) => (this.subjects = res),
      error: () => this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 })
    });
  }

  getFormConfig() {
    if (this.data.type === 'teacher') {
      return {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: [''],
        degree: ['', Validators.required],
        position: ['', Validators.required],
        experience: [0, [Validators.required, Validators.min(0)]],
      };
    }

    if (this.data.type === 'subject') {
      return {
        name: ['', Validators.required],
        hours: [0, [Validators.required, Validators.min(1)]],
      };
    }

    if (this.data.type === 'load') {
      return {
        teacher: ['', Validators.required],
        subject: ['', Validators.required],
        group: ['', Validators.required],
        type: ['lecture', Validators.required],
      };
    }

    return {};
  }

  loadEntityById(id: string) {
    this.loading = true;

    let service: any | null = null;

    if (this.data.type === 'teacher') {
      service = this.teachersService;
    } else if (this.data.type === 'subject') {
      service = this.subjectsService;
    } else if (this.data.type === 'load') {
      service = this.loadsService;
    }

    if (!service) {
      this.snackBar.open(`Unknown entity type: ${this.data.type}`, 'Close', { duration: 3000 });
      this.dialogRef.close();
      return;
    }

    (service.getById(id) as import('rxjs').Observable<any>).subscribe({
      next: (entity) => {
        this.form.patchValue(entity);
        this.loading = false;
      },
      error: () => {
        this.snackBar.open(`Failed to load ${this.data.type} data.`, 'Close', { duration: 3000 });
        this.dialogRef.close();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const value = this.form.value;

    const duplicate = this.data.existing?.some((item) => {
      if (this.data.type === 'teacher') {
        return (
          item.firstName?.toLowerCase() === value.firstName?.toLowerCase() &&
          item.lastName?.toLowerCase() === value.lastName?.toLowerCase() &&
          (!this.isEditMode || item._id !== this.data.entity?._id)
        );
      }

      if (this.data.type === 'subject') {
        return (
          item.name?.toLowerCase() === value.name?.toLowerCase() &&
          (!this.isEditMode || item._id !== this.data.entity?._id)
        );
      }

      if (this.data.type === 'load') {
        return (
          item.teacher === value.teacher &&
          item.subject === value.subject &&
          item.group?.toLowerCase() === value.group?.toLowerCase() &&
          (!this.isEditMode || item._id !== this.data.entity?._id)
        );
      }

      return false;
    });

    if (duplicate) {
      this.snackBar.open(`${this.data.type} already exists.`, 'Close', { duration: 3000 });
      return;
    }

    this.dialogRef.close(value);

    this.snackBar.open(
      `${this.capitalize(this.data.type)} ${this.isEditMode ? 'updated' : 'created'} successfully!`,
      'Close',
      { duration: 3000 }
    );
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  private capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
