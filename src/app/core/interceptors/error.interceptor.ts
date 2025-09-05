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
        if (error.status === 401) {
          this.snackBar.open('Unauthorized. Please log in again.', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          this.snackBar.open('Forbidden request.', 'Close', { duration: 3000 });
        } else if (error.status === 500) {
          this.snackBar.open('Server error occurred.', 'Close', { duration: 3000 });
        }
        return throwError(() => error);
      })
    );
  }
}