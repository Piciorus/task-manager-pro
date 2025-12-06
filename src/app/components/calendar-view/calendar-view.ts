import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';

interface CalendarDay {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
  standalone: true
})
export class CalendarViewComponent {
  currentMonth = signal(new Date());
  selectedDate = signal<Date | null>(null);
  sidebarOpen = signal(true);
  calendarDays = computed(() => this.generateCalendarDays());
  tasksForSelectedDate = computed(() => this.getTasksForDate(this.selectedDate()));

  allTasks = computed(() => this.taskService.tasks());

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private taskService: TaskService) {}

  private generateCalendarDays(): CalendarDay[] {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = this.selectedDate();
    selected?.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selected ? date.getTime() === selected.getTime() : false;

      days.push({
        date: new Date(date),
        tasks: this.getTasksForDate(date),
        isCurrentMonth,
        isToday,
        isSelected,
      });
    }

    return days;
  }

  private getTasksForDate(date: Date | null): Task[] {
    if (!date) return [];

    return this.allTasks().filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      return taskDate.getTime() === checkDate.getTime();
    });
  }

  previousMonth(): void {
    const month = new Date(this.currentMonth());
    month.setMonth(month.getMonth() - 1);
    this.currentMonth.set(month);
  }

  nextMonth(): void {
    const month = new Date(this.currentMonth());
    month.setMonth(month.getMonth() + 1);
    this.currentMonth.set(month);
  }

  today(): void {
    const today = new Date();
    this.currentMonth.set(today);
    this.selectDate(today);
  }

  selectDate(date: Date): void {
    this.selectedDate.set(new Date(date));
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(isOpen => !isOpen);
  }

  getMonthYear(): string {
    return `${this.monthNames[this.currentMonth().getMonth()]} ${this.currentMonth().getFullYear()}`;
  }

  getDateDisplay(date: Date): string {
    return date.getDate().toString();
  }

  getTaskCountDisplay(taskCount: number): string {
    if (taskCount === 0) return '';
    if (taskCount === 1) return '•';
    if (taskCount <= 3) return '••';
    return '•••';
  }

  getTaskCompletionRate(date: Date): number {
    const tasks = this.getTasksForDate(date);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }

  getTaskPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'urgent': '#ef4444',
      'high': '#f97316',
      'medium': '#f59e0b',
      'low': '#10b981',
    };
    return colors[priority] || '#6366f1';
  }
}

