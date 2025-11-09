# Theme System Specification

**Document:** 01_THEME_SYSTEM.md  
**Version:** 1.0  
**Dependencies:** None (foundational document)

---

## Overview

The AI Whisper application uses a sophisticated three-theme system with wallpaper support. This document provides complete implementation details for the theme architecture.

---

## Theme Modes

### 1. Light Theme (`'light'`)

**Characteristics:**
- White backgrounds (`bg-white`)
- Dark text (`text-zinc-900`)
- Zinc borders (`border-zinc-200` to `border-zinc-300`)
- Subtle shadows
- High contrast for readability

**Use Cases:**
- Daytime usage
- High-brightness environments
- Users preferring traditional light interfaces

### 2. Dark Theme (`'dark'`)

**Characteristics:**
- Dark zinc backgrounds (`bg-zinc-900`)
- Light text (`text-white`, `text-zinc-100`)
- Muted borders (`border-zinc-700`, `border-zinc-800`)
- Reduced eye strain in low-light
- Semi-transparent elements with wallpaper

**Use Cases:**
- Nighttime usage
- Low-light environments
- Users preferring dark interfaces

### 3. Translucent Theme (`'translucent'`)

**Characteristics:**
- Animated gradient background
- Frosted glass (glassmorphism) UI elements
- `backdrop-blur-2xl` on all interactive elements
- 15-20% white opacity backgrounds
- Subtle white borders (20-30% opacity)
- **Never uses uploaded wallpapers** (always uses gradient)

**Use Cases:**
- Modern, aesthetic interface
- Users wanting a unique visual experience
- Showcasing glassmorphism design trend

**Special Implementation Note:**
The translucent theme is **fundamentally different** from light/dark themes. It:
- Ignores wallpaper settings (always uses CSS gradient)
- Always uses "withoutWallpaper" style variants
- Requires `backdrop-blur` to work correctly
- Needs higher opacity (15-20%) than other transparent elements (5-10%)

---

## Theme Context Implementation

### File: `frontend/contexts/ThemeContext.tsx`

#### Type Definitions

```typescript
export type ThemeMode = 'light' | 'dark' | 'translucent';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
  isLight: boolean;
  isDark: boolean;
  isTranslucent: boolean;
  hasWallpaper: boolean;
  
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
```

#### State Initialization

```typescript
const [theme, setThemeState] = useState<ThemeMode>(() => {
  if (typeof window !== 'undefined') {
    let savedTheme = localStorage.getItem('systemTheme') || 'light';
    
    // Handle "system" theme by detecting OS preference
    if (savedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return savedTheme as ThemeMode;
  }
  return 'light'; // SSR default - MUST be 'light' for hydration consistency
});

const [wallpaper, setWallpaperState] = useState<string | null>(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('wallpaper') || null;
  }
  return null;
});
```

**Critical Notes:**
1. **SSR Default:** Always return `'light'` during SSR to match inline script
2. **System Theme Handling:** Convert `'system'` to actual `'light'` or `'dark'`
3. **localStorage Key:** Use `'systemTheme'` (not `'theme'`)

#### Derived State

```typescript
const isLight = theme === 'light';
const isDark = theme === 'dark';
const isTranslucent = theme === 'translucent';
const hasWallpaper = !!wallpaper;
```

#### Theme Setter with Side Effects

```typescript
const setTheme = (newTheme: ThemeMode) => {
  setThemeState(newTheme);
  
  // Persist to localStorage
  localStorage.setItem('systemTheme', newTheme);
  
  // Update document class for CSS
  document.documentElement.classList.remove('light', 'dark', 'translucent');
  document.documentElement.classList.add(newTheme);
  
  // Dispatch custom event for components that need to react
  window.dispatchEvent(new CustomEvent('themeChanged'));
};
```

#### Wallpaper Setter with Side Effects

```typescript
const setWallpaper = (newWallpaper: string | null) => {
  setWallpaperState(newWallpaper);
  
  if (newWallpaper) {
    localStorage.setItem('wallpaper', newWallpaper);
  } else {
    localStorage.removeItem('wallpaper');
  }
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('wallpaperChanged'));
};
```

#### Helper Function Examples

```typescript
const getCardClass = () => {
  if (isTranslucent) {
    // Translucent ALWAYS uses withoutWallpaper variant
    return hasWallpaper
      ? 'bg-white/10 backdrop-blur-lg border-white/10 shadow-xl'
      : 'bg-white/[0.15] backdrop-blur-2xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]';
  }
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
  if (isTranslucent) {
    // Subtle glassmorphism input
    return 'bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder-zinc-400 shadow-xl';
  }
  if (hasWallpaper) {
    return isLight
      ? 'bg-white/95 backdrop-blur-sm border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-lg'
      : 'bg-zinc-900/90 backdrop-blur-md border-white/20 text-white placeholder-zinc-500 shadow-xl';
  }
  return isLight
    ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
    : 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600';
};

const getTextClass = (variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
  if (variant === 'muted') {
    return 'text-zinc-500';
  }
  if (variant === 'secondary') {
    return isTranslucent ? 'text-zinc-400' : (isLight ? 'text-zinc-700' : 'text-zinc-400');
  }
  return isTranslucent ? 'text-white' : (isLight ? 'text-zinc-900' : 'text-zinc-100');
};
```

**Pattern:**
- Check `isTranslucent` first
- Then check `hasWallpaper` (if not translucent)
- Then check `isLight` vs `isDark`
- Return appropriate Tailwind classes

---

## Centralized Theme Styles

### File: `frontend/lib/themeStyles.ts`

This file contains ALL theme-dependent Tailwind class strings to ensure consistency and prevent brittleness.

#### Interface Definition

```typescript
export interface ThemeStyleConfig {
  card: {
    withWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  panel: { /* same structure */ };
  input: { /* same structure */ };
  button: {
    base: {
      withWallpaper: { light: string; dark: string; translucent: string; };
      withoutWallpaper: { light: string; dark: string; translucent: string; };
    };
    active: { /* same structure */ };
  };
  text: {
    primary: { light: string; dark: string; translucent: string; };
    secondary: { light: string; dark: string; translucent: string; };
  };
  homeActionButton: { /* withWallpaper/withoutWallpaper structure */ };
  homeChatTile: { /* withWallpaper/withoutWallpaper structure */ };
}
```

**Key Principles:**
1. **Nested Structure:** `component → wallpaperState → themeMode`
2. **Separate Text Styles:** Text doesn't have wallpaper variants (only theme variants)
3. **Button Variants:** Buttons have `base` and `active` sub-variants
4. **Component Isolation:** Special components (like `homeActionButton`) get dedicated entries

#### Complete Style Definitions

```typescript
export const themeStyles: ThemeStyleConfig = {
  card: {
    withWallpaper: {
      light: "bg-white/90 backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg",
      translucent: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl transition-all group cursor-pointer",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 hover:bg-white/[0.20] rounded-2xl transition-all group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
    }
  },
  
  panel: {
    withWallpaper: {
      light: "bg-white border border-zinc-200/50 rounded-xl p-4 shadow-xl",
      dark: "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl",
      translucent: "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl"
    },
    withoutWallpaper: {
      light: "bg-zinc-50 border border-zinc-300/40 rounded-xl p-4",
      dark: "bg-zinc-900/70 border border-zinc-950/80 rounded-xl p-4",
      translucent: "bg-zinc-900/70 backdrop-blur-xl border border-zinc-950/80 rounded-xl p-4"
    }
  },
  
  input: {
    withWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-lg hover:shadow-xl transition-shadow",
      dark: "bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-white",
      translucent: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow text-white"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow",
      dark: "bg-zinc-900/50 border border-zinc-700 rounded-3xl focus:border-zinc-600 focus:bg-zinc-900/70 text-white",
      translucent: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl focus:border-white/25 focus:bg-white/15 text-white shadow-xl"
    }
  },
  
  button: {
    base: {
      withWallpaper: {
        light: "bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 shadow-lg",
        dark: "bg-zinc-800/90 backdrop-blur-md shadow-xl border-2 border-white/30 hover:border-white/50 hover:bg-zinc-700/90 text-white font-semibold",
        translucent: "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/25 hover:bg-white/15 text-white shadow-xl"
      },
      withoutWallpaper: {
        light: "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900",
        dark: "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white",
        translucent: "border-white/20 backdrop-blur-xl text-white hover:border-white/25 hover:bg-white/10"
      }
    },
    active: {
      withWallpaper: {
        light: "bg-blue-600 border-blue-600 text-white font-semibold shadow-lg",
        dark: "bg-blue-500/40 border-2 border-blue-400 text-white font-bold shadow-xl backdrop-blur-md",
        translucent: "bg-blue-500/30 backdrop-blur-xl border border-blue-400/40 text-white font-bold shadow-2xl"
      },
      withoutWallpaper: {
        light: "border-blue-500 bg-blue-50 text-blue-700 font-semibold",
        dark: "border-zinc-600 bg-zinc-800 text-white",
        translucent: "border-blue-400/40 bg-blue-500/20 backdrop-blur-xl text-white shadow-xl"
      }
    }
  },
  
  text: {
    primary: {
      light: "text-zinc-900",
      dark: "text-white",
      translucent: "text-white"
    },
    secondary: {
      light: "text-zinc-700",
      dark: "text-zinc-400",
      translucent: "text-zinc-400"
    }
  },
  
  homeActionButton: {
    withWallpaper: {
      light: "bg-white/95 backdrop-blur-sm border border-zinc-300 hover:border-zinc-400 text-zinc-900 hover:bg-white shadow-lg hover:shadow-xl font-medium",
      dark: "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white hover:bg-white/15 shadow-xl hover:shadow-2xl font-medium",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 text-white hover:bg-white/[0.20] shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] font-medium"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-900 hover:bg-zinc-50 shadow-sm hover:shadow-md font-medium",
      dark: "bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-white hover:bg-zinc-800 shadow-sm hover:shadow-md font-medium",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 text-white hover:bg-white/[0.20] shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] font-medium"
    }
  },
  
  homeChatTile: {
    withWallpaper: {
      light: "bg-white/90 backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg",
      translucent: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl transition-all group cursor-pointer",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 hover:bg-white/[0.20] rounded-2xl transition-all group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
    }
  }
};
```

#### Helper Function

```typescript
export function getThemeStyle(
  component: keyof ThemeStyleConfig,
  hasWallpaper: boolean,
  isLight: boolean,
  variant?: string,
  isTranslucent?: boolean
): string {
  const componentStyles = themeStyles[component];
  
  // Handle text styles first (no wallpaper dependency)
  if (component === 'text' && variant) {
    const textConfig = componentStyles as ThemeStyleConfig['text'];
    if (variant === 'primary') {
      if (isTranslucent) return textConfig.primary.translucent;
      return isLight ? textConfig.primary.light : textConfig.primary.dark;
    }
    if (variant === 'secondary') {
      if (isTranslucent) return textConfig.secondary.translucent;
      return isLight ? textConfig.secondary.light : textConfig.secondary.dark;
    }
  }
  
  // Handle nested variants (like button.base or button.active)
  if (variant && typeof componentStyles === 'object' && variant in componentStyles) {
    const variantStyles = (componentStyles as any)[variant];
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isTranslucent ? 'translucent' : (isLight ? 'light' : 'dark');
    return variantStyles[wallpaperState][themeMode];
  }
  
  // Handle simple components (card, panel, input, homeActionButton, homeChatTile)
  if ('withWallpaper' in componentStyles) {
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isTranslucent ? 'translucent' : (isLight ? 'light' : 'dark');
    return componentStyles[wallpaperState][themeMode];
  }
  
  return '';
}
```

**Usage in Components:**

```typescript
import { getThemeStyle } from '@/lib/themeStyles';
import { useTheme } from '@/contexts/ThemeContext';

const { isLight, isTranslucent } = useTheme();
const hasWallpaper = true; // or false, depending on component state

const cardClass = getThemeStyle('card', hasWallpaper, isLight, undefined, isTranslucent);
const buttonClass = getThemeStyle('button', hasWallpaper, isLight, 'base', isTranslucent);
const textClass = getThemeStyle('text', hasWallpaper, isLight, 'primary', isTranslucent);
```

---

## Global CSS Themes

### File: `frontend/app/globals.css`

#### Theme Class Definitions

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

/* Translucent theme with animated gradient */
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
```

**Critical Notes:**
1. **Translucent Background:** Uses CSS gradient with animation (NOT an uploaded wallpaper)
2. **Animation:** 15-second infinite loop creates dynamic background
3. **Color Scheme:** Translucent uses `light` color-scheme for form controls
4. **Gradient Colors:** Purple/blue/pink gradient (`#667eea → #764ba2 → #f093fb → #4facfe → #00f2fe`)

---

## Wallpaper System Integration

### LocalStorage Keys

```typescript
// Theme
localStorage.getItem('systemTheme')      // 'light' | 'dark' | 'translucent' | 'system'
localStorage.setItem('systemTheme', theme)

// Wallpaper
localStorage.getItem('customBackground')  // 'true' | 'false'
localStorage.getItem('selectedWallpaperId') // ID of selected wallpaper
localStorage.getItem('chatWallpapers')    // JSON array of wallpaper objects
localStorage.getItem('wallpaperBlur')     // '0' to '20' (pixels)
```

### Wallpaper Object Structure

```typescript
interface Wallpaper {
  id: string;
  name: string;
  image: string; // base64 data URL
}
```

### Translucent Theme + Wallpaper Interaction

**Critical Rule:** When `theme === 'translucent'`, the application must:

1. **Ignore wallpaper data** - Don't render wallpaper `<div>` elements
2. **Use `withoutWallpaper` styles** - Even if wallpaper is configured
3. **Show gradient background** - From `globals.css` animation

**Implementation Pattern:**

```typescript
// In components that need wallpaper awareness
const { isTranslucent } = useTheme();
const effectiveHasWallpaper = isTranslucent ? false : hasWallpaper;

// Use effectiveHasWallpaper for all style decisions
const cardClass = getThemeStyle('card', effectiveHasWallpaper, isLight, undefined, isTranslucent);
```

---

## Theme Persistence and Events

### Custom Events

```typescript
// Dispatch when theme changes
window.dispatchEvent(new CustomEvent('themeChanged'));

// Dispatch when wallpaper changes
window.dispatchEvent(new CustomEvent('wallpaperChanged'));

// Dispatch when chat wallpaper changes (for ChatPanel)
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { 
  detail: wallpaperObject || null 
}));
```

### Event Listeners in Components

```typescript
useEffect(() => {
  const handleThemeChange = () => {
    // Re-sync with localStorage or context
    const newTheme = localStorage.getItem('systemTheme');
    // Update local state if needed
  };
  
  window.addEventListener('themeChanged', handleThemeChange);
  
  return () => {
    window.removeEventListener('themeChanged', handleThemeChange);
  };
}, []);
```

---

## Testing Checklist

When implementing the theme system, verify:

### Visual Testing
- [ ] Light theme displays correctly without wallpaper
- [ ] Light theme displays correctly with wallpaper
- [ ] Dark theme displays correctly without wallpaper
- [ ] Dark theme displays correctly with wallpaper
- [ ] Translucent theme shows animated gradient (ignores wallpaper)
- [ ] Translucent theme has frosted glass effect on all elements

### Functional Testing
- [ ] Theme persists across browser refresh
- [ ] Theme changes apply immediately (no refresh needed)
- [ ] Wallpaper upload works in light/dark themes
- [ ] Wallpaper blur control affects wallpaper appearance
- [ ] System theme preference is detected correctly
- [ ] No hydration warnings/errors in console

### Integration Testing
- [ ] Settings modal theme switcher updates entire app
- [ ] All components use theme-aware classes
- [ ] No hardcoded theme classes anywhere
- [ ] Sidebar matches current theme
- [ ] Chat panel matches current theme
- [ ] Home page matches current theme

---

## Common Issues and Solutions

### Issue: Hydration Mismatch

**Symptom:** Console warnings about server/client mismatch, flickering on load

**Solution:**
1. Ensure SSR default is `'light'`
2. Add inline script in `<head>` to set theme before first paint
3. Add `suppressHydrationWarning` to `<html>` and `<body>`
4. Use consistent localStorage key (`'systemTheme'`)

### Issue: Translucent Theme Shows Wallpaper

**Symptom:** Uploaded wallpaper appears behind translucent UI

**Solution:**
1. Use `effectiveHasWallpaper = isTranslucent ? false : hasWallpaper`
2. Don't render wallpaper `<div>` when `isTranslucent === true`
3. Ensure all components check `isTranslucent` before `hasWallpaper`

### Issue: Frosted Glass Effect Not Working

**Symptom:** Elements look solid/opaque despite `backdrop-blur` classes

**Solution:**
1. Ensure element has semi-transparent background (`bg-white/10`, not `bg-white`)
2. Ensure there's content behind element to blur (gradient or wallpaper)
3. Check parent containers don't have solid backgrounds blocking blur
4. Verify `backdrop-blur-*` is in Tailwind config if custom

### Issue: Theme Doesn't Persist

**Symptom:** Theme resets to light on refresh

**Solution:**
1. Verify `localStorage.setItem('systemTheme', theme)` is called
2. Check inline script reads `'systemTheme'` (not `'theme'`)
3. Ensure Settings component uses same key
4. Check for typos in localStorage key

---

## Next Document

Proceed to **02_LAYOUT_STRUCTURE.md** for root layout implementation details.

