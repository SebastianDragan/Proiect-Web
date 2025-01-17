import { Component, } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { AuthService } from '../../services/auth-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent  {
  tasks: any[] = []; // Lista sarcinilor
  taskForm: FormGroup; // Obiectul pentru formularul sarcinii
  message: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inițializează formularul
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deadline: ['', Validators.required],
    });
  }

  addTask() {
    const token = this.authService.getToken(); // Obține token-ul de autentificare
    if (token && this.taskForm.valid) {
        // Trimite sarcina
        this.taskService.addTask(this.taskForm.value, token).subscribe({
            next: (response) => {
                console.log('Task added successfully:', response);
                this.message = 'Task added successfully!';
                this.taskForm.reset(); // Resetează formularul
                window.location.reload();
            },
            error: (err) => {
                console.error('Error adding task:', err);
                this.message = err.error?.message || 'Unknown error occurred';
            }
        });
    } else {
        console.error('Form is invalid', this.taskForm.errors); // Afișează erorile formularului în consolă
        this.message = 'Form is invalid. Please check your inputs.';
    }
}

  // Funcție pentru a marca o sarcină ca fiind completată
  completeTask(task: any) {
    const token = this.authService.getToken(); // Obține token-ul de autentificare
    if (token) {
      this.taskService
        .updateTask(task.id, { completed: true }, token)
        .subscribe({
          next: () => {
            task.completed = true; // Actualizează starea sarcinii local
            this.message = 'Task marked as completed!';
          },
          error: (err) => {
            this.message =
              'Failed to complete task: ' +
              (err.error.message || 'Unknown error');
          },
        });
    }
  }

  // Funcție pentru a șterge o sarcină
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
}
