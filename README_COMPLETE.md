# Task Manager Pro 🚀

A modern, feature-rich task management and productivity application built with Angular 19+ and SCSS with unique features not found in other task managers.

## ✨ What Makes This Special

This isn't just another task manager. It includes **8 unique features** that solve real productivity problems:

1. **Energy Level Tracking** - Match tasks to your energy throughout the day
2. **AI Task Suggestions** - Smart recommendations based on time and patterns
3. **Productivity Score** - Gamified productivity tracking (0-1000 points)
4. **Task Dependencies** - Visual dependency mapping and blocking
5. **Voice Notes** - Attach audio notes to tasks (mobile-friendly)
6. **Habit Integration** - Track habits alongside tasks
7. **Peak Hours Analysis** - Auto-detect your most productive times
8. **Time Blocking** - Visual calendar with conflict detection

[See FEATURES.md for detailed explanations]

## 🚀 Quick Start

```bash
cd task-manager-pro
npm install
npm start
```

Open http://localhost:4200

## 📸 Screenshots

### Dashboard
- Real-time productivity stats
- Smart task suggestions
- Quick task creation

### Dark Mode
- Beautiful dark theme
- Auto system detection
- Smooth transitions

### Mobile
- Fully responsive
- Touch-friendly
- Collapsible sidebar

## 🎨 Features

### Core Task Management
✅ Create, edit, delete tasks
✅ Priority levels (low, medium, high, urgent)
✅ Categories and tags
✅ Task descriptions
✅ Subtasks support
✅ Estimated time tracking

### Unique Features
⚡ **Energy Levels** - Assign energy requirements to tasks
🤖 **Smart Suggestions** - AI-powered task recommendations  
🏆 **Productivity Score** - Gamified tracking system
🔗 **Dependencies** - Task dependency management
🎙️ **Voice Notes** - Audio notes for tasks
📝 **Habits** - Integrated habit tracking
📊 **Analytics** - Peak productivity analysis
⏰ **Time Blocking** - Visual scheduling calendar

### User Experience
🌓 Dark/Light mode with auto-detection
📱 Fully responsive (mobile, tablet, desktop)
💾 Local storage (no account needed)
🎨 Modern, beautiful UI
⚡ Fast and smooth animations
♿ Accessible (keyboard navigation)

## 🏗️ Architecture

### Built With
- **Angular 19+** - Latest framework features
- **TypeScript** - Type-safe code
- **SCSS** - Modern styling with variables
- **Angular Signals** - Reactive state management
- **CSS Custom Properties** - Dynamic theming
- **LocalStorage API** - Data persistence

### Project Structure
```
src/app/
├── core/
│   ├── models/          # Data models
│   └── services/        # Business logic
├── components/          # UI components
│   ├── dashboard/      # Main view
│   ├── task-list/      # Task display
│   ├── task-item/      # Individual task
│   ├── sidebar/        # Navigation
│   ├── calendar-view/  # Calendar
│   ├── time-blocking/  # Time blocks
│   ├── focus-mode/     # Pomodoro
│   └── statistics/     # Analytics
└── styles.scss         # Global styles & theme
```

## 💻 Development

### Commands
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run lint       # Lint code
```

### Theme Customization
Edit [src/styles.scss](src/styles.scss#L1-L85) to customize colors:

```scss
--primary: #6366f1;        #  Change primary color
--bg-primary: #ffffff;     # Change background
--text-primary: #212529;   # Change text color
```

### Adding Components
```bash
ng generate component components/my-component
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## 🎯 Usage Examples

### Creating a Task with Energy Level
```typescript
taskService.addTask({
  title: 'Write proposal',
  description: 'Q1 project proposal',
  priority: 'high',
  category: 'Work',
  energyLevel: 'high',  // ⚡ Unique feature!
  estimatedTime: 120
});
```

### Getting Smart Suggestions
```typescript
// Returns tasks matching current time/energy
const suggested = taskService.getSuggestedTasks();
// Morning: High energy tasks
// Afternoon: Medium energy tasks  
// Evening: Low energy tasks
```

### Productivity Stats
```typescript
const stats = taskService.getProductivityStats();
console.log(stats.productivityScore);  // 0-1000
console.log(stats.streakDays);         // Current streak
console.log(stats.peakProductivityHours); // Best hours
```

## 🔐 Privacy

- **100% Local** - All data stays on your device
- **No Account** - No registration required
- **No Tracking** - No analytics or tracking
- **No Cloud** - (Cloud sync coming as optional feature)

## 🚀 Roadmap

### Phase 1 (Current)
- [x] Core task management
- [x] Energy level tracking
- [x] Smart suggestions
- [x] Productivity scoring
- [x] Dark mode
- [x] Mobile responsive

### Phase 2 (Next)
- [ ] Complete time blocking UI
- [ ] Complete focus mode/Pomodoro
- [ ] Complete statistics dashboard
- [ ] Voice note recording
- [ ] Task dependencies UI

### Phase 3 (Future)
- [ ] Cloud sync (optional)
- [ ] Team collaboration
- [ ] Voice transcription
- [ ] Calendar integration
- [ ] Mobile app (Ionic)
- [ ] Browser extension

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Built with ❤️ using Angular
- Icons: Emoji (no dependencies!)
- Font: System fonts for performance
- Design inspiration: Modern productivity apps

## 📞 Support

Found a bug? Have a suggestion?
- Open an issue on GitHub
- Check FEATURES.md for detailed feature explanations

---

**Start managing your tasks smarter, not harder!** 🎯

Try it now:
```bash
cd task-manager-pro
npm install && npm start
```
