"use client";
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
  
  // Helper functions for consistent styling
  getCardClass: () => string;
  getInputClass: () => string;
  getButtonClass: (variant?: 'primary' | 'secondary') => string;
  getTextClass: (variant?: 'primary' | 'secondary' | 'muted') => string;
  getBadgeClass: (color: 'red' | 'orange' | 'green' | 'blue' | 'purple') => string;
  
  // Kanban-specific helpers
  getKanbanColumnClass: () => string;
  getKanbanCardClass: () => string;
  getPriorityBadgeClass: (priority: 'low' | 'medium' | 'high') => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage immediately (client-side only)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('systemTheme') as ThemeMode) || 'dark';
    }
    return 'dark';
  });
  
  // Initialize wallpaper from localStorage immediately (client-side only)
  const [wallpaper, setWallpaperState] = useState<Wallpaper | null>(() => {
    if (typeof window !== 'undefined') {
      const savedWallpapers = localStorage.getItem('chatWallpapers');
      const savedSelectedId = localStorage.getItem('selectedWallpaperId');
      const customBackground = localStorage.getItem('customBackground') === 'true';
      
      if (customBackground && savedWallpapers && savedSelectedId) {
        try {
          const wallpapers = JSON.parse(savedWallpapers);
          const selected = wallpapers.find((w: any) => w.id === savedSelectedId);
          return selected || null;
        } catch (e) {
          console.error('Failed to load wallpaper:', e);
        }
      }
    }
    return null;
  });
  
  // Listen for theme/wallpaper changes
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('systemTheme') as ThemeMode || 'dark';
      setThemeState(newTheme);
    };
    
    const handleWallpaperChange = () => {
      const savedWallpapers = localStorage.getItem('chatWallpapers');
      const savedSelectedId = localStorage.getItem('selectedWallpaperId');
      const customBackground = localStorage.getItem('customBackground') === 'true';
      
      if (customBackground && savedWallpapers && savedSelectedId) {
        try {
          const wallpapers = JSON.parse(savedWallpapers);
          const selected = wallpapers.find((w: any) => w.id === savedSelectedId);
          if (selected) {
            setWallpaperState(selected);
          } else {
            setWallpaperState(null);
          }
        } catch (e) {
          console.error('Failed to load wallpaper:', e);
          setWallpaperState(null);
        }
      } else {
        setWallpaperState(null);
      }
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('wallpaperChanged', handleWallpaperChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('wallpaperChanged', handleWallpaperChange);
    };
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
      : 'bg-zinc-900/50 border-zinc-800';
  };
  
  const getInputClass = () => {
    if (hasWallpaper) {
      return isLight
        ? 'bg-white/95 backdrop-blur-sm border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-lg'
        : 'bg-zinc-900/90 backdrop-blur-md border-white/20 text-white placeholder-zinc-500 shadow-xl';
    }
    return isLight
      ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
      : 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600';
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
      : 'bg-zinc-900 border-zinc-700 text-gray-300 hover:bg-zinc-800';
  };
  
  const getTextClass = (variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
    if (variant === 'muted') {
      return isLight ? 'text-zinc-500' : 'text-zinc-500';
    }
    if (variant === 'secondary') {
      return isLight ? 'text-zinc-700' : 'text-zinc-400';
    }
    return isLight ? 'text-zinc-900' : 'text-zinc-100';
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

