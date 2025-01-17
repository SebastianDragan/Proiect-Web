import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskChartComponent } from '../../task-chart/task-chart.component';
import { AuthService } from '../../services/auth-service.service';
import { TaskService } from '../../services/task-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, TaskFormComponent, TaskListComponent, TaskChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corectat din `styleUrl` în `styleUrls`
})
export class DashboardComponent implements OnInit {
  tasks: any[] = []; // Lista de taskuri

  constructor(private authService: AuthService, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks(); // Încarcă taskurile la inițializare
  }

  loadTasks() {
    const token = this.authService.getToken(); // Obține token-ul de autentificare
    if (token) {
      this.taskService.getTasks(token).subscribe({
        next: (response) => {
          this.tasks = response; // Salvează toate taskurile primite
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
        }
      });
    }
  }
}
