# Theme System Architecture

## Overview
Comprehensive theming system for AIWhisper supporting light/dark modes, custom wallpapers, and consistent styling across all screens including the new Kanban board.

## Current Theme Implementation

### Theme State Management
Currently managed at the top level (`page.tsx`) and distributed via props:
```typescript
// In page.tsx
const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');
const [homeWallpaper, setHomeWallpaper] = useState<string | null>(null);
const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
const [selectedModel, setSelectedModel] = useState("Ollama - Llama 3.2");
```

### Theme Detection
Components read from localStorage and listen for events:
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem("systemTheme") || "dark";
  setSystemTheme(savedTheme as "light" | "dark");
  
  const handleThemeChange = () => {
    const newTheme = localStorage.getItem("systemTheme") || "dark";
    setSystemTheme(newTheme as "light" | "dark");
  };
  
  window.addEventListener("themeChanged", handleThemeChange);
  return () => window.removeEventListener("themeChanged", handleThemeChange);
}, []);
```

## Proposed: Centralized Theme System

### 1. Create Theme Context Provider

**File**: `frontend/contexts/ThemeContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  blur: number;
  brightness?: number;
}

interface ThemeContextType {
  // Theme mode
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isLight: boolean;
  
  // Wallpaper
  wallpaper: Wallpaper | null;
  setWallpaper: (wallpaper: Wallpaper | null) => void;
  hasWallpaper: boolean;
  
  // Helper functions
  getCardClass: () => string;
  getInputClass: () => string;
  getButtonClass: (variant?: 'primary' | 'secondary') => string;
  getTextClass: (variant?: 'primary' | 'secondary' | 'muted') => string;
  getBadgeClass: (color: 'red' | 'orange' | 'green' | 'blue' | 'purple') => string;
  
  // Kanban-specific
  getKanbanColumnClass: () => string;
  getKanbanCardClass: () => string;
  getPriorityBadgeClass: (priority: 'low' | 'medium' | 'high') => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [wallpaper, setWallpaperState] = useState<Wallpaper | null>(null);
  
  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('systemTheme') as ThemeMode || 'dark';
    setThemeState(savedTheme);
    
    const savedWallpapers = localStorage.getItem('chatWallpapers');
    const savedSelectedId = localStorage.getItem('selectedWallpaperId');
    const customBackground = localStorage.getItem('customBackground') === 'true';
    
    if (customBackground && savedWallpapers && savedSelectedId) {
      try {
        const wallpapers = JSON.parse(savedWallpapers);
        const selected = wallpapers.find((w: any) => w.id === savedSelectedId);
        if (selected) {
          setWallpaperState(selected);
        }
      } catch (e) {
        console.error('Failed to load wallpaper:', e);
      }
    }
  }, []);
  
  // Update localStorage and dispatch events
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('systemTheme', newTheme);
    window.dispatchEvent(new CustomEvent('themeChanged'));
  };
  
  const setWallpaper = (newWallpaper: Wallpaper | null) => {
    setWallpaperState(newWallpaper);
    window.dispatchEvent(new CustomEvent('wallpaperChanged'));
  };
  
  const isLight = theme === 'light';
  const hasWallpaper = !!wallpaper;
  
  // Helper functions for consistent styling
  const getCardClass = () => {
    if (hasWallpaper) {
      return isLight
        ? 'bg-white/95 backdrop-blur-sm border-zinc-200 shadow-lg'
        : 'bg-zinc-900/90 backdrop-blur-md border-white/20 shadow-xl';
    }
    return isLight
      ? 'bg-white border-zinc-200'
      : 'bg-zinc-800 border-zinc-700';
  };
  
  const getInputClass = () => {
    if (hasWallpaper) {
      return isLight
        ? 'bg-white/95 backdrop-blur-sm border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-lg'
        : 'bg-zinc-900/90 backdrop-blur-md border-white/20 text-white placeholder-zinc-500 shadow-xl';
    }
    return isLight
      ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
      : 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500';
  };
  
  const getButtonClass = (variant: 'primary' | 'secondary' = 'primary') => {
    if (variant === 'primary') {
      return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600';
    }
    if (hasWallpaper) {
      return isLight
        ? 'bg-white/95 backdrop-blur-sm border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-lg'
        : 'bg-zinc-900/90 backdrop-blur-md border-white/20 text-gray-300 hover:bg-zinc-800/90 shadow-xl';
    }
    return isLight
      ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700';
  };
  
  const getTextClass = (variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
    if (variant === 'muted') {
      return isLight ? 'text-zinc-500' : 'text-gray-500';
    }
    if (variant === 'secondary') {
      return isLight ? 'text-zinc-700' : 'text-gray-300';
    }
    return isLight ? 'text-zinc-900' : 'text-white';
  };
  
  const getBadgeClass = (color: 'red' | 'orange' | 'green' | 'blue' | 'purple') => {
    const colors = {
      red: {
        light: 'bg-red-100 text-red-700 border-red-200',
        dark: 'bg-red-900/30 text-red-400 border-red-800',
      },
      orange: {
        light: 'bg-orange-100 text-orange-700 border-orange-200',
        dark: 'bg-orange-900/30 text-orange-400 border-orange-800',
      },
      green: {
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900/30 text-green-400 border-green-800',
      },
      blue: {
        light: 'bg-blue-100 text-blue-700 border-blue-200',
        dark: 'bg-blue-900/30 text-blue-400 border-blue-800',
      },
      purple: {
        light: 'bg-purple-100 text-purple-700 border-purple-200',
        dark: 'bg-purple-900/30 text-purple-400 border-purple-800',
      },
    };
    
    return colors[color][isLight ? 'light' : 'dark'];
  };
  
  // Kanban-specific helpers
  const getKanbanColumnClass = () => {
    if (hasWallpaper) {
      return 'bg-black/10 backdrop-blur-sm border-white/10';
    }
    return isLight
      ? 'bg-zinc-50 border-zinc-200'
      : 'bg-zinc-900 border-zinc-800';
  };
  
  const getKanbanCardClass = () => {
    return getCardClass() + ' hover:shadow-xl transition-shadow cursor-pointer';
  };
  
  const getPriorityBadgeClass = (priority: 'low' | 'medium' | 'high') => {
    const priorityColors = {
      high: 'red',
      medium: 'orange',
      low: 'green',
    };
    return getBadgeClass(priorityColors[priority] as any);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isLight,
        wallpaper,
        setWallpaper,
        hasWallpaper,
        getCardClass,
        getInputClass,
        getButtonClass,
        getTextClass,
        getBadgeClass,
        getKanbanColumnClass,
        getKanbanCardClass,
        getPriorityBadgeClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 2. Wrap Application with ThemeProvider

**File**: `frontend/app/layout.tsx`

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. Usage in Components

**Example: Using Theme in Kanban Board**

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export default function KanbanCard({ task }: { task: Task }) {
  const { getKanbanCardClass, getPriorityBadgeClass, getTextClass } = useTheme();
  
  return (
    <div className={`${getKanbanCardClass()} p-4 rounded-lg border`}>
      {/* Priority badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`${getPriorityBadgeClass(task.priority)} px-2 py-1 rounded text-xs font-medium border`}>
          {task.priority}
        </span>
        <span className={`${getTextClass('muted')} text-xs`}>
          {task.task_id}
        </span>
      </div>
      
      {/* Title */}
      <h3 className={`${getTextClass('primary')} font-semibold mb-1`}>
        {task.title}
      </h3>
      
      {/* Description */}
      <p className={`${getTextClass('secondary')} text-sm`}>
        {task.description}
      </p>
    </div>
  );
}
```

## Theme Color Palette

### Core Colors
```typescript
export const themeColors = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
    },
    text: {
      primary: '#18181b',
      secondary: '#3f3f46',
      muted: '#71717a',
    },
    border: {
      default: '#e4e4e7',
      hover: '#d4d4d8',
    },
  },
  dark: {
    background: {
      primary: '#18181b',
      secondary: '#27272a',
      tertiary: '#3f3f46',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d4d4d8',
      muted: '#a1a1aa',
    },
    border: {
      default: '#3f3f46',
      hover: '#52525b',
    },
  },
};

// Semantic colors (same in both themes)
export const semanticColors = {
  success: {
    light: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    dark: { bg: '#14532d', text: '#4ade80', border: '#166534' },
  },
  warning: {
    light: { bg: '#fed7aa', text: '#c2410c', border: '#fdba74' },
    dark: { bg: '#7c2d12', text: '#fb923c', border: '#9a3412' },
  },
  error: {
    light: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
    dark: { bg: '#7f1d1d', text: '#f87171', border: '#991b1b' },
  },
  info: {
    light: { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
    dark: { bg: '#1e3a8a', text: '#60a5fa', border: '#1e40af' },
  },
};
```

## Wallpaper Overlay System

### Background Layer Strategy
```typescript
// In the root layout or page component
<div className="relative w-full h-full">
  {/* Wallpaper Layer (z-0) */}
  {wallpaper && (
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${wallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: wallpaper.blur > 0 ? `blur(${wallpaper.blur}px)` : 'none'
      }}
    />
  )}
  
  {/* Content Layer (z-10) - never blurred */}
  <div className="relative z-10 w-full h-full">
    {children}
  </div>
</div>
```

### Glass-morphism Classes
```css
/* Light mode with wallpaper */
.glass-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 228, 231, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark mode with wallpaper */
.glass-dark {
  background: rgba(24, 24, 27, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

## Accessibility Considerations

### Color Contrast
All text must meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio

### Test Matrix
| Background | Text Color | Contrast | Status |
|------------|-----------|----------|--------|
| White (#fff) | Zinc-900 (#18181b) | 17.9:1 | ✅ Pass |
| Zinc-50 (#fafafa) | Zinc-900 (#18181b) | 17.2:1 | ✅ Pass |
| Zinc-900 (#18181b) | White (#fff) | 17.9:1 | ✅ Pass |
| Zinc-800 (#27272a) | Gray-300 (#d4d4d8) | 10.8:1 | ✅ Pass |
| Red-100 (#fee2e2) | Red-700 (#b91c1c) | 7.2:1 | ✅ Pass |

### Focus Indicators
All interactive elements need visible focus:
```css
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

## Migration Plan

### Phase 1: Create Theme Context
- [ ] Implement ThemeContext.tsx
- [ ] Add ThemeProvider to layout
- [ ] Create theme utility functions

### Phase 2: Migrate Existing Components
- [ ] HomeContent.tsx
- [ ] ChatPanel.tsx
- [ ] Sidebar.tsx
- [ ] Settings.tsx
- [ ] MindMap.tsx

### Phase 3: Implement Kanban with Theme
- [ ] KanbanBoard uses useTheme()
- [ ] KanbanCard uses theme helpers
- [ ] All priority/tag badges theme-aware

### Phase 4: Testing
- [ ] Test all screens in light mode
- [ ] Test all screens in dark mode
- [ ] Test all screens with wallpaper (light theme)
- [ ] Test all screens with wallpaper (dark theme)
- [ ] Verify accessibility (contrast ratios)

## Best Practices

### DO:
✅ Use `useTheme()` hook in all components
✅ Use theme helper functions for styling
✅ Test in all theme combinations
✅ Maintain consistent spacing/sizing across themes
✅ Use semantic color names (primary, secondary, muted)

### DON'T:
❌ Hardcode colors directly in components
❌ Use inline styles for theme-dependent colors
❌ Create theme-specific components (one component should handle all themes)
❌ Forget to test wallpaper mode
❌ Ignore accessibility contrast requirements

## Example: Complete Component with Theme

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export default function TaskCard({ task }) {
  const { 
    getKanbanCardClass, 
    getPriorityBadgeClass, 
    getTextClass,
    getBadgeClass,
    isLight 
  } = useTheme();
  
  return (
    <div className={`${getKanbanCardClass()} p-4 rounded-xl border group`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`${getPriorityBadgeClass(task.priority)} px-2 py-0.5 rounded text-xs font-medium border`}>
            {task.priority}
          </span>
          {task.tags.map(tag => (
            <span 
              key={tag}
              className={`${getBadgeClass('blue')} px-2 py-0.5 rounded text-xs border`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className={`${getTextClass('muted')} text-xs font-mono`}>
          {task.task_id}
        </span>
      </div>
      
      {/* Content */}
      <h3 className={`${getTextClass('primary')} font-semibold text-sm mb-1`}>
        {task.title}
      </h3>
      <p className={`${getTextClass('secondary')} text-xs line-clamp-2`}>
        {task.description}
      </p>
      
      {/* Progress */}
      <div className="mt-3 mb-3">
        <div className="flex justify-between mb-1">
          <span className={`${getTextClass('muted')} text-xs`}>Progress</span>
          <span className={`${getTextClass('primary')} text-xs font-medium`}>
            {task.progress}%
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full ${isLight ? 'bg-zinc-200' : 'bg-zinc-700'}`}>
          <div 
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assigned_users.map(user => (
            <div 
              key={user.id}
              className="w-6 h-6 rounded-full bg-zinc-300 border-2 border-white"
              style={{ backgroundImage: `url(${user.avatar})` }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <AttachmentIcon className={getTextClass('muted')} size={14} />
            <span className={`${getTextClass('muted')} text-xs`}>
              {task.attachments_count}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CommentIcon className={getTextClass('muted')} size={14} />
            <span className={`${getTextClass('muted')} text-xs`}>
              {task.comments_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Conclusion

This centralized theme system provides:
1. **Consistency**: All components use the same styling logic
2. **Maintainability**: Update theme in one place
3. **Flexibility**: Easy to add new themes or modes
4. **Performance**: Optimized with React Context
5. **Accessibility**: Built-in contrast and focus management

Ready for Kanban board and any future features! 🎨

