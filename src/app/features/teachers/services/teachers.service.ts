import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api-client.service';

export interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  degree: string;
  position: string;
  experience: number;
}

@Injectable({ providedIn: 'root' })
export class TeachersService {
  private api = inject(ApiClientService);

  getAll(): Observable<Teacher[]> {
    return this.api.get<Teacher[]>('/teachers');
  }

  getById(id: string): Observable<Teacher> {
    return this.api.get<Teacher>(`/teachers/${id}`);
  }

  create(data: Omit<Teacher, '_id'>): Observable<Teacher> {
    return this.api.post<Teacher>('/teachers', data);
  }

  update(id: string, data: Partial<Teacher>): Observable<Teacher> {
    return this.api.put<Teacher>(`/teachers/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/teachers/${id}`);
  }
}