import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/pages/home/home.component';
// import { authGuard } from './features/auth/guards/auth.guard';
import { guestGuard } from './features/auth/guards/guest.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: '**', redirectTo: 'home' },
];
