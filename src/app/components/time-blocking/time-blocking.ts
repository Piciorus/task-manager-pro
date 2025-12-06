import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';

interface TimeSlot {
  hour: number;
  tasks: Task[];
  isConflict: boolean;
}

@Component({
  selector: 'app-time-blocking',
  imports: [CommonModule, FormsModule],
  templateUrl: './time-blocking.html',
  styleUrl: './time-blocking.scss',
  standalone: true
})
export class TimeBlockingComponent {
  selectedDate = signal(new Date());
  timeSlots = computed(() => this.generateTimeSlots());
  activeTasks = computed(() => this.taskService.activeTasks());
  draggedTask = signal<Task | null>(null);

  hours = Array.from({ length: 24 }, (_, i) => i);

  constructor(private taskService: TaskService) {}

  private generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const tasksInSlot = this.getTasksForHour(hour);
      slots.push({
        hour,
        tasks: tasksInSlot,
        isConflict: tasksInSlot.length > 1,
      });
    }

    return slots;
  }

  private getTasksForHour(hour: number): Task[] {
    return this.activeTasks().filter(task => {
      if (!task.timeBlocks || task.timeBlocks.length === 0) return false;
      
      return task.timeBlocks.some(block => {
        const blockHour = new Date(block.startTime).getHours();
        return blockHour === hour;
      });
    });
  }

  getHourDisplay(hour: number): string {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  previousDay(): void {
    const date = new Date(this.selectedDate());
    date.setDate(date.getDate() - 1);
    this.selectedDate.set(date);
  }

  nextDay(): void {
    const date = new Date(this.selectedDate());
    date.setDate(date.getDate() + 1);
    this.selectedDate.set(date);
  }

  today(): void {
    this.selectedDate.set(new Date());
  }

  getDateDisplay(): string {
    const date = this.selectedDate();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  onDragStart(task: Task): void {
    this.draggedTask.set(task);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropOnHour(hour: number): void {
    const task = this.draggedTask();
    if (task) {
      const startTime = new Date(this.selectedDate());
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);

      const newTimeBlock = {
        id: this.generateId(),
        startTime,
        endTime,
        taskId: task.id,
      };

      const updatedBlocks = [...(task.timeBlocks || []), newTimeBlock];
      this.taskService.updateTask(task.id, { timeBlocks: updatedBlocks });
      this.draggedTask.set(null);
    }
  }

  removeTimeBlock(taskId: string, blockId: string): void {
    const task = this.activeTasks().find(t => t.id === taskId);
    if (task) {
      const updatedBlocks = (task.timeBlocks || []).filter(b => b.id !== blockId);
      this.taskService.updateTask(taskId, { timeBlocks: updatedBlocks });
    }
  }

  getTaskColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'urgent': '#ef4444',
      'high': '#f97316',
      'medium': '#f59e0b',
      'low': '#10b981',
    };
    return colors[priority] || '#6366f1';
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
