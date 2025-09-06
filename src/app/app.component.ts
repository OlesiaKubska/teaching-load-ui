import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive  } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from '../environments/environment';
import { AuthService } from './features/auth/services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  auth = inject(AuthService);
  title = 'teaching-load-ui';

  private bp = inject(BreakpointObserver);
  isWide = false;

  constructor() {
    this.bp.observe('(min-width: 960px)').subscribe(r => (this.isWide = r.matches));
    console.log('[ENV] apiBaseUrl =', environment.apiBaseUrl);
  }

  closeIfMobile(sidenav: MatSidenav) {
    if (!this.isWide) sidenav.close();
  }
}
