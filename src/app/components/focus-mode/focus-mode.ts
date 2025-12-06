import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-focus-mode',
  imports: [CommonModule, FormsModule],
  templateUrl: './focus-mode.html',
  styleUrl: './focus-mode.scss',
  standalone: true
})
export class FocusModeComponent implements OnDestroy {
  // Pomodoro settings
  workDuration = signal(25); // minutes
  breakDuration = signal(5); // minutes
  sessionsCompleted = signal(0);
  
  // Timer state
  timeRemaining = signal(25 * 60); // seconds
  isRunning = signal(false);
  isBreak = signal(false);
  
  // Task selection
  selectedTask = signal<Task | null>(null);
  availableTasks = computed(() => this.taskService.activeTasks());
  
  // Audio notification
  private audioContext: AudioContext | null = null;
  
  // Timer interval
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private taskService: TaskService) {}

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // Convert seconds to MM:SS format
  getTimeDisplay(): string {
    const totalSeconds = this.timeRemaining();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startSession(): void {
    if (!this.selectedTask() && !this.isRunning()) {
      alert('Please select a task to focus on');
      return;
    }
    
    this.isRunning.set(true);
    this.startTimer();
  }

  pauseSession(): void {
    this.isRunning.set(false);
    this.stopTimer();
  }

  resumeSession(): void {
    this.isRunning.set(true);
    this.startTimer();
  }

  resetSession(): void {
    this.stopTimer();
    this.isRunning.set(false);
    this.isBreak.set(false);
    this.timeRemaining.set(this.workDuration() * 60);
  }

  changeWorkDuration(minutes: number): void {
    this.workDuration.set(minutes);
    if (!this.isRunning() && !this.isBreak()) {
      this.timeRemaining.set(minutes * 60);
    }
  }

  changeBreakDuration(minutes: number): void {
    this.breakDuration.set(minutes);
    if (!this.isRunning() && this.isBreak()) {
      this.timeRemaining.set(minutes * 60);
    }
  }

  selectTask(task: Task): void {
    this.selectedTask.set(task);
  }

  private startTimer(): void {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.timeRemaining.update(time => time - 1);

      if (this.timeRemaining() <= 0) {
        this.sessionComplete();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private sessionComplete(): void {
    this.stopTimer();
    this.playNotificationSound();

    if (!this.isBreak()) {
      // Work session completed
      this.sessionsCompleted.update(s => s + 1);
      
      // Update task with actual time
      if (this.selectedTask()) {
        const task = this.selectedTask()!;
        const actualTime = (task.actualTime || 0) + this.workDuration();
        this.taskService.updateTask(task.id, { actualTime });
        
        // Add focus session
        this.taskService.addFocusSession({
          taskId: task.id,
          duration: this.workDuration(),
          completedAt: new Date(),
          sessionsCompleted: this.sessionsCompleted(),
        });
      }

      // Start break
      this.isBreak.set(true);
      this.timeRemaining.set(this.breakDuration() * 60);
      this.isRunning.set(true);
      this.startTimer();
    } else {
      // Break completed
      this.isBreak.set(false);
      this.timeRemaining.set(this.workDuration() * 60);
      this.isRunning.set(false);
    }
  }

  private playNotificationSound(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const context = this.audioContext;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification not available');
    }
  }

  getProgressPercentage(): number {
    const total = this.isBreak() 
      ? this.breakDuration() * 60 
      : this.workDuration() * 60;
    
    return 100 - (this.timeRemaining() / total) * 100;
  }
}
