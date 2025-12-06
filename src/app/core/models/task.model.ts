export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'archived';
  category: string;
  tags: string[];
  estimatedTime?: number; // in minutes
  actualTime?: number;
  energyLevel?: 'low' | 'medium' | 'high'; // Unique: energy level required
  dependencies?: string[]; // IDs of tasks this depends on
  subtasks: Subtask[];
  timeBlocks: TimeBlock[];
  voiceNotes: VoiceNote[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimeBlock {
  id: string;
  startTime: Date;
  endTime: Date;
  taskId: string;
}

export interface VoiceNote {
  id: string;
  audioUrl: string;
  transcript?: string;
  duration: number;
  createdAt: Date;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number[];
  streak: number;
  completedDates: Date[];
  color: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  duration: number; // in minutes
  startTime?: Date;
  endTime?: Date;
  completed?: boolean;
  completedAt: Date;
  sessionsCompleted: number;
  type?: 'pomodoro' | 'deep-work' | 'quick-task';
}

export interface ProductivityStats {
  totalTasksCompleted: number;
  totalTimeSpent: number;
  averageCompletionTime: number;
  productivityScore: number;
  tasksCompletedByPriority: Record<string, number>;
  tasksCompletedByCategory: Record<string, number>;
  weeklyProgress: number[];
  streakDays: number;
  peakProductivityHours: number[];
}
