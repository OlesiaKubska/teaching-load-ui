import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/pages/home/home.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'home' },
];
