import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../../../core/api-client.service';
import { BehaviorSubject, tap } from 'rxjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: { id: string; email: string; username: string };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

const TOKEN_KEY = 'tl_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiClientService);
  private router = inject(Router);

  private _isAuth$ = new BehaviorSubject<boolean>(this.hasToken());
  isAuth$ = this._isAuth$.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  login(data: LoginDto) {
    return this.api.post<LoginResponse>('/auth/login', data).pipe(
      tap((res) => {
        // console.log('[AuthService] Login response:', res);

        localStorage.setItem(TOKEN_KEY, res.token);
        // console.log('[AuthService] Token saved to localStorage:', res.token);

        this._isAuth$.next(true);
      })
    );
  }

  register(data: RegisterDto) {
    const payload = {
      username: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
      email: data.email,
      password: data.password,
    };
    // console.log('[AuthService] Register payload:', payload);
    return this.api.post<RegisterResponse>('/auth/register', payload);
  }

  logout() {
    // console.log('[AuthService] Logging out, removing token');
    localStorage.removeItem(TOKEN_KEY);
    this._isAuth$.next(false);
    this.router.navigate(['/home']);
  }
}