import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { AuthService } from '../../services/auth-service.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Array pentru a stoca sarcinile
  message: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTasks(); // Încarcă sarcinile la inițializarea componentei
  }

  // Funcție pentru a încărca sarcinile utilizatorului
  loadTasks() {
    const token = this.authService.getToken(); // Obține token-ul de autentificare
    if (token) {
      this.taskService.getTasks(token).subscribe({
        next: (tasks) => {
          this.tasks = tasks; // Salvează sarcinile în variabila tasks
        },
        error: (err) => {
          this.message =
            'Failed to load tasks: ' + (err.error.message || 'Unknown error');
        },
      });
    }
  }

  deleteTask(taskId: number) {
    const token = this.authService.getToken(); // Obține token-ul de autentificare
    if (token) {
      this.taskService.deleteTask(taskId, token).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== taskId); // Elimină sarcina din lista locală
          this.message = 'Task deleted successfully!';
        },
        error: (err) => {
          this.message =
            'Failed to delete task: ' + (err.error.message || 'Unknown error');
        },
      });
    }
  }

  editTask(task: any) {
    // Logica de editare a sarcinii
    console.log('Edit task:', task);
    // Aici poți emite un eveniment pentru a informa TaskFormComponent să preia sarcina de editat
  }
}
