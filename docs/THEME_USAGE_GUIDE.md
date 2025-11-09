# Theme Usage Guide

## Overview
AI Whisper uses a centralized theme system via `ThemeContext` to ensure consistent styling across all screens. **Always use the theme context helpers instead of hardcoding styles.**

## Quick Start

```typescript
import { useTheme } from "@/contexts/ThemeContext";

export default function MyComponent() {
  const { isLight, getHeaderButtonClass, getSelectClass } = useTheme();
  
  return (
    <button className={getHeaderButtonClass()}>
      Settings
    </button>
  );
}
```

## Available Theme Helpers

### Core Properties
- `isLight: boolean` - True if light theme is active
- `isDark: boolean` - True if dark theme is active
- `hasWallpaper: boolean` - True if user has selected a wallpaper
- `theme: 'light' | 'dark'` - Current theme mode

### UI Component Helpers

#### `getCardClass(): string`
Use for cards, panels, and containers.
```typescript
<div className={`${getCardClass()} p-4 rounded-lg`}>
  Card content
</div>
```
- Light: `bg-white border-zinc-200`
- Dark: `bg-zinc-900/50 border-zinc-800`
- With wallpaper: Adds backdrop blur and transparency

#### `getInputClass(): string`
Use for text inputs, textareas, and form fields.
```typescript
<input className={`${getInputClass()} px-4 py-2 rounded-lg`} />
```

#### `getButtonClass(variant?: 'primary' | 'secondary' | 'ghost'): string`
Use for buttons.
```typescript
<button className={getButtonClass('primary')}>Submit</button>
<button className={getButtonClass('secondary')}>Cancel</button>
<button className={getButtonClass('ghost')}>Link</button>
```

#### `getTextClass(variant?: 'primary' | 'secondary' | 'muted'): string`
Use for text elements.
```typescript
<h1 className={getTextClass('primary')}>Title</h1>
<p className={getTextClass('secondary')}>Description</p>
<span className={getTextClass('muted')}>Hint text</span>
```

#### `getBadgeClass(color: 'red' | 'orange' | 'green' | 'blue' | 'purple'): string`
Use for badges and tags.
```typescript
<span className={`${getBadgeClass('blue')} px-2 py-1 rounded`}>
  New
</span>
```

### Header/Navigation Helpers

#### `getHeaderButtonClass(): string`
**USE THIS for all header buttons (settings, export, etc.)**
```typescript
<button className={`p-2 rounded-lg transition-colors ${getHeaderButtonClass()}`}>
  <SettingsIcon />
</button>
```
- Light: White background, dark text, zinc borders
- Dark: Zinc-800 background, light text, zinc-700 borders

#### `getSelectClass(): { isDark: boolean }`
**USE THIS for CustomSelect components**
```typescript
<CustomSelect
  value={value}
  onChange={onChange}
  options={options}
  {...getSelectClass()}
/>
```

#### `getSidebarClass(): string`
Use for sidebar backgrounds.
```typescript
<aside className={`${getSidebarClass()} border-r`}>
```

#### `getBorderClass(): string`
Use for consistent borders.
```typescript
<div className={`border-b ${getBorderClass()}`}>
```

### Kanban-Specific Helpers

#### `getKanbanColumnClass(): string`
Use for Kanban column containers.

#### `getKanbanCardClass(): string`
Use for Kanban task cards.

#### `getPriorityBadgeClass(priority: 'low' | 'medium' | 'high'): string`
Use for priority badges.

## Best Practices

### ✅ DO
```typescript
// Import theme context
import { useTheme } from "@/contexts/ThemeContext";

// Use theme helpers
const { getHeaderButtonClass, getSelectClass } = useTheme();

// Apply helpers to components
<button className={getHeaderButtonClass()}>Settings</button>
<CustomSelect {...getSelectClass()} />
```

### ❌ DON'T
```typescript
// Don't hardcode theme styles
<button className="bg-white border-zinc-300 text-zinc-700">Settings</button>

// Don't manually check theme
const isDark = localStorage.getItem('theme') === 'dark';

// Don't duplicate styling logic
className={isLight ? "bg-white" : "bg-zinc-900"}
```

## Adding New Screens

When creating a new screen:

1. **Import theme context at the top**
   ```typescript
   import { useTheme } from "@/contexts/ThemeContext";
   ```

2. **Use theme helpers throughout**
   ```typescript
   const { isLight, getHeaderButtonClass, getCardClass } = useTheme();
   ```

3. **Never hardcode theme-specific classes**
   - Use `getHeaderButtonClass()` for header buttons
   - Use `getSelectClass()` for dropdowns
   - Use `getCardClass()` for containers
   - Use `getTextClass()` for text

4. **Test both themes**
   - Switch to light theme and verify all elements are visible
   - Switch to dark theme and verify all elements are visible
   - Test with and without wallpapers

## Common Patterns

### Header with Model Selector and Settings
```typescript
const { getHeaderButtonClass, getSelectClass } = useTheme();

<header className="flex items-center gap-3">
  <CustomSelect
    value={selectedModel}
    onChange={onModelChange}
    options={options}
    {...getSelectClass()}
  />
  <button className={`p-2 rounded-lg transition-colors ${getHeaderButtonClass()}`}>
    <SettingsIcon />
  </button>
</header>
```

### Sidebar
```typescript
const { getSidebarClass, getBorderClass } = useTheme();

<aside className={`${getSidebarClass()} border-r ${getBorderClass()}`}>
  {/* sidebar content */}
</aside>
```

### Card with Text
```typescript
const { getCardClass, getTextClass } = useTheme();

<div className={`${getCardClass()} p-4 rounded-lg`}>
  <h3 className={getTextClass('primary')}>Title</h3>
  <p className={getTextClass('secondary')}>Description</p>
</div>
```

## Extending the Theme System

If you need a new helper function:

1. Add it to `ThemeContextType` interface in `frontend/contexts/ThemeContext.tsx`
2. Implement the function in the `ThemeProvider`
3. Add it to the context provider's value object
4. Document it in this guide

Example:
```typescript
// In ThemeContext.tsx
const getMyNewHelper = () => {
  return isLight
    ? 'light-mode-classes'
    : 'dark-mode-classes';
};

// In provider value
<ThemeContext.Provider value={{
  ...existing,
  getMyNewHelper,
}}>
```

## Migration Checklist

When updating an existing component to use the theme system:

- [ ] Import `useTheme` from `@/contexts/ThemeContext`
- [ ] Replace hardcoded `isLight` checks with `useTheme().isLight`
- [ ] Replace header buttons with `getHeaderButtonClass()`
- [ ] Replace `CustomSelect` `isDark` prop with `{...getSelectClass()}`
- [ ] Replace sidebar styles with `getSidebarClass()`
- [ ] Test in both light and dark themes
- [ ] Test with and without wallpapers

## Questions?

If you're unsure which helper to use, check:
1. This guide for examples
2. `ThemeContext.tsx` for available helpers
3. Existing components (HomeContent, Sidebar) for usage patterns

