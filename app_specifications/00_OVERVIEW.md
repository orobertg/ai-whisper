# AI Whisper UI/UX Specifications - Overview

**Version:** 1.0  
**Last Updated:** November 9, 2025  
**Purpose:** Complete UI/UX specifications for rebuilding the AI Whisper application

---

## Document Purpose

These specification documents provide complete, precise instructions for building the AI Whisper application's frontend UI/UX. They are designed to enable an AI agent (like Cursor) or developer to recreate the application with minimal iterations.

---

## Application Architecture

### Technology Stack

- **Framework:** Next.js 14.2.14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Icons:** Hugeicons React
- **Node Version:** 20-alpine (Docker)

### Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with theme initialization
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles & theme backgrounds
├── components/
│   ├── HomeContent.tsx      # Home page content
│   ├── ChatPanel.tsx        # Chat interface
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Settings.tsx         # Settings modal
│   └── KanbanBoard.tsx      # Kanban board view
├── contexts/
│   └── ThemeContext.tsx     # Global theme management
└── lib/
    └── themeStyles.ts       # Centralized theme styles
```

---

## Core Features

### 1. Three-Theme System
- **Light Theme:** Traditional light mode with white backgrounds
- **Dark Theme:** Dark mode with zinc color palette
- **Translucent Theme:** Glassmorphism with animated gradient background

### 2. Wallpaper System
- User-uploadable wallpapers
- Per-wallpaper blur control (0-20px)
- Wallpaper affects styling (different opacities/blurs with wallpaper vs without)

### 3. View Modes
- **Home View:** Welcome screen with quick actions and recent chats
- **Chat View:** AI chat interface with mind map integration
- **Kanban View:** Project management board

### 4. Persistent Sidebar
- Navigation between views
- Folder management
- Recent chats list
- Collapsible design

---

## Key Design Principles

### 1. Theme Isolation
- All theme-dependent styles centralized in `themeStyles.ts`
- Components use `getThemeStyle()` helper function
- No hardcoded theme classes in components
- Dedicated style entries for specific UI sections (e.g., `homeChatTile`, `homeActionButton`)

### 2. SSR/Hydration Safety
- Theme initialized via inline script in `<head>`
- `suppressHydrationWarning` on `<html>` and `<body>`
- Theme reads from `localStorage.getItem('systemTheme')`
- Defaults to 'light' during SSR

### 3. Translucent Theme Special Handling
- Always uses `withoutWallpaper` variant (ignores wallpaper settings)
- Uses animated gradient background from `globals.css`
- Higher opacity (15% vs 8-10%) for visibility
- Consistent `backdrop-blur-2xl` for glassmorphism

### 4. Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Sidebar collapses on mobile
- Touch-friendly interactive elements

---

## Document Structure

### Core System Documents
1. **01_THEME_SYSTEM.md** - Complete theme architecture and implementation
2. **02_LAYOUT_STRUCTURE.md** - Root layout, SSR handling, and global setup
3. **03_STYLING_ARCHITECTURE.md** - Tailwind configuration and style patterns

### Component Documents
4. **04_HOME_PAGE.md** - Home view with quick actions and recent chats
5. **05_CHAT_INTERFACE.md** - Chat panel with AI interaction
6. **06_SIDEBAR.md** - Navigation and folder management
7. **07_SETTINGS.md** - Settings modal with theme/wallpaper controls
8. **08_KANBAN_BOARD.md** - Project management view

### Integration Documents
9. **09_STATE_MANAGEMENT.md** - Context providers and state flow
10. **10_COMPONENT_INTEGRATION.md** - How components work together
11. **11_STYLING_REFERENCE.md** - Complete style class reference

---

## Usage Instructions

### For AI Agents (Cursor/Claude)

1. Read **00_OVERVIEW.md** (this document) first
2. Read **01_THEME_SYSTEM.md** to understand the theme architecture
3. Read **02_LAYOUT_STRUCTURE.md** and **03_STYLING_ARCHITECTURE.md** for setup
4. Build components in order: Theme Context → Layout → Home Page → Chat → Settings
5. Reference **11_STYLING_REFERENCE.md** for exact CSS classes

### For Developers

1. Review all documents in numerical order
2. Set up the project structure as defined in **02_LAYOUT_STRUCTURE.md**
3. Implement the theme system first (critical foundation)
4. Build components incrementally, testing theme switching at each step
5. Use the styling reference as a lookup table for consistent styling

---

## Critical Implementation Notes

### Must-Follow Rules

1. **Never hardcode theme classes** - Always use `getThemeStyle()` or context helpers
2. **Use `effectiveHasWallpaper`** - Translucent theme must ignore wallpaper settings
3. **Add inline theme script** - Required for SSR/hydration consistency
4. **Centralize styles** - All theme-dependent classes in `themeStyles.ts`
5. **Test all three themes** - Every component must work in light/dark/translucent
6. **Handle wallpaper variations** - Test with/without wallpaper in each theme

### Common Pitfalls to Avoid

1. **Hydration Mismatches** - Theme must be consistent between SSR and client
2. **Hardcoded Backgrounds** - Container backgrounds can block gradients/wallpapers
3. **Missing Theme Variants** - Every styled element needs light/dark/translucent variants
4. **Incorrect Blur Usage** - `backdrop-blur` only works with semi-transparent backgrounds
5. **Wallpaper Override** - Translucent theme should never show uploaded wallpapers

---

## Version History

- **1.0** (November 9, 2025) - Initial specification based on current implementation
  - Three-theme system (light/dark/translucent)
  - Wallpaper management with blur control
  - Home page with frosted glass effects
  - Chat interface with mind map integration
  - Settings modal with theme controls
  - Isolated styling architecture

---

## Next Steps

After reading this overview, proceed to:
1. **01_THEME_SYSTEM.md** - Understand the foundation
2. **02_LAYOUT_STRUCTURE.md** - Set up the application structure
3. Continue through numbered documents in sequence

Each document is self-contained but builds on previous concepts. Read in order for best understanding.

