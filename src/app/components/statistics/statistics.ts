import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
  standalone: true
})
export class StatisticsComponent {
  stats = computed(() => this.taskService.getProductivityStats());
  
  peakHourDisplay = computed(() => {
    const hours = this.stats().peakProductivityHours;
    if (hours.length === 0) return 'Not available';
    if (hours.length === 1) return `${String(hours[0]).padStart(2, '0')}:00`;
    return `${String(hours[0]).padStart(2, '0')}:00 - ${String(hours[hours.length - 1]).padStart(2, '0')}:00`;
  });

  priorityCounts = computed(() => {
    const stats = this.stats();
    return {
      urgent: stats.tasksCompletedByPriority['urgent'] || 0,
      high: stats.tasksCompletedByPriority['high'] || 0,
      medium: stats.tasksCompletedByPriority['medium'] || 0,
      low: stats.tasksCompletedByPriority['low'] || 0,
    };
  });

  categoryCounts = computed(() => {
    const stats = this.stats();
    const entries = Object.entries(stats.tasksCompletedByCategory || {});
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 5);
  });

  weeklyData = computed(() => {
    const progress = this.stats().weeklyProgress;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return progress.map((count, index) => ({
      day: days[index],
      count,
      percentage: Math.min((count / Math.max(...progress, 1)) * 100, 100),
    }));
  });

  constructor(public taskService: TaskService) {}

  getProductivityTrend(): string {
    const current = this.stats().weeklyProgress[this.stats().weeklyProgress.length - 1];
    const previous = this.stats().weeklyProgress[this.stats().weeklyProgress.length - 2];
    
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }
}
