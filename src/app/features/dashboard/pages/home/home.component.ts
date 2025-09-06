import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TeachersService } from '../../../teachers/services/teachers.service';
import { SubjectsService } from '../../../subjects/services/subjects.service';
import { LoadsService } from '../../../loads/services/loads.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teachersCount = 0;
  subjectsCount = 0;
  loadsCount = 0;

  private teachersService = inject(TeachersService);
  private subjectsService = inject(SubjectsService);
  private loadsService = inject(LoadsService);
  private router = inject(Router);

  ngOnInit() {
    this.loadCounts();
  }

  loadCounts() {
    this.teachersService.getAll().subscribe(data => this.teachersCount = data.length);
    this.subjectsService.getAll().subscribe(data => this.subjectsCount = data.length);
    this.loadsService.getAll().subscribe(data => this.loadsCount = data.length);
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
