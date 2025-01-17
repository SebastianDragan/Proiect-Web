import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Înregistrează toate componentele disponibile, inclusiv controllerul pentru doughnut

@Component({
  selector: 'app-task-chart',
  standalone: true,
  templateUrl: './task-chart.component.html',
  styleUrls: ['./task-chart.component.scss']
})
export class TaskChartComponent implements OnChanges {
  @Input() tasks: any[] = []; // Input pentru a primi taskurile din componenta părinte
  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.createChart(); // Re-creează graficul ori de câte ori se schimbă lista de taskuri
    }
  }

  createChart() {
    // Verifică dacă există taskuri
    if (this.tasks.length === 0) {
      return; // Nu face nimic dacă nu sunt taskuri
    }

    // Calculează numărul de taskuri în funcție de status
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const futureTasks = this.tasks.filter(task => new Date(task.deadline) > new Date()).length;
    const pastTasks = this.tasks.filter(task => new Date(task.deadline) < new Date()).length;

    // Distruge graficul anterior, dacă există
    if (this.chart) {
      this.chart.destroy();
    }

    // Creează graficul
    this.chart = new Chart('taskChart', {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Future', 'Past'],
        datasets: [{
          data: [completedTasks, futureTasks, pastTasks],
          backgroundColor: ['#4CAF50', '#2196F3', '#F44336'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
