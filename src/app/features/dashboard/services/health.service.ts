import { Injectable, inject } from '@angular/core';
import { ApiClientService } from '../../../core/api-client.service';
import { HealthResponse } from '../../../shared/models/health.model';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private api = inject(ApiClientService);
  ping() {                       // GET /api/health
    return this.api.get<HealthResponse>('/health');
  }
}
