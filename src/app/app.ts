import { Component, signal } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CalendarViewComponent } from './components/calendar-view/calendar-view';
import { TimeBlockingComponent } from './components/time-blocking/time-blocking';
import { FocusModeComponent } from './components/focus-mode/focus-mode';
import { StatisticsComponent } from './components/statistics/statistics';
import { ThemeService } from './core/services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    SidebarComponent,
    DashboardComponent,
    CalendarViewComponent,
    TimeBlockingComponent,
    FocusModeComponent,
    StatisticsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Task Manager Pro');
  isSidebarOpen = signal(true);
  currentView = signal<'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'>('dashboard');

  constructor(public themeService: ThemeService) {}

  toggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  changeView(view: 'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'): void {
    this.currentView.set(view);
  }
}
