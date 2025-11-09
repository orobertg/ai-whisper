# Home Page Specification

**Document:** 04_HOME_PAGE.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 02_LAYOUT_STRUCTURE.md, 03_STYLING_ARCHITECTURE.md

---

## Overview

The Home Page (`HomeContent.tsx`) is the landing screen that welcomes users and provides quick access to create projects, start chats, and view recent activity. It features a time-based greeting, AI chat input, quick action buttons, and recent chat tiles with glassmorphism styling in translucent theme.

---

## Component Structure

### File: `frontend/components/HomeContent.tsx`

### Props Interface

```typescript
type HomeContentProps = {
  onSelectAction: (actionId: string, folderId?: number | null) => void;
  onSelectTemplate?: (template: Template, folderId?: number | null) => void;
  onSelectProject?: (projectId: number, mode?: 'chat' | 'mindmap') => void;
  onStartChat?: (initialMessage: string) => void;
  onOpenSettings?: (provider?: string) => void;
  userName?: string;
  selectedFolderId: number | null;
  folders: Array<{ id: number; name: string; icon: string; color: string }>;
  recentChats: Array<{ 
    id: number; 
    title: string; 
    updated_at: string;
    nodes_json?: string;
    chat_history?: string;
  }>;
  hasWallpaper?: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
};
```

### State Management

```typescript
const [expandedAction, setExpandedAction] = useState<string | null>(null);
const [chatInput, setChatInput] = useState("");
const textareaRef = useRef<HTMLTextAreaElement>(null);
```

**State Descriptions:**
- `expandedAction`: Tracks which action panel is expanded ('create' | 'open' | null)
- `chatInput`: Current text in the AI chat textarea
- `textareaRef`: Reference for auto-focusing the textarea

### Theme Integration

```typescript
const { isLight, isTranslucent, getHeaderButtonClass, getSelectClass } = useTheme();

// Critical: Force translucent theme to use withoutWallpaper variant
const effectiveHasWallpaper = isTranslucent ? false : hasWallpaper;

// Get theme-aware styles
const homeActionButtonClass = getThemeStyle('homeActionButton', effectiveHasWallpaper, isLight, undefined, isTranslucent);
const homeChatTileClass = getThemeStyle('homeChatTile', effectiveHasWallpaper, isLight, undefined, isTranslucent);
const inputClass = getThemeStyle('input', effectiveHasWallpaper, isLight, undefined, isTranslucent);
const textClass = getThemeStyle('text', effectiveHasWallpaper, isLight, 'primary', isTranslucent);
const subtitleClass = getThemeStyle('text', effectiveHasWallpaper, isLight, 'secondary', isTranslucent);
```

**Critical Pattern:**
```typescript
// MUST use effectiveHasWallpaper instead of hasWallpaper
// This ensures translucent theme ignores wallpaper and uses gradient
const effectiveHasWallpaper = isTranslucent ? false : hasWallpaper;
```

---

## Visual Layout

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  [Gear Icon] [Model Selector]              (Header) │
├─────────────────────────────────────────────────────┤
│                                                       │
│                  [Time Icon]                          │
│                 Good Morning                          │
│          What would you like to work on today?        │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ [Ollama - Llama 3.2 ▼]  [Globe] [Attach]   │    │
│  │                                              │    │
│  │ Tell me about your project...                │    │
│  │                                              │    │
│  │                                      [Send→] │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  [Create project] [Open project]                     │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ [Template Cards] (when Create expanded)      │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
│  Your recent chats ›                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ SaaS App │ │ Mobile   │ │ Android  │             │
│  │ Project  │ │ App Proj │ │ Chat Int │             │
│  │ just now │ │ just now │ │ 5h ago   │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Section Specifications

### 1. Header Section

**Structure:**
```tsx
<header className="h-14 px-6 flex items-center justify-end">
  <div className="flex items-center gap-3">
    {/* Settings Button */}
    <button
      onClick={() => onOpenSettings?.()}
      className={`p-2 rounded-lg transition-all ${getHeaderButtonClass()}`}
      aria-label="Settings"
    >
      <Settings02Icon size={20} strokeWidth={2} />
    </button>
    
    {/* Model Selector */}
    <CustomSelect
      options={modelsWithStatus}
      value={selectedModel}
      onChange={(value) => {
        const model = modelsWithStatus.find(m => m.value === value);
        if (model?.disabled) {
          handleUnconfiguredModel(value);
        } else {
          onModelChange(value);
        }
      }}
      isDark={getSelectClass().isDark}
    />
  </div>
</header>
```

**Key Features:**
- **Fixed Height:** `h-14` for consistent header size
- **Right-Aligned:** Settings and model selector on the right
- **Theme-Aware:** Uses `getHeaderButtonClass()` and `getSelectClass()`
- **Unconfigured Model Handling:** Opens settings when selecting disabled model

### 2. Greeting Section

**Dynamic Greeting Logic:**
```typescript
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 8) return "Good Early Morning";
  if (hour >= 8 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingIcon = () => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 8) return <Moon02Icon size={28} strokeWidth={2} className="text-blue-400" />;
  if (hour >= 8 && hour < 12) return <Coffee01Icon size={28} strokeWidth={2} className="text-amber-500" />;
  if (hour >= 12 && hour < 17) return <Sun03Icon size={28} strokeWidth={2} className="text-yellow-400" />;
  return <Moon02Icon size={28} strokeWidth={2} className="text-indigo-400" />;
};
```

**Rendering:**
```tsx
<div className="text-center mb-8">
  <div className="flex justify-center mb-2">
    {getGreetingIcon()}
  </div>
  <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>
    {getGreeting()}
  </h1>
  <p className={`text-base ${subtitleClass}`}>
    What would you like to work on today?
  </p>
</div>
```

**Time Ranges:**
- **0:00 - 7:59:** "Good Early Morning" + Moon (blue)
- **8:00 - 11:59:** "Good Morning" + Coffee (amber)
- **12:00 - 16:59:** "Good Afternoon" + Sun (yellow)
- **17:00 - 23:59:** "Good Evening" + Moon (indigo)

### 3. AI Chat Input Box

**Structure:**
```tsx
<div className={`relative ${inputClass}`}>
  {/* Model Selector Row */}
  <div className="flex items-center gap-2 px-4 pt-4 mb-2 border-b border-zinc-700">
    <CustomSelect
      options={modelsWithStatus}
      value={selectedModel}
      onChange={handleModelChange}
      isDark={getSelectClass().isDark}
    />
    <button className={`p-2 rounded transition-colors ${iconButtonClass}`}>
      <Globe02Icon size={16} strokeWidth={2} />
    </button>
    <button className={`p-2 rounded transition-colors ${iconButtonClass}`}>
      <Attachment02Icon size={16} strokeWidth={2} />
    </button>
  </div>
  
  {/* Textarea */}
  <textarea
    ref={textareaRef}
    value={chatInput}
    onChange={(e) => setChatInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Tell me about your project (Press Enter to send, Shift+Enter for new line)"
    className="w-full px-6 py-4 bg-transparent text-[15px] resize-none focus:outline-none leading-relaxed"
    rows={1}
    style={{ minHeight: '60px', maxHeight: '180px' }}
  />
  
  {/* Send Button */}
  <button
    disabled={!chatInput.trim()}
    onClick={handleSend}
    className={`absolute right-4 bottom-4 w-9 h-9 ${sendButtonClass} disabled:cursor-not-allowed`}
  >
    <ArrowUp01Icon size={20} strokeWidth={2} />
  </button>
</div>
```

**Key Features:**
1. **Auto-focus:** Textarea auto-focuses on mount
2. **Keyboard Shortcuts:**
   - `Enter` → Send message
   - `Shift+Enter` → New line
3. **Dynamic Height:** Min 60px, max 180px
4. **Model Selection:** Integrated model picker with icons
5. **Disabled Send:** Button disabled when input empty
6. **Theme-Aware:** Uses `inputClass` from `getThemeStyle()`

**Send Handler:**
```typescript
const handleSend = () => {
  if (chatInput.trim() && onStartChat) {
    onStartChat(chatInput.trim());
    setChatInput("");
  }
};

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
```

**Styling Classes (Translucent Theme):**
- Container: `bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl`
- Text: `text-white placeholder-zinc-400`
- Send Button: `bg-zinc-300 text-zinc-500 hover:bg-white hover:text-zinc-900` (when enabled)

### 4. Quick Action Buttons

**Structure:**
```tsx
<div className="mb-8 space-y-3">
  <div className="flex gap-2 justify-start overflow-x-auto">
    <button
      onClick={() => handleActionClick("create")}
      className={`px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap flex-shrink-0 ${
        expandedAction === "create" ? buttonActiveClass : homeActionButtonClass
      }`}
    >
      Create project
    </button>
    <button
      onClick={() => handleActionClick("open")}
      className={`px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap flex-shrink-0 ${
        expandedAction === "open" ? buttonActiveClass : homeActionButtonClass
      }`}
    >
      Open project
    </button>
  </div>
</div>
```

**Critical Styling:**
- **Isolated Style:** Uses `homeActionButtonClass` (not generic `buttonBaseClass`)
- **Active State:** Uses `buttonActiveClass` when expanded
- **Sizing:** `px-4 py-2.5` for comfortable click targets
- **Rounding:** `rounded-xl` for modern look
- **Responsive:** `overflow-x-auto` for mobile horizontal scroll

**Translucent Theme Styles:**
```css
/* homeActionButton.withoutWallpaper.translucent */
bg-white/[0.15] backdrop-blur-2xl border border-white/20 
hover:border-white/30 text-white hover:bg-white/[0.20] 
shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] 
font-medium
```

### 5. Expanded Template Selection

**Structure (when "Create project" clicked):**
```tsx
{expandedAction === "create" && (
  <div className={expandedPanelClass}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => handleTemplateSelect(template)}
          className="group text-left p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${template.color} bg-opacity-20`}>
              {template.icon}
            </div>
            <div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-xs text-zinc-500">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckmarkCircle02Icon size={14} />
            <span>{template.nodes.length} steps</span>
          </div>
        </button>
      ))}
    </div>
    
    {/* Optional Folder Selection */}
    {folders.length > 0 && (
      <div className="mt-4">
        <label className="text-xs mb-2 block">Save to folder (optional)</label>
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <button key={folder.id} className="px-3 py-1.5 rounded-lg text-xs">
              {getFolderIcon(folder.name)}
              {folder.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}
```

**Templates Array:**
```typescript
// From @/lib/templates
export const TEMPLATES = [
  {
    id: "saas-app",
    name: "SaaS Application Project",
    description: "Build a complete software-as-a-service application",
    icon: <AiNetworkIcon />,
    color: "bg-blue-500",
    nodes: [/* ... */]
  },
  // ... more templates
];
```

### 6. Recent Chats Section

**Structure:**
```tsx
{recentChats.length > 0 && (
  <div className={/* No background in translucent mode */}>
    <div className="flex items-center gap-2 mb-4">
      <MessageAdd02Icon size={16} className={panelSubtextClass} strokeWidth={2} />
      <h3 className={`text-sm font-medium ${panelTextClass}`}>Your recent chats</h3>
      <span className={panelSubtextClass}>›</span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {recentChats.slice(0, 3).map((chat) => {
        const isChatOnly = chat.title.startsWith("Chat -") || 
                          (!chat.nodes_json || chat.nodes_json === "[]");
        
        return (
          <div
            key={chat.id}
            className={`p-4 ${homeChatTileClass}`}
            onClick={() => handleProjectSelect(chat.id, 'chat')}
          >
            {/* Action Icons */}
            <div className="mb-2 flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectSelect(chat.id, 'chat');
                }}
                className={`rounded p-1 transition-colors ${hoverClass}`}
                title="Open chat"
              >
                <BubbleChatIcon size={18} className={iconClass} strokeWidth={2} />
              </button>
              {!isChatOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectSelect(chat.id, 'mindmap');
                  }}
                  className={`rounded p-1 transition-colors ${hoverClass}`}
                  title="Open mind map"
                >
                  <WorkflowSquare04Icon size={18} className={iconClass} strokeWidth={2} />
                </button>
              )}
            </div>
            
            {/* Chat Title */}
            <h4 className={`text-sm font-medium mb-1 line-clamp-1 ${panelTextClass}`}>
              {chat.title}
            </h4>
            
            {/* Timestamp */}
            <p className={`text-xs ${panelSubtextClass}`}>
              {formatTimeAgo(chat.updated_at)}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}
```

**Critical Features:**
1. **Isolated Styling:** Uses `homeChatTileClass` (not generic `cardClass`)
2. **Limit to 3:** Shows only 3 most recent chats
3. **Conditional Icons:** Shows mind map icon only if project has mind map
4. **Click Handling:**
   - Tile click → Open chat
   - Chat icon → Open chat
   - Mind map icon → Open mind map
5. **Time Formatting:** Uses `formatTimeAgo()` helper

**Time Formatting:**
```typescript
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};
```

**Translucent Theme Tile Styles:**
```css
/* homeChatTile.withoutWallpaper.translucent */
bg-white/[0.15] backdrop-blur-2xl border border-white/20 
hover:border-white/30 hover:bg-white/[0.20] rounded-2xl 
transition-all group cursor-pointer 
shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
```

**Key Visual Properties:**
- **15% white opacity** for subtle visibility
- **backdrop-blur-2xl** (40px) for strong frosted glass
- **20% white borders** (30% on hover) for definition
- **rounded-2xl** (16px) for modern, pill-like corners
- **Custom shadows** for depth and elevation

---

## Event Handlers

### Template Selection

```typescript
const handleTemplateSelect = (template: Template) => {
  setExpandedAction(null);
  if (onSelectTemplate) {
    onSelectTemplate(template, selectedFolderId);
  }
};
```

### Project Selection

```typescript
const handleProjectSelect = (projectId: number, mode?: 'chat' | 'mindmap') => {
  setExpandedAction(null);
  if (onSelectProject) {
    onSelectProject(projectId, mode);
  }
};
```

### Model Change

```typescript
const handleUnconfiguredModel = (modelName: string) => {
  const providerKey = getProviderFromModel(modelName);
  if (providerKey && onOpenSettings) {
    onOpenSettings(providerKey);
  }
};
```

---

## Responsive Behavior

### Mobile (<640px)
- Recent chats: Single column
- Templates: Single column
- Action buttons: Horizontal scroll if needed
- Header: Compact spacing

### Tablet (640px - 1024px)
- Recent chats: 3 columns
- Templates: 2 columns
- Full header with spacing

### Desktop (>1024px)
- Recent chats: 3 columns
- Templates: 2 columns
- Spacious layout

---

## Accessibility

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons
- Focus visible on all elements

### Screen Readers
- aria-label on icon buttons
- Semantic HTML structure
- Descriptive button text

### Color Contrast
- WCAG AA compliant in all themes
- Text readable on all backgrounds
- Focus indicators clearly visible

---

## Testing Checklist

### Visual
- [ ] Greeting changes based on time of day
- [ ] Action buttons have frosted glass effect (translucent)
- [ ] Recent chat tiles match input box styling
- [ ] Hover states work on all interactive elements
- [ ] Model selector displays correctly

### Functional
- [ ] Chat input auto-focuses on mount
- [ ] Enter sends message
- [ ] Shift+Enter adds new line
- [ ] Template selection works
- [ ] Recent chat navigation works
- [ ] Settings button opens modal
- [ ] Model selector shows status icons

### Responsive
- [ ] Layout adapts to mobile
- [ ] Action buttons scroll horizontally on mobile
- [ ] Grids adjust column count
- [ ] Touch interactions work

### Theme
- [ ] All three themes display correctly
- [ ] Translucent uses gradient (not wallpaper)
- [ ] Styles switch immediately
- [ ] No flickering on theme change

---

## Next Document

Proceed to **05_CHAT_INTERFACE.md** for chat panel specifications.

