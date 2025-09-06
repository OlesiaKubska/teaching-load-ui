import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api-client.service';

export interface Load {
  _id: string;
  teacher: string;
  subject: string;
  group: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class LoadsService {
  private api = inject(ApiClientService);

  getAll(): Observable<Load[]> {
    return this.api.get<Load[]>('/loads');
  }

  getById(id: string): Observable<Load> {
    return this.api.get<Load>(`/loads/${id}`);
  }

  create(data: Omit<Load, '_id'>): Observable<Load> {
    return this.api.post<Load>('/loads', data);
  }

  update(id: string, data: Partial<Load>): Observable<Load> {
    return this.api.put<Load>(`/loads/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/loads/${id}`);
  }
}
