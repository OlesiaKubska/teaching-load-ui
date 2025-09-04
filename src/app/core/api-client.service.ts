import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

type Query = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  private withBase(path: string) {
    
    return `${this.base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private headers(json = true) {
    return json ? new HttpHeaders({ 'Content-Type': 'application/json' }) : undefined;
  }

  get<T>(path: string, query?: Query) {
    const params = query ? new HttpParams({ fromObject: query as any }) : undefined;
    return this.http.get<T>(this.withBase(path), { params });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(this.withBase(path), body, { headers: this.headers() });
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(this.withBase(path), body, { headers: this.headers() });
  }

  delete<T>(path: string) {
    return this.http.delete<T>(this.withBase(path));
  }
}


