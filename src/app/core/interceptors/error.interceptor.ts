import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        
        const backendMsg =
          (error?.error && (error.error.message || error.error.error)) ||
          error.message ||
          '';
        
        this.snackBar.dismiss();

        if (error.status === 0) {
          this.snackBar.open('Network error: no internet connection.', 'Close', { duration: 3000 });
        } else if (error.status === 401) {
          this.snackBar.open(backendMsg || 'Unauthorized. Please log in.', 'Close', { duration: 3000 });
          
          if (!this.router.url.startsWith('/auth/login')) {
            this.router.navigate(['/auth/login']);
          }
        } else if (error.status === 404) {
          const ref = this.snackBar.open(
            backendMsg || 'User not found. Please register.',
            'Register',
            { duration: 4000 }
          );
          ref.onAction().subscribe(() => this.router.navigate(['/auth/register']));

        } else if (error.status === 403) {
          this.snackBar.open(backendMsg || 'Forbidden request.', 'Close', { duration: 3000 });
        } else if (error.status >= 500) {
          this.snackBar.open(backendMsg || 'Server error occurred.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(backendMsg || 'Request failed.', 'Close', { duration: 3000 });
        }

        return throwError(() => error);
      })
    );
  }
}