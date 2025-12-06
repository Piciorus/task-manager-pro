import { Injectable, signal, computed } from '@angular/core';
import { Task, Habit, FocusSession, ProductivityStats, TimeBlock } from '../models/task.model';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';
  private readonly HABITS_KEY = 'habits';
  private readonly FOCUS_SESSIONS_KEY = 'focus_sessions';

  tasks = signal<Task[]>([]);
  habits = signal<Habit[]>([]);
  focusSessions = signal<FocusSession[]>([]);

  filteredTasks = computed(() => this.tasks());
  completedTasks = computed(() =>
    this.tasks().filter(t => t.status === 'completed')
  );
  activeTasks = computed(() =>
    this.tasks().filter(t => t.status !== 'completed' && t.status !== 'archived')
  );

  constructor(private storageService: StorageService) {
    // Try to load from localStorage first
    this.loadData();
    
    // If no tasks exist, create demo tasks
    setTimeout(() => {
      if (this.tasks().length === 0) {
        console.log('No tasks found in storage, creating demo tasks...');
        this.createDemoTasks();
        console.log('Demo tasks created. Total tasks:', this.tasks().length);
        console.log('Active tasks:', this.activeTasks().length);
        this.tasks().forEach(t => console.log('Task:', t.title, '- Status:', t.status));
      } else {
        console.log('Tasks loaded from storage:', this.tasks().length);
      }
    }, 100);
  }

  private createDemoTasks(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const demoTasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = [
      {
        title: 'Complete Project Proposal',
        description: 'Finish the Q4 project proposal and submit to management',
        category: 'Work',
        priority: 'urgent',
        status: 'in-progress' as const,
        dueDate: today,
        estimatedTime: 120,
        energyLevel: 'high',
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['proposal', 'urgent'],
      },
      {
        title: 'Review Team Feedback',
        description: 'Go through the feedback from the sprint retrospective',
        category: 'Work',
        priority: 'high',
        status: 'todo' as const,
        dueDate: tomorrow,
        estimatedTime: 60,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['feedback', 'review'],
      },
      {
        title: 'Update Documentation',
        description: 'Update API documentation with new endpoints',
        category: 'Development',
        priority: 'medium',
        status: 'todo' as const,
        dueDate: nextWeek,
        estimatedTime: 90,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['docs', 'api'],
      },
      {
        title: 'Exercise Session',
        description: '30 minute workout at the gym',
        category: 'Personal',
        priority: 'low',
        status: 'todo' as const,
        dueDate: today,
        estimatedTime: 45,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['fitness', 'health'],
      },
      {
        title: 'Schedule Team Meeting',
        description: 'Organize meeting with product team for next week',
        category: 'Work',
        priority: 'high',
        status: 'todo' as const,
        dueDate: tomorrow,
        estimatedTime: 30,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['meeting', 'team'],
      },
      {
        title: 'Code Review',
        description: 'Review pull requests from team members',
        category: 'Development',
        priority: 'high',
        status: 'todo' as const,
        dueDate: today,
        estimatedTime: 75,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['code', 'review'],
      },
      {
        title: 'Client Presentation Slides',
        description: 'Create and finalize slides for client presentation',
        category: 'Work',
        priority: 'urgent',
        status: 'todo' as const,
        dueDate: tomorrow,
        estimatedTime: 150,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['presentation', 'client'],
      },
      {
        title: 'Database Migration',
        description: 'Migrate user data to new database schema',
        category: 'Development',
        priority: 'high',
        status: 'todo' as const,
        dueDate: nextWeek,
        estimatedTime: 240,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['database', 'backend'],
      },
      {
        title: 'Team Sync - Sprint Planning',
        description: 'Weekly sync with team for sprint planning',
        category: 'Work',
        priority: 'medium',
        status: 'todo' as const,
        dueDate: tomorrow,
        estimatedTime: 120,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['meeting', 'planning'],
      },
      {
        title: 'Fix Critical Bug - Login Page',
        description: 'Users unable to login with new credentials',
        category: 'Development',
        priority: 'urgent',
        status: 'in-progress' as const,
        dueDate: today,
        estimatedTime: 180,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['bug', 'critical'],
      },
      {
        title: 'Lunch Meeting with CEO',
        description: 'Quarterly review meeting and strategic planning',
        category: 'Work',
        priority: 'high',
        status: 'todo' as const,
        dueDate: today,
        estimatedTime: 90,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['meeting', 'executive'],
      },
      {
        title: 'Design Mockups for New Feature',
        description: 'Create UI/UX mockups for mobile app feature',
        category: 'Development',
        priority: 'medium',
        status: 'todo' as const,
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        estimatedTime: 120,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['design', 'ui'],
      },
      {
        title: 'Write Blog Post',
        description: 'Write article about recent project learnings',
        category: 'Personal',
        priority: 'low',
        status: 'todo' as const,
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        estimatedTime: 90,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['writing', 'blog'],
      },
      {
        title: 'Interview Preparation',
        description: 'Prepare for candidate interviews next week',
        category: 'Work',
        priority: 'medium',
        status: 'todo' as const,
        dueDate: nextWeek,
        estimatedTime: 60,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['hr', 'interviews'],
      },
      {
        title: 'Grocery Shopping',
        description: 'Buy groceries for the week',
        category: 'Personal',
        priority: 'low',
        status: 'todo' as const,
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        estimatedTime: 60,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['shopping', 'personal'],
      },
      {
        title: 'Refactor Authentication Module',
        description: 'Clean up and improve the authentication code',
        category: 'Development',
        priority: 'medium',
        status: 'todo' as const,
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        estimatedTime: 180,
        subtasks: [],
        timeBlocks: [],
        voiceNotes: [],
        tags: ['refactoring', 'backend'],
      },
    ] as const as any;

    demoTasks.forEach(task => this.addTask(task));
  }

  private loadData(): void {
    const tasks = this.storageService.getItem<any[]>(this.TASKS_KEY);
    const habits = this.storageService.getItem<Habit[]>(this.HABITS_KEY);
    const sessions = this.storageService.getItem<FocusSession[]>(this.FOCUS_SESSIONS_KEY);

    if (tasks) {
      const deserializedTasks = tasks.map(t => ({
        ...t,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      }));
      this.tasks.set(deserializedTasks);
    }
    if (habits) this.habits.set(habits);
    if (sessions) this.focusSessions.set(sessions);
  }

  private saveTasks(): void {
    const tasksToSave = this.tasks().map(task => ({
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
      createdAt: task.createdAt ? task.createdAt.toISOString() : undefined,
      updatedAt: task.updatedAt ? task.updatedAt.toISOString() : undefined,
    }));
    this.storageService.setItem(this.TASKS_KEY, tasksToSave);
  }

  private saveHabits(): void {
    this.storageService.setItem(this.HABITS_KEY, this.habits());
  }

  private saveFocusSessions(): void {
    this.storageService.setItem(this.FOCUS_SESSIONS_KEY, this.focusSessions());
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: task.subtasks || [],
      timeBlocks: task.timeBlocks || [],
      voiceNotes: task.voiceNotes || [],
      tags: task.tags || [],
    };

    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveTasks();
    console.log('Task added:', newTask.title, 'Total tasks:', this.tasks().length);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.saveTasks();
  }

  toggleTaskStatus(id: string): void {
    this.tasks.update(tasks =>
      tasks.map(task => {
        if (task.id === id) {
          const newStatus = task.status === 'completed' ? 'todo' : 'completed';
          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined,
            updatedAt: new Date(),
          };
        }
        return task;
      })
    );
    this.saveTasks();
  }

  addHabit(habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>): Habit {
    const newHabit: Habit = {
      ...habit,
      id: this.generateId(),
      streak: 0,
      completedDates: [],
    };

    this.habits.update(habits => [...habits, newHabit]);
    this.saveHabits();
    return newHabit;
  }

  updateHabit(id: string, updates: Partial<Habit>): void {
    this.habits.update(habits =>
      habits.map(habit => habit.id === id ? { ...habit, ...updates } : habit)
    );
    this.saveHabits();
  }

  deleteHabit(id: string): void {
    this.habits.update(habits => habits.filter(h => h.id !== id));
    this.saveHabits();
  }

  completeHabitForToday(habitId: string): void {
    const today = new Date().toDateString();
    this.habits.update(habits =>
      habits.map(habit => {
        if (habit.id === habitId) {
          const alreadyCompleted = habit.completedDates.some(
            date => new Date(date).toDateString() === today
          );

          if (!alreadyCompleted) {
            return {
              ...habit,
              completedDates: [...habit.completedDates, new Date()],
              streak: habit.streak + 1,
            };
          }
        }
        return habit;
      })
    );
    this.saveHabits();
  }

  addFocusSession(session: Omit<FocusSession, 'id'>): FocusSession {
    const newSession: FocusSession = {
      ...session,
      id: this.generateId(),
    };

    this.focusSessions.update(sessions => [...sessions, newSession]);
    this.saveFocusSessions();
    return newSession;
  }

  getProductivityStats(): ProductivityStats {
    const tasks = this.tasks();
    const completed = this.completedTasks();

    const stats: ProductivityStats = {
      totalTasksCompleted: completed.length,
      totalTimeSpent: completed.reduce((sum, t) => sum + (t.actualTime || 0), 0),
      averageCompletionTime: 0,
      productivityScore: 0,
      tasksCompletedByPriority: {},
      tasksCompletedByCategory: {},
      weeklyProgress: [],
      streakDays: this.calculateStreak(),
      peakProductivityHours: this.calculatePeakHours(),
    };

    completed.forEach(task => {
      stats.tasksCompletedByPriority[task.priority] =
        (stats.tasksCompletedByPriority[task.priority] || 0) + 1;
      stats.tasksCompletedByCategory[task.category] =
        (stats.tasksCompletedByCategory[task.category] || 0) + 1;
    });

    if (completed.length > 0) {
      stats.averageCompletionTime = stats.totalTimeSpent / completed.length;
    }

    stats.productivityScore = this.calculateProductivityScore(stats);
    stats.weeklyProgress = this.getWeeklyProgress();

    return stats;
  }

  private calculateStreak(): number {
    const completed = this.completedTasks()
      .filter(t => t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const task of completed) {
      const taskDate = new Date(task.completedAt!);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (taskDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  private calculatePeakHours(): number[] {
    const hourCounts: number[] = new Array(24).fill(0);

    this.completedTasks().forEach(task => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt).getHours();
        hourCounts[hour]++;
      }
    });

    const maxCount = Math.max(...hourCounts);
    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count === maxCount)
      .map(item => item.hour);
  }

  private calculateProductivityScore(stats: ProductivityStats): number {
    let score = 0;

    score += Math.min(stats.totalTasksCompleted * 10, 400);
    score += Math.min(stats.streakDays * 20, 300);

    const urgentCompleted = stats.tasksCompletedByPriority['urgent'] || 0;
    const highCompleted = stats.tasksCompletedByPriority['high'] || 0;
    score += urgentCompleted * 15 + highCompleted * 10;

    return Math.min(Math.round(score), 1000);
  }

  private getWeeklyProgress(): number[] {
    const progress: number[] = new Array(7).fill(0);
    const today = new Date();

    this.completedTasks().forEach(task => {
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const daysDiff = Math.floor(
          (today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff < 7) {
          progress[6 - daysDiff]++;
        }
      }
    });

    return progress;
  }

  getSuggestedTasks(): Task[] {
    const now = new Date();
    const currentHour = now.getHours();
    const tasks = this.activeTasks();

    return tasks.filter(task => {
      if (!task.energyLevel) return false;

      if (currentHour >= 6 && currentHour < 12) {
        return task.energyLevel === 'high';
      } else if (currentHour >= 12 && currentHour < 18) {
        return task.energyLevel === 'medium';
      } else {
        return task.energyLevel === 'low';
      }
    }).slice(0, 5);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
