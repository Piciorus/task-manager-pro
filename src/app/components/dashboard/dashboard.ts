import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';
import { TaskListComponent } from '../task-list/task-list';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, TaskListComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  // Modal and form states
  showAddTask = signal(false);
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
  newTaskCategory = '';
  newTaskEnergyLevel: 'low' | 'medium' | 'high' = 'medium';
  newTaskDueDate = '';
  newTaskEstimatedTime = 60;

  // UI state
  selectedFilter = signal<'all' | 'today' | 'overdue' | 'high-priority'>('all');
  searchQuery = signal('');

  // Computed properties
  stats = computed(() => this.taskService.getProductivityStats());
  suggestedTasks = computed(() => this.taskService.getSuggestedTasks());
  
  // Filter and search
  filteredAndSearchedTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      // Search filter
      const matchesSearch = !query || 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Status filter
      switch (filter) {
        case 'today':
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        
        case 'overdue':
          if (!task.dueDate || task.status === 'completed') return false;
          return new Date(task.dueDate) < today;
        
        case 'high-priority':
          return task.priority === 'high' || task.priority === 'urgent';
        
        case 'all':
        default:
          return true;
      }
    });
  });

  constructor(public taskService: TaskService) {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    if (this.taskService.tasks().length === 0) {
      this.taskService.addTask({
        title: 'Complete project proposal',
        description: 'Write and review the Q1 project proposal',
        priority: 'high',
        status: 'in-progress',
        category: 'Work',
        tags: ['important', 'deadline'],
        estimatedTime: 120,
        energyLevel: 'high',
        dependencies: [],
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
      });

      this.taskService.addTask({
        title: 'Review design mockups',
        description: 'Check the new UI designs for the mobile app',
        priority: 'medium',
        status: 'todo',
        category: 'Work',
        tags: ['review'],
        estimatedTime: 60,
        energyLevel: 'medium',
        dependencies: [],
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
      });

      this.taskService.addTask({
        title: 'Workout session',
        description: '30 minutes cardio + 30 minutes strength training',
        priority: 'medium',
        status: 'todo',
        category: 'Health',
        tags: ['fitness', 'daily'],
        estimatedTime: 60,
        energyLevel: 'high',
        dependencies: [],
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
      });
    }
  }

  toggleAddTask(): void {
    this.showAddTask.set(!this.showAddTask());
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const dueDate = this.newTaskDueDate ? new Date(this.newTaskDueDate) : undefined;

    this.taskService.addTask({
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      status: 'todo',
      category: this.newTaskCategory || 'General',
      tags: [],
      estimatedTime: this.newTaskEstimatedTime,
      energyLevel: this.newTaskEnergyLevel,
      dueDate: dueDate,
      dependencies: [],
      subtasks: [],
      timeBlocks: [],
      voiceNotes: [],
    });

    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.newTaskCategory = '';
    this.newTaskEnergyLevel = 'medium';
    this.newTaskDueDate = '';
    this.newTaskEstimatedTime = 60;
    this.showAddTask.set(false);
  }

  cancelAddTask(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.newTaskCategory = '';
    this.newTaskEnergyLevel = 'medium';
    this.newTaskDueDate = '';
    this.newTaskEstimatedTime = 60;
    this.showAddTask.set(false);
  }

  setFilter(filter: 'all' | 'today' | 'overdue' | 'high-priority'): void {
    this.selectedFilter.set(filter);
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  getTaskCountByPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): number {
    return this.taskService.tasks().filter(t => t.priority === priority && t.status !== 'completed').length;
  }

  getCompletionPercentage(): number {
    const tasks = this.taskService.tasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }
}
