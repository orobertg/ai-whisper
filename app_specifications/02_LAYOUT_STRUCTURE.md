# Layout Structure Specification

**Document:** 02_LAYOUT_STRUCTURE.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md

---

## Overview

This document specifies the root layout structure, SSR handling, and global application setup for the AI Whisper application.

---

## Root Layout

### File: `frontend/app/layout.tsx`

This is the root layout for the Next.js App Router application. It handles theme initialization, SSR hydration, and provides global context.

#### Complete Implementation

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReactNode } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "AI Whisper",
  description: "AI-powered project management and chat interface",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('systemTheme') || 'light';

                  // Handle "system" theme by detecting OS preference
                  if (theme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }

                  document.documentElement.classList.remove('light', 'dark', 'translucent');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  console.error('Failed to load theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Critical Elements

##### 1. Font Setup

```typescript
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});
```

**Purpose:** Loads Inter font from Google Fonts with variable font support

**Usage:**
- Applied to `<html>` as CSS variable: `className={inter.variable}`
- Applied to `<body>` as font class: `className={inter.className}`

##### 2. Inline Theme Script

```javascript
(function() {
  try {
    let theme = localStorage.getItem('systemTheme') || 'light';
    
    // Handle "system" theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.classList.remove('light', 'dark', 'translucent');
    document.documentElement.classList.add(theme);
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
})();
```

**Purpose:** Sets theme class BEFORE first paint to prevent flash

**Critical Requirements:**
1. **Placement:** Must be in `<head>`, before any visible content
2. **IIFE:** Immediately Invoked Function Expression for scope isolation
3. **Try-Catch:** Handles localStorage errors gracefully
4. **Class Removal:** Remove all theme classes before adding new one
5. **System Theme:** Resolves 'system' to actual 'light' or 'dark'
6. **Default:** Falls back to 'light' if no saved theme

**Why This Is Required:**
- Prevents "flash of unstyled content" (FOUC)
- Ensures SSR-rendered HTML has correct theme before hydration
- Runs synchronously before React hydration
- Avoids hydration mismatches

##### 3. Hydration Warning Suppression

```tsx
<html lang="en" className={inter.variable} suppressHydrationWarning>
  ...
  <body className={inter.className} suppressHydrationWarning>
```

**Purpose:** Allows server/client theme mismatch without console warnings

**Why This Is Safe:**
- The inline script ensures client matches server by first paint
- Theme class is intentionally different (server: static, client: from localStorage)
- This is a known, intentional hydration exception
- Only suppresses warnings on `<html>` and `<body>`, not entire app

##### 4. ThemeProvider Wrapper

```tsx
<ThemeProvider>
  {children}
</ThemeProvider>
```

**Purpose:** Provides theme context to entire application

**Wraps:** All page content, making theme available via `useTheme()` hook

---

## Main Application Page

### File: `frontend/app/page.tsx`

This is the main application page that orchestrates all views and manages top-level state.

#### State Management

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  // View state
  const [viewMode, setViewMode] = useState<'home' | 'chat' | 'mindmap' | 'kanban'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  // Data state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'appearance' | 'providers'>('appearance');
  
  // Wallpaper state
  const [homeWallpaper, setHomeWallpaper] = useState<string | null>(null);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
  
  // Model selection
  const [selectedModel, setSelectedModel] = useState("Ollama - Llama 3.2");
  
  // ... rest of implementation
}
```

#### View Mode Rendering

```typescript
return (
  <div className="h-screen flex bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
    {/* Wallpaper Background Layer */}
    {viewMode === "home" && homeWallpaper && (
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${homeWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: wallpaperBlur > 0 ? `blur(${wallpaperBlur}px)` : 'none'
        }}
      />
    )}
    
    {/* Sidebar */}
    <Sidebar
      onNewChat={handleNewChat}
      onSelectFolder={setSelectedFolderId}
      onSelectProject={handleSelectProject}
      selectedFolderId={selectedFolderId}
      currentProjectId={currentProjectId}
      recentChats={recentChats}
      onReloadChats={loadRecentChats}
      onToggleSidebar={() => {/* ... */}}
      onGoHome={() => setViewMode('home')}
      onNavigateToKanban={() => setViewMode('kanban')}
      // ... other props
    />
    
    {/* Main Content */}
    <div className="flex-1 flex flex-col relative z-10">
      {viewMode === "home" ? (
        <HomeContent
          userName={userName}
          onSelectAction={handleSelectAction}
          onSelectTemplate={handleSelectTemplate}
          onSelectProject={handleSelectProject}
          onStartChat={handleStartChat}
          onOpenSettings={handleOpenSettings}
          selectedFolderId={selectedFolderId}
          folders={folders}
          recentChats={recentChats.slice(0, 3)}
          hasWallpaper={!!homeWallpaper}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      ) : viewMode === "kanban" ? (
        <KanbanBoard projectId={selectedFolderId || undefined} />
      ) : (
        <ChatPanel
          template={selectedTemplate}
          // ... other chat props
        />
      )}
    </div>
    
    {/* Settings Modal */}
    {showSettings && (
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        initialTab={settingsTab}
      />
    )}
  </div>
);
```

#### Wallpaper Loading Logic

```typescript
useEffect(() => {
  const loadWallpaper = () => {
    const customBg = localStorage.getItem("customBackground");
    const savedBlur = localStorage.getItem("wallpaperBlur");
    
    if (customBg === "true") {
      const savedSelectedId = localStorage.getItem("selectedWallpaperId");
      
      try {
        const wallpapers = JSON.parse(localStorage.getItem("chatWallpapers") || "[]");
        
        if (wallpapers && Array.isArray(wallpapers) && wallpapers.length > 0) {
          const selectedWallpaper = wallpapers.find((w: any) => w.id === savedSelectedId);
          
          if (selectedWallpaper && selectedWallpaper.image) {
            console.log("🏠 Found wallpaper for home:", selectedWallpaper?.name);
            setHomeWallpaper(selectedWallpaper.image);
          } else {
            console.log("🏠 Wallpaper ID exists but wallpaper not found, clearing...");
            setHomeWallpaper(null);
          }
        } else {
          console.log("🏠 Wallpapers array is empty, clearing...");
          setHomeWallpaper(null);
        }
      } catch (e) {
        console.error("Failed to load home wallpaper:", e);
        setHomeWallpaper(null);
      }
    } else {
      console.log("🏠 Custom background disabled or no wallpaper, clearing...");
      setHomeWallpaper(null);
    }
    
    if (savedBlur) {
      setWallpaperBlur(Number(savedBlur));
      console.log("🏠 Wallpaper blur set to:", savedBlur);
    }
  };
  
  loadWallpaper();
  
  // Listen for wallpaper changes
  const handleWallpaperChange = () => {
    loadWallpaper();
  };
  
  window.addEventListener('wallpaperChanged', handleWallpaperChange);
  
  return () => {
    window.removeEventListener('wallpaperChanged', handleWallpaperChange);
  };
}, []);
```

**Critical Notes:**
1. **Custom Background Check:** Only load wallpaper if `customBackground === 'true'`
2. **Wallpaper Validation:** Check if wallpaper object exists in array
3. **Event Listener:** Re-load wallpaper when 'wallpaperChanged' event fires
4. **Blur Control:** Load and apply blur value from localStorage
5. **Error Handling:** Gracefully handle JSON parse errors

#### Wallpaper Rendering

```tsx
{viewMode === "home" && homeWallpaper && (
  <div 
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${homeWallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      filter: wallpaperBlur > 0 ? `blur(${wallpaperBlur}px)` : 'none'
    }}
  />
)}
```

**Critical Requirements:**
1. **Condition:** Only render if `viewMode === 'home'` AND `homeWallpaper` exists
2. **Positioning:** `absolute inset-0 z-0` to fill container and stay behind content
3. **Dark Overlay:** `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))` for readability
4. **Background Props:**
   - `backgroundSize: cover` - Fill entire area
   - `backgroundPosition: center` - Center image
   - `backgroundRepeat: no-repeat` - Don't tile
   - `backgroundAttachment: fixed` - Parallax effect
5. **Blur Filter:** Apply CSS `blur()` based on user preference

**Important:** Translucent theme should NOT render this wallpaper div!

---

## Application Container Structure

### Layout Hierarchy

```
<html className="light|dark|translucent">
  <body>
    <ThemeProvider>
      <div className="h-screen flex"> {/* Main container */}
        {/* Wallpaper layer (z-0) */}
        <div className="absolute inset-0 z-0" />
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content (z-10) */}
        <div className="flex-1 flex flex-col relative z-10">
          <HomeContent /> {/* OR */}
          <ChatPanel />   {/* OR */}
          <KanbanBoard />
        </div>
        
        {/* Settings modal (z-50) */}
        <Settings />
      </div>
    </ThemeProvider>
  </body>
</html>
```

### Z-Index Management

**Layer Stack (bottom to top):**

1. **z-0:** Wallpaper background layer
2. **z-10:** Main content (default layer for most content)
3. **z-20:** Sidebar (when overlaying content on mobile)
4. **z-30:** Dropdowns and popovers
5. **z-40:** Tooltips
6. **z-50:** Modals (Settings, dialogs)
7. **z-[60]:** Toast notifications (if added)

**Rules:**
- Never use arbitrary z-index values
- Use Tailwind's z-index scale
- Document any custom z-index usage
- Test stacking on mobile and desktop

---

## Responsive Breakpoints

### Tailwind Default Breakpoints

```css
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Application Usage

**Sidebar:**
- Full width overlay on mobile (< 768px)
- Fixed width column on desktop (>= 768px)

**Home Page Grid:**
- 1 column on mobile: `grid-cols-1`
- 2 columns on small: `sm:grid-cols-2`
- 3 columns on desktop: `md:grid-cols-3`

**Recent Chats:**
- 1 column on mobile: `grid-cols-1`
- 3 columns on small: `sm:grid-cols-3`

---

## SSR vs Client Rendering

### Server-Side Rendering (SSR)

**What Runs on Server:**
1. Initial HTML generation
2. Theme default set to 'light'
3. No access to localStorage
4. No access to window/document

**Server Output:**
```html
<html class="light">
  <body class="bg-white text-zinc-900">
    <!-- Pre-rendered content with light theme -->
  </body>
</html>
```

### Client-Side Hydration

**What Runs on Client:**
1. Inline script reads localStorage and updates theme class
2. React hydrates with actual theme from context
3. Components render with user's preferred theme

**Client After Hydration:**
```html
<html class="dark"> <!-- or translucent -->
  <body class="bg-gradient-to-br from-zinc-950...">
    <!-- Interactive React components with user's theme -->
  </body>
</html>
```

### Preventing Hydration Mismatches

**Rules:**
1. **Use `suppressHydrationWarning`** on elements that change theme
2. **Inline script before React** ensures theme set before first paint
3. **Consistent localStorage key** (`'systemTheme'`) everywhere
4. **Default to 'light'** in both SSR and inline script fallback
5. **Don't render theme-dependent content in SSR** (use client-side only)

---

## Global Styles

### File: `frontend/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font smoothing for better rendering */
@layer base {
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Light theme */
html.light {
  color-scheme: light;
}

html.light body {
  @apply bg-white text-zinc-900;
}

/* Dark theme */
html.dark {
  color-scheme: dark;
}

html.dark body {
  @apply bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100;
}

/* Translucent theme */
html.translucent {
  color-scheme: light;
}

html.translucent body {
  @apply text-zinc-900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Scrollbar styling (optional but recommended) */
@layer utilities {
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-zinc-400 dark:bg-zinc-600 rounded-full;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-zinc-500 dark:bg-zinc-500;
  }
}
```

---

## Environment Variables (if needed)

### File: `frontend/.env.local`

```bash
# API endpoint (if separate backend)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG=false
```

**Usage in code:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

**Rules:**
- Prefix with `NEXT_PUBLIC_` for client-side access
- Never commit `.env.local` to git (add to `.gitignore`)
- Provide `.env.example` for other developers

---

## Testing Checklist

### SSR/Hydration
- [ ] No hydration warnings in console
- [ ] Theme applies before first paint (no flash)
- [ ] Theme persists after hard refresh
- [ ] Works with disabled JavaScript (graceful degradation)

### Layout
- [ ] Sidebar displays correctly on mobile and desktop
- [ ] Wallpaper fills entire background
- [ ] Wallpaper blur applies correctly
- [ ] Content sits above wallpaper (z-index correct)
- [ ] Settings modal overlays everything

### Responsiveness
- [ ] Home page grid adapts to screen size
- [ ] Chat panel works on mobile
- [ ] Sidebar collapses/expands on mobile
- [ ] Touch interactions work correctly
- [ ] No horizontal scroll on mobile

---

## Next Document

Proceed to **03_STYLING_ARCHITECTURE.md** for Tailwind configuration and styling patterns.

