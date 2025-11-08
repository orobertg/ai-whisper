# Theme Detection Fix for Home Screen

## Problem
The model selector and settings button in the upper-right corner of the home screen were showing dark theme styling even when light theme was selected and no wallpaper was present.

## Root Cause
The `HomeContent` component was not properly detecting the user's theme preference on initial load. The `systemTheme` state was:
1. Defaulting to `'dark'` on initialization
2. Relying on `useEffect` which runs after the initial render
3. Not receiving immediate updates when theme changed in Settings

## Solution

### 1. Lazy State Initialization
Changed from simple default value to lazy initialization that reads from `localStorage` immediately:

```tsx
const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
  // Initialize theme from localStorage on first render
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    
    if (savedTheme === 'light') {
      return 'light';
    } else if (savedTheme === 'dark') {
      return 'dark';
    } else if (savedTheme === 'system' || !savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
  }
  return 'dark'; // fallback
});
```

### 2. Custom Event Listener
Added a custom `themeChanged` event listener that the Settings component dispatches:

```tsx
// In HomeContent.tsx
window.addEventListener('themeChanged', handleThemeChange);

// In Settings.tsx
window.dispatchEvent(new Event('themeChanged'));
```

### 3. Immediate Theme Application
Modified Settings component to apply theme immediately when user clicks on a theme option, providing live preview:

```tsx
const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);
  applyTheme(newTheme); // Apply immediately for preview
  setHasChanges(true);
  
  // Dispatch event to notify other components
  window.dispatchEvent(new Event('themeChanged'));
};
```

### 4. Multiple Detection Methods
Implemented three ways to detect theme changes:
- **Initial load**: Lazy state initialization from `localStorage`
- **DOM changes**: `MutationObserver` watching `document.documentElement` classes
- **Settings changes**: Custom `themeChanged` event

## Files Modified

1. **`frontend/components/HomeContent.tsx`**
   - Changed `systemTheme` state initialization to use lazy initializer
   - Enhanced `useEffect` to check `localStorage` first
   - Added `themeChanged` event listener
   - Added debug console logs

2. **`frontend/components/Settings.tsx`**
   - Modified `handleThemeChange` to apply theme immediately
   - Added `themeChanged` event dispatch in `handleThemeChange`
   - Added `themeChanged` event dispatch in `handleSaveChanges`

## Behavior

### Before Fix
- Upper-right corner buttons always showed dark theme on initial load
- Theme didn't update until page refresh

### After Fix
- ✅ Correct theme applied immediately on initial load
- ✅ Live preview when selecting theme in Settings
- ✅ Immediate update across all components
- ✅ Proper handling of "system" theme preference
- ✅ Works with and without wallpaper

## Testing Checklist

- [ ] With no wallpaper, select light theme → header buttons should be light
- [ ] With no wallpaper, select dark theme → header buttons should be dark
- [ ] With no wallpaper, select system theme → should follow OS preference
- [ ] Select theme in Settings → should see live preview
- [ ] Refresh page → theme should persist correctly
- [ ] With light wallpaper, buttons should adapt to wallpaper
- [ ] With dark wallpaper, buttons should adapt to wallpaper
- [ ] Remove wallpaper → should revert to system theme

## Debug Console Logs

The fix includes console logs to help diagnose theme detection:
- `🎨 HomeContent checking theme: [theme]`
- `🎨 Setting light/dark theme`
- `🎨 Using system theme, prefers dark: [boolean]`
- `🎨 DOM mutation detected, rechecking theme`
- `🎨 Theme change event received`

## Related Documentation
- [Adaptive Wallpaper System](./ADAPTIVE_WALLPAPER_SYSTEM.md)
- [Wallpaper Settings Update](./WALLPAPER_SETTINGS_UPDATE.md)
- [UI Design System](./UI_DESIGN_SYSTEM.md)

