import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirm: ['', Validators.required],
  });

  loading = false;
  error = '';

  submit() {
    if (this.form.invalid || this.loading) return;

    const { firstName, lastName, email, password, confirm } = this.form.value;
    if (password !== confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register({ firstName: firstName!, lastName: lastName!, email: email!, password: password! }).subscribe({
      next: (res) => {
          
          this.snack.open(res?.message || 'Registration successful', 'Close', { duration: 2500 });
          
          this.router.navigate(['/auth/login']);
        },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}