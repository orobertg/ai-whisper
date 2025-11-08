# Theme System Quick Reference

## Import

```tsx
import { useTheme } from "@/contexts/ThemeContext";
```

## Hook Usage

```tsx
const { 
  // State
  theme,           // 'light' | 'dark'
  wallpaper,       // Wallpaper object or null
  isLight,         // boolean
  isDark,          // boolean
  hasWallpaper,    // boolean
  
  // Setters
  setTheme,        // (mode: 'light' | 'dark') => void
  setWallpaper,    // (wallpaper: Wallpaper | null) => void
  
  // Helper Functions
  getCardClass,
  getInputClass,
  getButtonClass,
  getTextClass,
  getBadgeClass,
  getKanbanColumnClass,
  getKanbanCardClass,
  getPriorityBadgeClass
} = useTheme();
```

## Common Patterns

### Cards

```tsx
<div className={getCardClass()}>
  {/* content */}
</div>
```

### Buttons

```tsx
<button className={getButtonClass('primary')}>Primary</button>
<button className={getButtonClass('secondary')}>Secondary</button>
<button className={getButtonClass('ghost')}>Ghost</button>
<button className={getButtonClass('secondary', true)}>Active</button>
```

### Text

```tsx
<h1 className={getTextClass('primary')}>Primary Text</h1>
<p className={getTextClass('secondary')}>Secondary Text</p>
<span className={getTextClass('muted')}>Muted Text</span>
```

### Inputs

```tsx
<input className={getInputClass()} />
<textarea className={getInputClass()} />
<select className={getInputClass()}>...</select>
```

### Badges

```tsx
<span className={getBadgeClass('blue')}>Badge</span>
<span className={getBadgeClass('green')}>Success</span>
<span className={getBadgeClass('red')}>Error</span>
<span className={getBadgeClass('yellow')}>Warning</span>
<span className={getBadgeClass('purple')}>Info</span>
```

## Color Reference

### Dark Theme (Primary)

| Element | Light | Dark |
|---------|-------|------|
| Primary BG | `white` | `zinc-900` |
| Secondary BG | `zinc-50` | `zinc-800` |
| Card BG | `white` | `zinc-900/50` |
| Primary Text | `zinc-900` | `zinc-100` |
| Secondary Text | `zinc-700` | `zinc-400` |
| Muted Text | `zinc-500` | `zinc-500` |
| Border | `zinc-200` | `zinc-700/800` |

### With Wallpaper (Dark)

| Element | Style |
|---------|-------|
| Card BG | `zinc-900/90` + `backdrop-blur-md` |
| Border | `white/20` to `white/50` |
| Text | `white` or `zinc-100` |
| Shadows | `shadow-xl` |

## Spacing

```
p-2   = 0.5rem (8px)   - Tight
p-3   = 0.75rem (12px) - Compact
p-4   = 1rem (16px)    - Standard
p-6   = 1.5rem (24px)  - Spacious
```

## Border Radius

```
rounded-md  = 0.375rem - Small
rounded-lg  = 0.5rem   - Medium (default)
rounded-xl  = 0.75rem  - Large
rounded-2xl = 1rem     - Extra Large
```

## Typography

```tsx
// Headings
text-4xl font-bold              // H1
text-2xl font-bold              // H2
text-xl font-semibold           // H3

// Body
text-sm font-medium             // Standard
text-xs                         // Small
text-xs ${getTextClass('muted')} // Muted
```

## Transitions

Always add smooth transitions:

```tsx
className="transition-colors duration-200"
className="transition-all duration-300"
```

## Testing Checklist

When styling a component, test:

- ✅ Light theme (no wallpaper)
- ✅ Dark theme (no wallpaper)
- ✅ Dark theme + wallpaper
- ✅ Hover states
- ✅ Active/selected states
- ✅ Text readability
- ✅ Border visibility

## Anti-Patterns to Avoid

❌ Don't hardcode colors:
```tsx
<div className="bg-gray-800 text-white"> {/* BAD */}
```

✅ Use theme helpers:
```tsx
<div className={getCardClass()}> {/* GOOD */}
  <span className={getTextClass('primary')}> {/* GOOD */}
```

❌ Don't create theme state in components:
```tsx
const [isDark, setIsDark] = useState(false); {/* BAD */}
```

✅ Use the hook:
```tsx
const { isDark } = useTheme(); {/* GOOD */}
```

## Common Mistakes

### 1. Forgetting wallpaper mode
```tsx
// Bad - only works without wallpaper
<div className={isLight ? "bg-white" : "bg-zinc-900"}>

// Good - handles wallpaper
<div className={getCardClass()}>
```

### 2. Low contrast text
```tsx
// Bad - hard to read in dark mode
<span className="text-gray-400">Important text</span>

// Good - readable
<span className={getTextClass('secondary')}>Important text</span>
```

### 3. Missing hover states
```tsx
// Bad - no feedback
<button className={getButtonClass('secondary')}>

// Good - clear interaction
<button className={`${getButtonClass('secondary')} transition-colors`}>
```

## Component Template

```tsx
"use client";
import { useTheme } from "@/contexts/ThemeContext";

export function MyComponent() {
  const { getCardClass, getTextClass, getButtonClass } = useTheme();

  return (
    <div className={getCardClass()}>
      <h2 className={`${getTextClass('primary')} text-xl font-bold mb-3`}>
        Title
      </h2>
      
      <p className={`${getTextClass('secondary')} mb-4`}>
        Description text here
      </p>
      
      <button className={getButtonClass('primary')}>
        Action
      </button>
    </div>
  );
}
```

## Resources

- **Full Documentation**: `docs/THEME_SYSTEM.md`
- **ThemeContext Source**: `frontend/contexts/ThemeContext.tsx`
- **Example Components**:
  - `frontend/components/HomeContent.tsx`
  - `frontend/components/Sidebar.tsx`
  - `frontend/components/CustomSelect.tsx`
  - `frontend/components/ChatPanel.tsx`

