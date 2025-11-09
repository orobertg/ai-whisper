# State Management Specification

**Document:** 09_STATE_MANAGEMENT.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 02_LAYOUT_STRUCTURE.md

---

## Overview

This document specifies the state management architecture, including React Context usage, localStorage integration, custom events, and data flow patterns throughout the application.

---

## State Architecture

### State Layers

```
┌─────────────────────────────────────────┐
│         Global State (Context)           │
│  - Theme (light/dark/translucent)        │
│  - Wallpaper                             │
│  - Theme helper functions                │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Page-Level State (page.tsx)        │
│  - View mode (home/chat/kanban)         │
│  - Selected folder/project              │
│  - Recent chats list                    │
│  - Folders list                          │
│  - Home wallpaper                        │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Component-Level State                │
│  - Form inputs                           │
│  - Expanded sections                     │
│  - Loading states                        │
│  - Local UI states                       │
└─────────────────────────────────────────┘
```

---

## Theme Context (Global State)

### File: `frontend/contexts/ThemeContext.tsx`

### Context Definition

```typescript
export type ThemeMode = 'light' | 'dark' | 'translucent';

interface ThemeContextType {
  // State
  theme: ThemeMode;
  wallpaper: string | null;
  isLight: boolean;
  isDark: boolean;
  isTranslucent: boolean;
  hasWallpaper: boolean;
  
  // Setters
  setTheme: (theme: ThemeMode) => void;
  setWallpaper: (wallpaper: string | null) => void;
  
  // Helper functions for consistent styling
  getCardClass: () => string;
  getInputClass: () => string;
  getButtonClass: (variant?: 'primary' | 'secondary' | 'ghost') => string;
  getTextClass: (variant?: 'primary' | 'secondary' | 'muted') => string;
  getHeaderButtonClass: () => string;
  getSelectClass: () => { isDark: boolean };
  getSidebarClass: () => string;
  getBorderClass: () => string;
  getKanbanColumnClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

### Provider Implementation

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      let savedTheme = localStorage.getItem('systemTheme') || 'light';
      
      // Handle "system" theme
      if (savedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      }
      
      return savedTheme as ThemeMode;
    }
    return 'light'; // SSR default
  });
  
  const [wallpaper, setWallpaperState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wallpaper') || null;
    }
    return null;
  });
  
  // Derived state
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isTranslucent = theme === 'translucent';
  const hasWallpaper = !!wallpaper;
  
  // Theme setter with side effects
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('systemTheme', newTheme);
    
    // Update document class
    document.documentElement.classList.remove('light', 'dark', 'translucent');
    document.documentElement.classList.add(newTheme);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themeChanged'));
  };
  
  // Wallpaper setter with side effects
  const setWallpaper = (newWallpaper: string | null) => {
    setWallpaperState(newWallpaper);
    
    if (newWallpaper) {
      localStorage.setItem('wallpaper', newWallpaper);
    } else {
      localStorage.removeItem('wallpaper');
    }
    
    window.dispatchEvent(new CustomEvent('wallpaperChanged'));
  };
  
  // Helper functions (see 01_THEME_SYSTEM.md for full implementations)
  const getCardClass = () => { /* ... */ };
  const getInputClass = () => { /* ... */ };
  // ... etc
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        wallpaper,
        setWallpaper,
        isLight,
        isDark,
        isTranslucent,
        hasWallpaper,
        getCardClass,
        getInputClass,
        getButtonClass,
        getTextClass,
        getHeaderButtonClass,
        getSelectClass,
        getSidebarClass,
        getBorderClass,
        getKanbanColumnClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

### Hook Usage

```typescript
// In any component
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { 
    isLight, 
    isTranslucent, 
    setTheme, 
    getCardClass 
  } = useTheme();
  
  const cardClass = getCardClass();
  
  return (
    <div className={cardClass}>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

---

## LocalStorage Keys

### Theme & Appearance

```typescript
// Theme
'systemTheme'           // 'light' | 'dark' | 'translucent' | 'system'

// Wallpaper
'wallpaper'            // Base wallpaper (rarely used, prefer chatWallpapers)
'customBackground'     // 'true' | 'false' - Enable custom backgrounds
'chatWallpapers'       // JSON array of wallpaper objects
'selectedWallpaperId'  // ID of currently selected wallpaper
'wallpaperBlur'        // '0' to '20' - Blur amount in pixels
'chatColor'            // 'true' | 'false' - Enable chat colors (future)
```

### Provider Settings (AI Configuration)

```typescript
'ollama_enabled'       // 'true' | 'false'
'ollama_endpoint'      // URL string
'openai_enabled'       // 'true' | 'false'
'openai_apikey'        // API key string
'anthropic_enabled'    // 'true' | 'false'
'anthropic_apikey'     // API key string
// ... similar for other providers
```

### Data Structures

```typescript
// Wallpaper Object
interface Wallpaper {
  id: string;          // Unique ID (timestamp or UUID)
  name: string;        // Display name
  image: string;       // base64 data URL
}

// Stored as JSON string
localStorage.setItem('chatWallpapers', JSON.stringify(wallpapers));
const wallpapers = JSON.parse(localStorage.getItem('chatWallpapers') || '[]');
```

---

## Custom Events

### Event Types

```typescript
// Theme changed
window.dispatchEvent(new CustomEvent('themeChanged'));

// Wallpaper changed (for ThemeContext)
window.dispatchEvent(new CustomEvent('wallpaperChanged'));

// Chat wallpaper changed (for ChatPanel)
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', {
  detail: wallpaperObject || null
}));

// Chats need reload
window.dispatchEvent(new Event('reloadChats'));
```

### Event Listeners

```typescript
useEffect(() => {
  const handleWallpaperChange = (e: CustomEvent) => {
    // Re-load wallpaper from localStorage
    const saved = localStorage.getItem('selectedWallpaperId');
    // ... update state
  };
  
  window.addEventListener('wallpaperChanged', handleWallpaperChange as EventListener);
  
  return () => {
    window.removeEventListener('wallpaperChanged', handleWallpaperChange as EventListener);
  };
}, []);
```

---

## Page-Level State (page.tsx)

### State Variables

```typescript
// View mode
const [viewMode, setViewMode] = useState<'home' | 'chat' | 'mindmap' | 'kanban'>('home');

// Selected items
const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

// Data lists
const [folders, setFolders] = useState<Folder[]>([]);
const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

// Settings
const [showSettings, setShowSettings] = useState(false);
const [settingsTab, setSettingsTab] = useState<'appearance' | 'providers'>('appearance');
const [settingsProvider, setSettingsProvider] = useState<string | undefined>(undefined);

// Wallpaper (home page specific)
const [homeWallpaper, setHomeWallpaper] = useState<string | null>(null);
const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);

// Chat state
const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null);
const [selectedModel, setSelectedModel] = useState("Ollama - Llama 3.2");
const [currentChatHistory, setCurrentChatHistory] = useState<any[]>([]);
```

### Data Loading

```typescript
// Load folders
useEffect(() => {
  const loadFolders = async () => {
    try {
      const response = await fetch('http://localhost:5000/folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Failed to load folders:', error);
      setFolders([]);
    }
  };
  
  loadFolders();
}, []);

// Load recent chats
useEffect(() => {
  const loadRecentChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/chats/recent');
      const data = await response.json();
      setRecentChats(data.chats || []);
    } catch (error) {
      console.error('Failed to load recent chats:', error);
      setRecentChats([]);
    }
  };
  
  loadRecentChats();
}, []);

// Load home wallpaper
useEffect(() => {
  const loadWallpaper = () => {
    const customBg = localStorage.getItem("customBackground");
    if (customBg !== "true") {
      setHomeWallpaper(null);
      return;
    }
    
    const savedSelectedId = localStorage.getItem("selectedWallpaperId");
    const wallpapers = JSON.parse(localStorage.getItem("chatWallpapers") || "[]");
    
    if (wallpapers && Array.isArray(wallpapers)) {
      const selected = wallpapers.find((w: any) => w.id === savedSelectedId);
      setHomeWallpaper(selected?.image || null);
    }
    
    const savedBlur = localStorage.getItem("wallpaperBlur");
    setWallpaperBlur(savedBlur ? Number(savedBlur) : 0);
  };
  
  loadWallpaper();
  
  // Listen for changes
  const handleWallpaperChange = () => loadWallpaper();
  window.addEventListener('wallpaperChanged', handleWallpaperChange);
  
  return () => window.removeEventListener('wallpaperChanged', handleWallpaperChange);
}, []);
```

### State Transitions

```typescript
// Start new chat
const handleNewChat = () => {
  setViewMode('chat');
  setSelectedTemplate(null);
  setCurrentProjectId(null);
  setInitialChatMessage(null);
};

// Start chat with message
const handleStartChat = (message: string) => {
  setViewMode('chat');
  setInitialChatMessage(message);
};

// Select template and create project
const handleSelectTemplate = async (template: Template, folderId?: number | null) => {
  setSelectedTemplate(template);
  setSelectedFolderId(folderId || null);
  
  // Create project in backend
  const response = await fetch('http://localhost:5000/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template_id: template.id,
      folder_id: folderId,
      title: template.name
    })
  });
  
  const data = await response.json();
  setCurrentProjectId(data.project_id);
  setViewMode('chat');
};

// Open existing project
const handleSelectProject = async (projectId: number, mode?: 'chat' | 'mindmap') => {
  setCurrentProjectId(projectId);
  
  // Load project data
  const response = await fetch(`http://localhost:5000/projects/${projectId}`);
  const data = await response.json();
  
  setSelectedTemplate(data.template);
  setViewMode(mode || 'chat');
};

// Navigate to home
const handleGoHome = () => {
  setViewMode('home');
  setSelectedTemplate(null);
  setCurrentProjectId(null);
};

// Open settings
const handleOpenSettings = (provider?: string) => {
  setShowSettings(true);
  setSettingsTab(provider ? 'providers' : 'appearance');
  setSettingsProvider(provider);
};
```

---

## Component-Level State

### Form State Pattern

```typescript
// In Settings.tsx
const [theme, setTheme] = useState<Theme>("system");
const [customBackground, setCustomBackground] = useState(false);
const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
const [hasChanges, setHasChanges] = useState(false);

// Track changes
const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);
  setHasChanges(true);
};

// Save to localStorage
const handleSave = () => {
  localStorage.setItem('systemTheme', theme);
  localStorage.setItem('customBackground', String(customBackground));
  localStorage.setItem('chatWallpapers', JSON.stringify(wallpapers));
  setHasChanges(false);
  
  // Dispatch events
  window.dispatchEvent(new CustomEvent('themeChanged'));
};
```

### UI State Pattern

```typescript
// In HomeContent.tsx
const [expandedAction, setExpandedAction] = useState<string | null>(null);
const [chatInput, setChatInput] = useState("");

const handleActionClick = (actionId: string) => {
  setExpandedAction(expandedAction === actionId ? null : actionId);
};

const handleSend = () => {
  if (chatInput.trim()) {
    onStartChat(chatInput);
    setChatInput("");
  }
};
```

### Loading State Pattern

```typescript
// In Sidebar.tsx
const [loading, setLoading] = useState(true);
const [folders, setFolders] = useState<Folder[]>([]);

useEffect(() => {
  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await fetchFolders();
      setFolders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  loadFolders();
}, []);

// In render
{loading ? <LoadingSpinner /> : <FolderList folders={folders} />}
```

---

## Data Flow Patterns

### Top-Down Data Flow

```
page.tsx (source of truth)
   ↓
   ├→ Sidebar (receives recentChats, folders, selectedFolderId)
   ├→ HomeContent (receives recentChats, folders, hasWallpaper)
   └→ ChatPanel (receives template, selectedModel)
```

### Bottom-Up Event Flow

```
HomeContent
   ↓ onStartChat(message)
page.tsx
   ↓ setInitialChatMessage(message)
   ↓ setViewMode('chat')
ChatPanel (receives initialMessage)
```

### Sideways Communication (via Events)

```
Settings.tsx
   ↓ Save wallpaper
   ↓ dispatchEvent('wallpaperChanged')
   ↓
   ├→ page.tsx (listens, updates homeWallpaper)
   └→ ChatPanel.tsx (listens, updates chatWallpaper)
```

---

## State Persistence

### What Gets Persisted

**localStorage:**
- Theme preference
- Wallpaper settings
- AI provider configuration
- User preferences

**Backend (via API):**
- Projects/chats
- Folders
- Chat history
- Mind map data

### What Doesn't Get Persisted

**Session-only:**
- Current view mode
- Expanded UI sections
- Form inputs (unsaved)
- Loading states

---

## State Synchronization

### Theme Sync Pattern

```typescript
// Settings.tsx saves to localStorage
localStorage.setItem('systemTheme', 'dark');

// Dispatch event
window.dispatchEvent(new CustomEvent('themeChanged'));

// ThemeContext updates
setTheme('dark');

// Document class updates
document.documentElement.classList.add('dark');

// All components re-render with new theme
```

### Wallpaper Sync Pattern

```typescript
// Settings.tsx saves wallpaper
const wallpaper = { id: '123', name: 'Nature', image: 'data:...' };
localStorage.setItem('chatWallpapers', JSON.stringify([wallpaper]));
localStorage.setItem('selectedWallpaperId', '123');

// Dispatch events
window.dispatchEvent(new CustomEvent('wallpaperChanged'));
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { detail: wallpaper }));

// page.tsx updates
setHomeWallpaper(wallpaper.image);

// ChatPanel.tsx updates
setChatWallpaper(wallpaper.image);
```

---

## Error Handling

### API Error Pattern

```typescript
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  try {
    const response = await fetch('http://localhost:5000/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setData(data);
    setError(null);
  } catch (err) {
    console.error('Failed to load data:', err);
    setError(err instanceof Error ? err.message : 'Failed to load data');
  }
};

// In render
{error && (
  <div className="p-4 bg-red-100 border border-red-400 rounded">
    {error}
  </div>
)}
```

### LocalStorage Error Pattern

```typescript
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return fallback;
  }
};

const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return false;
  }
};
```

---

## Testing State Management

### Test Checklist

**Context:**
- [ ] Theme persists across refresh
- [ ] Theme changes propagate to all components
- [ ] Helper functions return correct classes
- [ ] SSR default matches client hydration

**LocalStorage:**
- [ ] Settings save correctly
- [ ] Settings load on mount
- [ ] Corrupted data handled gracefully
- [ ] Missing keys handled gracefully

**Events:**
- [ ] Events dispatch at correct times
- [ ] Listeners receive events
- [ ] Cleanup removes listeners
- [ ] No memory leaks

**State Flow:**
- [ ] Top-down props work
- [ ] Bottom-up callbacks work
- [ ] Sideways events work
- [ ] No circular dependencies

---

## Next Document

Proceed to **11_STYLING_REFERENCE.md** for complete styling class reference.

