import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../../../core/api-client.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private api = inject(ApiClientService);
  apiStatus = "checking...";
  
  ngOnInit() {
    this.api.get<{ message: string }>('/health').subscribe({
      next: (r) => this.apiStatus = r.message,
      error: () => this.apiStatus = 'API unavailable',
    });
  }
}
