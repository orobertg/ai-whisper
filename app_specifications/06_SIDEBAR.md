# Sidebar Specification

**Document:** 06_SIDEBAR.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 03_STYLING_ARCHITECTURE.md

---

## Overview

The Sidebar (`Sidebar.tsx`) provides navigation between views, folder management, and recent chat access. It's collapsible on mobile and uses theme-aware styling with glassmorphism in translucent mode.

---

## Component Structure

### File: `frontend/components/Sidebar.tsx`

### Props Interface

```typescript
type SidebarProps = {
  onNewChat: () => void;
  onSelectFolder: (folderId: number | null) => void;
  onSelectProject: (projectId: number, mode?: 'chat' | 'mindmap') => void;
  selectedFolderId: number | null;
  currentProjectId?: number;
  recentChats?: RecentChat[];
  onReloadChats?: () => void;
  onToggleSidebar?: () => void;
  onGoHome?: () => void;
  onNavigateToKanban?: () => void;
  showChat?: boolean;
  nodes?: Node[];
  edges?: Edge[];
  template?: Template | null;
  progressMetrics?: ProgressMetrics;
  onToggleChatFocus?: () => void;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  currentMindMapId?: number;
  currentProjectTitle?: string;
  onProjectRename?: (newTitle: string) => void;
  onChatHistoryUpdate?: (history: any[]) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
};
```

### Layout Structure

```
┌──────────────────┐
│   [AI Whisper]   │ Logo/Title
├──────────────────┤
│ 🏠 Home          │ Navigation
│ 📊 Kanban Board  │
├──────────────────┤
│ FOLDERS          │ Section Header
│ 📁 All           │ Folder List
│ 📁 Work          │
│ 📁 Personal      │
│ 📁 Archive       │
├──────────────────┤
│ RECENT CHATS     │ Section Header
│ 💬 SaaS App...   │ Chat List
│ 💬 Mobile App... │ (max 10)
│ 💬 Android...    │
└──────────────────┘
```

### Theme Integration

```typescript
const { isLight, isTranslucent, getSidebarClass, getBorderClass, getTextClass } = useTheme();

const sidebarClass = getSidebarClass(); // bg, border based on theme
const borderClass = getBorderClass();   // border color
const textPrimary = getTextClass('primary');
const textSecondary = getTextClass('secondary');
```

### State Management

```typescript
const [isCollapsed, setIsCollapsed] = useState(false);
const [folders, setFolders] = useState<Folder[]>([]);
const [loading, setLoading] = useState(true);
```

---

## Visual Styling

### Sidebar Container

```typescript
<aside className={`
  ${isCollapsed ? 'w-0' : 'w-64'} 
  ${sidebarClass} 
  ${borderClass} 
  border-r 
  transition-all 
  duration-300 
  flex 
  flex-col 
  h-screen 
  overflow-hidden
  md:relative 
  md:w-64
`}>
```

**Key Classes:**
- Width: `w-64` (256px) on desktop
- Collapsible: `w-0` when collapsed on mobile
- Border: Right border with theme color
- Full Height: `h-screen`
- Smooth Transition: `transition-all duration-300`

### Translucent Theme Sidebar

```typescript
// From ThemeContext getSidebarClass()
if (isTranslucent) {
  return 'bg-zinc-900/50 backdrop-blur-2xl border-zinc-800';
}
```

**Styling:**
- Background: `bg-zinc-900/50` (50% opacity dark)
- Blur: `backdrop-blur-2xl` for frosted glass
- Border: `border-zinc-800` subtle dark border

---

## Navigation Sections

### 1. Logo/Header

```tsx
<div className="p-4 border-b ${borderClass}">
  <button 
    onClick={onGoHome}
    className="flex items-center gap-2 w-full"
  >
    <AiNetworkIcon size={24} className="text-blue-500" />
    <span className={`text-lg font-bold ${textPrimary}`}>
      AI Whisper
    </span>
  </button>
</div>
```

### 2. Main Navigation

```tsx
<nav className="p-2">
  <button
    onClick={onGoHome}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg
      transition-colors ${textPrimary}
      ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'}
    `}
  >
    <Home01Icon size={20} />
    <span>Home</span>
  </button>
  
  <button
    onClick={onNavigateToKanban}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg
      transition-colors ${textPrimary}
      ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'}
    `}
  >
    <ViewIcon size={20} />
    <span>Kanban Board</span>
  </button>
</nav>
```

### 3. Folders Section

```tsx
<div className="flex-1 overflow-y-auto px-2">
  <div className={`text-xs font-semibold px-3 py-2 ${textSecondary}`}>
    FOLDERS
  </div>
  
  <button
    onClick={() => onSelectFolder(null)}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg
      transition-colors ${textPrimary}
      ${selectedFolderId === null 
        ? (isLight ? 'bg-blue-50 text-blue-700' : 'bg-zinc-800 text-white')
        : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800')
      }
    `}
  >
    <Folder01Icon size={18} />
    <span>All</span>
  </button>
  
  {folders.map((folder) => (
    <button
      key={folder.id}
      onClick={() => onSelectFolder(folder.id)}
      className={/* similar styling */}
    >
      {getFolderIcon(folder.name)}
      <span>{folder.name}</span>
    </button>
  ))}
</div>
```

**Folder Icon Mapping:**
```typescript
const getFolderIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "work":
      return <Briefcase01Icon size={18} />;
    case "personal":
      return <Home01Icon size={18} />;
    case "archive":
      return <Archive01Icon size={18} />;
    default:
      return <Folder01Icon size={18} />;
  }
};
```

### 4. Recent Chats Section

```tsx
<div className={`border-t ${borderClass} px-2 py-4`}>
  <div className="flex items-center justify-between px-3 mb-2">
    <span className={`text-xs font-semibold ${textSecondary}`}>
      RECENT CHATS
    </span>
    <button 
      onClick={onReloadChats}
      className="p-1 rounded hover:bg-zinc-800"
    >
      <RefreshIcon size={14} />
    </button>
  </div>
  
  {loading ? (
    <div className="text-center py-4">
      <LoadingSpinner />
    </div>
  ) : recentChats.length === 0 ? (
    <div className="text-center py-8 text-xs text-zinc-500">
      No chats yet
    </div>
  ) : (
    recentChats.slice(0, 10).map((chat) => (
      <button
        key={chat.id}
        onClick={() => onSelectProject(chat.id, 'chat')}
        className={`
          w-full text-left px-3 py-2 rounded-lg mb-1
          transition-colors ${textPrimary}
          ${currentProjectId === chat.id
            ? (isLight ? 'bg-blue-50' : 'bg-zinc-800')
            : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800')
          }
        `}
      >
        <div className="flex items-center gap-2 mb-1">
          <BubbleChatIcon size={14} className="flex-shrink-0" />
          <span className="text-xs truncate flex-1">
            {getShortenedTitle(chat.title)}
          </span>
        </div>
        <span className="text-xs text-zinc-500">
          {getTimeAgo(chat.updated_at)}
        </span>
      </button>
    ))
  )}
</div>
```

**Title Shortening:**
```typescript
const getShortenedTitle = (title: string) => {
  let shortened = title
    .replace(/^Chat - /, '')
    .replace(/^\d+\/\d+\/\d+/, '')
    .replace(/^\d+:\d+\s+(AM|PM)/, '')
    .trim();
  
  const words = shortened.split(/\s+/);
  if (words.length > 4) {
    shortened = words.slice(0, 4).join(' ') + '...';
  } else if (shortened.length > 40) {
    shortened = shortened.substring(0, 37) + '...';
  }
  
  return shortened || 'Untitled chat';
};
```

**Time Ago Formatting:**
```typescript
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};
```

---

## Responsive Behavior

### Mobile (<768px)

```typescript
// Sidebar as overlay
<aside className={`
  fixed inset-y-0 left-0 z-20
  ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
  w-64
  transition-transform
  md:relative
  md:translate-x-0
`}>
```

**Features:**
- Fixed positioning (overlay)
- Slide in/out animation
- Toggle button to collapse
- Backdrop when open

### Desktop (>=768px)

```typescript
// Sidebar as fixed column
<aside className="w-64 relative">
```

**Features:**
- Fixed width column
- Always visible
- No overlay behavior

---

## Data Loading

### Loading Folders

```typescript
useEffect(() => {
  const loadFolders = async () => {
    try {
      const response = await fetch('http://localhost:5000/folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Failed to load folders:', error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };
  
  loadFolders();
}, []);
```

### Loading Recent Chats

```typescript
useEffect(() => {
  const loadRecentChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/chats/recent');
      const data = await response.json();
      setRecentChats(data.chats || []);
    } catch (error) {
      console.error('Failed to load recent chats:', error);
    }
  };
  
  loadRecentChats();
  
  // Reload when requested
  if (onReloadChats) {
    window.addEventListener('reloadChats', loadRecentChats);
    return () => window.removeEventListener('reloadChats', loadRecentChats);
  }
}, [onReloadChats]);
```

---

## Testing Checklist

### Visual
- [ ] Sidebar displays in all three themes
- [ ] Translucent theme has frosted glass effect
- [ ] Hover states work on all buttons
- [ ] Active states highlight correctly
- [ ] Icons display correctly

### Functional
- [ ] Navigation buttons work
- [ ] Folder selection works
- [ ] Chat selection works
- [ ] Reload button refreshes chats
- [ ] Collapse/expand works on mobile

### Responsive
- [ ] Sidebar slides on mobile
- [ ] Fixed column on desktop
- [ ] Touch interactions work
- [ ] No overlap with main content

### Data
- [ ] Folders load from API
- [ ] Recent chats load from API
- [ ] Error handling works
- [ ] Loading states display correctly

---

## Next Document

Proceed to **07_SETTINGS.md** for settings modal specifications.

