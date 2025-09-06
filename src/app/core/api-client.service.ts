import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

type Query = Record<string, string | number | boolean | null | undefined>;

const TOKEN_KEY = 'tl_token';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  private withBase(path: string) {
    return `${this.base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private getHeaders(json = true): HttpHeaders {
    const token = localStorage.getItem(TOKEN_KEY);
    let headers = json
      ? new HttpHeaders({ 'Content-Type': 'application/json' })
      : new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // console.log('[ApiClientService] Using headers:', headers.keys().map(k => `${k}: ${headers.get(k)}`));

    return headers;
  }

  get<T>(path: string, query?: Query): Observable<T> {
    const url = this.withBase(path);
    const params = query ? new HttpParams({ fromObject: query as any }) : undefined;

    // console.log('[ApiClientService][GET]', url, 'params:', params?.toString());

    return this.http.get<T>(url, { params, headers: this.getHeaders() });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    const url = this.withBase(path);
    // console.log('[ApiClientService][POST]', url, 'body:', body);

    return this.http.post<T>(url, body, { headers: this.getHeaders() });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    const url = this.withBase(path);
    // console.log('[ApiClientService][PUT]', url, 'body:', body);

    return this.http.put<T>(url, body, { headers: this.getHeaders() });
  }

  delete<T>(path: string): Observable<T> {
    const url = this.withBase(path);
    // console.log('[ApiClientService][DELETE]', url);

    return this.http.delete<T>(url, { headers: this.getHeaders() });
  }
}
