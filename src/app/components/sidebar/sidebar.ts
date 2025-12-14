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
  private _isOpen: boolean = true;

  @Input()
  set isOpen(value: boolean) {
    console.log('isOpen input changed to:', value);
    this._isOpen = value;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  debugText = ''; // For debug display

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
    console.log('=== selectView called ===');
    console.log('viewId:', viewId);
    console.log('isOpen before emit:', this.isOpen);
    this.currentView = viewId;
    console.log('currentView set to:', this.currentView);
    console.log('About to emit viewChange...');
    this.viewChange.emit(viewId);
    console.log('viewChange emitted');
    // Auto-close sidebar on mobile after selecting view (with small delay)
    setTimeout(() => {
      console.log('About to emit toggleSidebar after 100ms...');
      this.toggleSidebar.emit();
      console.log('toggleSidebar emitted');
    }, 100);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
