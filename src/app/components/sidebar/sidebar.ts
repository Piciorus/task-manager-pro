import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() viewChange = new EventEmitter<'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'>();
  @Output() toggleSidebar = new EventEmitter<void>();

  currentView: 'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics' = 'dashboard';

  menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: '📊' },
    { id: 'calendar' as const, label: 'Calendar', icon: '📅' },
    { id: 'time-blocking' as const, label: 'Time Blocking', icon: '⏰' },
    { id: 'focus' as const, label: 'Focus Mode', icon: '🎯' },
    { id: 'statistics' as const, label: 'Statistics', icon: '📈' },
  ];

  constructor(public themeService: ThemeService) {}

  selectView(viewId: 'dashboard' | 'calendar' | 'time-blocking' | 'focus' | 'statistics'): void {
    this.currentView = viewId;
    this.viewChange.emit(viewId);
    // Auto-close sidebar on mobile after selecting view (with small delay)
    setTimeout(() => {
      this.toggleSidebar.emit();
    }, 100);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
