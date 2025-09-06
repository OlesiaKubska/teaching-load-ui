import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/pages/home/home.component';
import { TeachersComponent } from './features/teachers/pages/teachers/teachers.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { guestGuard } from './features/auth/guards/guest.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { SubjectsComponent } from './features/subjects/pages/subjects/subjects.component';
import { LoadsComponent } from './features/loads/pages/loads/loads.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'lecturers', component: TeachersComponent, canActivate: [authGuard] },
    { path: 'subjects', component: SubjectsComponent, canActivate: [authGuard] },
    { path: 'loads', component: LoadsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home' },
];
