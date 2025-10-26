# UI/UX Navigation Design

## Overview
This document describes the navigation and interaction patterns for AI Whisper's three main screens: **Home**, **AI Chat**, and **Mind Map**.

## Design Principles
1. **Consistency**: Navigation elements should be uniform across all screens
2. **Accessibility**: All navigation options should be easily accessible
3. **Smoothness**: Transitions between screens should be seamless and elegant
4. **Clarity**: Users should always know where they are and how to navigate

---

## Screen Structure

### 1. Home Screen
- **Purpose**: Entry point, project selection, template selection
- **Layout**: Sidebar + Main content area
- **Key Elements**:
  - Sidebar (left)
  - Chat input box (center)
  - Settings button (upper-right corner)

### 2. AI Chat Screen
- **Purpose**: Conversational interface for project planning
- **Layout**: Sidebar + Chat panel (full screen or focus mode)
- **Key Elements**:
  - Sidebar (left, collapsible)
  - Chat messages (center)
  - Settings button (upper-right corner)
  - Mind Map toggle button (upper-right area)

### 3. Mind Map Screen
- **Purpose**: Visual canvas for project structure
- **Layout**: Sidebar + Mind map canvas
- **Key Elements**:
  - Sidebar (left, collapsible)
  - Mind map canvas (center)
  - Settings button (upper-right corner)
  - Chat toggle button (upper-right area)

---

## Sidebar Structure

The sidebar is the primary navigation component across all screens.

### Top Section: Navigation
```
┌─────────────────────────────┐
│  🏠 Home                    │  ← Navigate to home screen
│  🔍 Explore                 │  ← Community templates (future)
└─────────────────────────────┘
```

### Middle Section: Folders
```
┌─────────────────────────────┐
│  FOLDERS ▼                  │
│  📚 All Projects            │
│  💼 Work                    │
│  🏠 Personal                │
│  📦 Archive                 │
│  + Add Folder               │
└─────────────────────────────┘
```

### Bottom Section: History
```
┌─────────────────────────────┐
│  HISTORY ▼                  │
│  💬 Task management app     │  ← 3-4 word summary
│  💬 E-commerce redesign     │
│  💬 Database migration      │
│  💬 User auth flow          │
└─────────────────────────────┘
```

---

## Sidebar Behavior

### Default State
- **Open by default** on all three screens
- Width: 256px (w-64)
- Smooth slide animation when toggling

### Collapse Button
- Located in **sidebar header** (upper-right of sidebar)
- Icon: `SidebarLeft01Icon` (collapse) or `SidebarRight01Icon` (expand)
- Always visible when sidebar is open

### Expand Button
- Located in **upper-left corner of main content area**
- Only visible when sidebar is collapsed
- Fixed position with z-index: 50
- Icon: `SidebarRight01Icon` or `Menu01Icon`

### Toggle Behavior
- Smooth transition: 300ms ease-in-out
- Content area adjusts responsively
- State persists during navigation (stays open/closed)

---

## Navigation Patterns

### Universal Navigation Elements

#### Settings Button
- **Location**: Upper-right corner of all screens
- **Icon**: `Settings02Icon`
- **Behavior**: Opens settings modal overlay
- **Style**: Consistent icon button with hover state

#### Home Button
- **Location**: Sidebar navigation section (first item)
- **Icon**: `Home01Icon`
- **Behavior**: Returns to home screen from any view
- **Accessible**: Even when on home screen (for consistency)

### Screen-Specific Navigation

#### From Home to Chat
1. Click "New Chat" button in sidebar
2. Click on input box and start typing
3. Select "Quick Chat" action
4. Click on a past conversation in History

#### From Home to Mind Map
1. Select a template (creates new project)
2. Click on a past project with mind map content

#### From Chat to Mind Map
- Click mind map toggle button (upper-right area)
- Icon: `HierarchyIcon`

#### From Mind Map to Chat
- Click chat toggle button (upper-right area)
- Icon: `MessageMultiple01Icon` or `AiChat01Icon`

---

## Chat History & Naming

### Automatic Naming Strategy
When a new conversation is created, generate a short, meaningful name:

1. **From first message**: Extract first 3-4 words or first sentence (max 40 chars)
2. **Smart truncation**:
   - Remove common prefixes: "Chat -", "New Chat", timestamps
   - Use first sentence if under 40 chars
   - Otherwise, truncate to 37 chars + "..."
3. **Fallback**: If message is too short, use "Chat - [date] [time]"

### Display in History
- Show icon indicating content type:
  - `BubbleChatIcon`: Chat-only session
  - `WorkflowSquare04Icon`: Has mind map content (small icon)
- Truncate to single line with ellipsis
- Show most recent 10 items

---

## Responsive Behavior

### Sidebar on Small Screens
- Default open on desktop (>= 1024px)
- Default closed on tablet/mobile (< 1024px)
- User preference saved in localStorage

### Settings Modal
- Always centered overlay
- Backdrop blur + semi-transparent background
- Click outside to close
- Responsive width: max-w-xl with margin

---

## Accessibility

### Keyboard Navigation
- `Tab` to navigate between interactive elements
- `Enter` to activate buttons
- `Escape` to close modals and collapse panels

### Screen Reader Support
- All buttons have descriptive `title` attributes
- Icons have `aria-label` where needed
- Semantic HTML structure

### Visual Feedback
- Hover states on all interactive elements
- Active/selected states clearly indicated
- Loading states shown during async operations
- Smooth transitions (not too fast, not too slow)

---

## Implementation Checklist

- [ ] Sidebar Navigation section with Home and Explore buttons
- [ ] Settings button in upper-right corner (all screens)
- [ ] Sidebar toggle button in sidebar header
- [ ] Expand button in upper-left when sidebar is collapsed
- [ ] History section with 3-4 word summaries
- [ ] Automatic conversation naming from first message
- [ ] Smooth slide transitions for sidebar (300ms)
- [ ] Persistent sidebar state during screen navigation
- [ ] Responsive behavior for different screen sizes
- [ ] Keyboard accessibility
- [ ] Visual feedback for all interactions

---

## Future Enhancements

### Explore Feature
- Community templates browser
- Filter by category, popularity, recent
- Preview before using
- Save favorites

### Advanced History
- Search through past conversations
- Filter by folder, date, template
- Bulk operations (archive, delete, move)
- Export conversations

### Sidebar Customization
- User-defined sections
- Drag-and-drop reordering
- Pin favorite items
- Custom keyboard shortcuts

---

## Design Notes

### Color Palette
- Background: `zinc-950`, `zinc-900`
- Sidebar: `zinc-900/50` with `zinc-800` borders
- Active items: `blue-600/20` background with `blue-400` text
- Hover states: `zinc-800` or `zinc-800/50`
- Text: `gray-300` (normal), `white` (active/hover)

### Spacing & Sizing
- Sidebar width: 256px (w-64)
- Button height: 32-40px (py-2 to py-2.5)
- Icon size: 16-18px for navigation, 20-24px for primary actions
- Border radius: 8-12px (rounded-lg to rounded-xl)

### Typography
- Headers: `text-sm font-semibold`
- Navigation items: `text-xs` to `text-sm`
- Body text: `text-sm` to `text-base`
- Conversation titles: `text-sm`, truncate with ellipsis

---

## Version History
- **v1.0** (2025-10-25): Initial UI/UX navigation design documentation

