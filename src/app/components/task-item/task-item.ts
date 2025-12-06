import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItemComponent {
  @Input() task!: Task;

  constructor(private taskService: TaskService) {}

  toggleStatus(): void {
    this.taskService.toggleTaskStatus(this.task.id);
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id);
    }
  }
}
