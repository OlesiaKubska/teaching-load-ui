import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api-client.service';

export interface Subject {
  _id: string;
  name: string;
  hours: number;
}

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private api = inject(ApiClientService);

  getAll(): Observable<Subject[]> {
    return this.api.get<Subject[]>('/subjects');
  }

  getById(id: string): Observable<Subject> {
    return this.api.get<Subject>(`/subjects/${id}`);
  }

  create(data: Omit<Subject, '_id'>): Observable<Subject> {
    return this.api.post<Subject>('/subjects', data);
  }

  update(id: string, data: Partial<Subject>): Observable<Subject> {
    return this.api.put<Subject>(`/subjects/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/subjects/${id}`);
  }
}