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
  // Start closed on mobile, open on desktop
  isSidebarOpen = signal(window.innerWidth >= 1024);
  currentView = signal<'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'>('dashboard');

  constructor(public themeService: ThemeService) {
    // Listen to window resize to adjust sidebar visibility
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        // Desktop: always open sidebar
        this.isSidebarOpen.set(true);
      }
    });
  }

  toggleSidebar(): void {
    console.log('toggleSidebar called, current isSidebarOpen:', this.isSidebarOpen());
    this.isSidebarOpen.set(!this.isSidebarOpen());
    console.log('isSidebarOpen is now:', this.isSidebarOpen());
  }

  changeView(view: 'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'): void {
    console.log('changeView called with:', view);
    this.currentView.set(view);
    console.log('currentView updated to:', this.currentView());
  }
}
