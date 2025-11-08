# Theme System Documentation

## Overview

AIWhisper uses a centralized theme management system built with React Context. This ensures consistent styling across all components and makes it easy to maintain light/dark themes with optional wallpaper support.

## Architecture

### ThemeContext (`frontend/contexts/ThemeContext.tsx`)

The `ThemeContext` is the single source of truth for all theme-related state and styling utilities.

**Core State:**
- `theme`: Current theme mode (`'light'` | `'dark'`)
- `wallpaper`: Active wallpaper with metadata (brightness, blur, etc.)
- `isLight`: Boolean helper for light theme
- `isDark`: Boolean helper for dark theme
- `hasWallpaper`: Boolean helper for wallpaper presence

**Helper Functions:**
- `getCardClass()`: Returns classes for card/panel components
- `getInputClass()`: Returns classes for input fields
- `getButtonClass(type, isActive)`: Returns classes for buttons
- `getTextClass(variant)`: Returns classes for text elements
- `getBadgeClass(color)`: Returns classes for badges/tags
- `getKanbanColumnClass()`: Kanban-specific column styling
- `getKanbanCardClass()`: Kanban-specific card styling
- `getPriorityBadgeClass(priority)`: Priority badge styling

## Design Tokens

### Color Palette

#### Light Theme
```
Background Primary: white
Background Secondary: zinc-50
Text Primary: zinc-900
Text Secondary: zinc-700
Text Muted: zinc-500
Border: zinc-200 / zinc-300
Hover: zinc-50
Active: blue-50
```

#### Dark Theme (Synapse-Inspired)
```
Background Primary: zinc-900 / zinc-900/50
Background Secondary: zinc-800
Text Primary: zinc-100 (pure white contrast)
Text Secondary: zinc-400
Text Muted: zinc-500 / zinc-600
Border: zinc-700 / zinc-800
Hover: zinc-800
Active: blue-500/20
```

#### Wallpaper Overlays (Dark Theme)
```
Background: zinc-800/90 with backdrop-blur-md
Borders: white/20 to white/50
Glass-morphism: backdrop-blur-md + semi-transparent backgrounds
Shadows: shadow-xl for depth
```

### Typography Scale

```
Heading 1: text-4xl font-bold
Heading 2: text-2xl font-bold
Heading 3: text-xl font-semibold
Body: text-sm font-medium
Small: text-xs
Muted: text-xs text-zinc-500 (light) / text-zinc-600 (dark)
```

### Spacing & Borders

```
Card Padding: p-3 to p-6 (depending on size)
Input Padding: px-4 py-2.5
Border Radius: 
  - Small: rounded-md (0.375rem)
  - Medium: rounded-lg (0.5rem)
  - Large: rounded-xl (0.75rem)
  - Extra Large: rounded-2xl (1rem)
Border Width: border (1px) or border-2 (2px for emphasis)
```

## Usage Guide

### Basic Setup

1. **Wrap your app with ThemeProvider** (already done in `frontend/app/layout.tsx`):

```tsx
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

2. **Use the theme in any component**:

```tsx
import { useTheme } from "@/contexts/ThemeContext";

export function MyComponent() {
  const { 
    isLight, 
    isDark, 
    hasWallpaper, 
    getCardClass, 
    getTextClass 
  } = useTheme();

  return (
    <div className={getCardClass()}>
      <h2 className={`${getTextClass('primary')} text-xl font-bold`}>
        My Component
      </h2>
      <p className={getTextClass('secondary')}>
        Some content here
      </p>
    </div>
  );
}
```

### Component Patterns

#### Cards & Panels

```tsx
// Basic card
<div className={getCardClass()}>
  <h3 className={getTextClass('primary')}>Title</h3>
  <p className={getTextClass('secondary')}>Content</p>
</div>

// Card with custom classes
<div className={`${getCardClass()} hover:scale-105 transition-transform`}>
  {/* content */}
</div>
```

#### Buttons

```tsx
// Primary button
<button className={getButtonClass('primary')}>
  Save Changes
</button>

// Secondary button
<button className={getButtonClass('secondary')}>
  Cancel
</button>

// Ghost button
<button className={getButtonClass('ghost')}>
  Learn More
</button>

// Active state
<button className={getButtonClass('secondary', true)}>
  Selected
</button>
```

#### Input Fields

```tsx
<input 
  type="text"
  className={getInputClass()}
  placeholder="Enter text..."
/>

// With custom classes
<textarea 
  className={`${getInputClass()} resize-none`}
  rows={4}
/>
```

#### Text Elements

```tsx
// Primary heading
<h1 className={`${getTextClass('primary')} text-2xl font-bold`}>
  Main Title
</h1>

// Secondary text
<p className={getTextClass('secondary')}>
  Description or subtitle
</p>

// Muted text (timestamps, labels)
<span className={getTextClass('muted')}>
  Updated 2 hours ago
</span>
```

#### Badges

```tsx
<span className={getBadgeClass('blue')}>New</span>
<span className={getBadgeClass('green')}>Active</span>
<span className={getBadgeClass('red')}>Error</span>
<span className={getBadgeClass('yellow')}>Warning</span>
<span className={getBadgeClass('purple')}>Beta</span>
```

### ReactFlow (Mind-Map) Theming

For ReactFlow canvas components, theme styling is applied through a combination of:

1. **Component-level props**: Background, MiniMap colors
2. **Global CSS overrides**: Controls, edge paths

```tsx
import { useTheme } from "@/contexts/ThemeContext";
import ReactFlow, { Background, BackgroundVariant } from 'reactflow';

function MindMap() {
  const { isLight } = useTheme();
  
  return (
    <ReactFlow
      defaultEdgeOptions={{
        style: { 
          stroke: isLight ? '#64748b' : '#71717a',
          strokeWidth: 2 
        }
      }}
    >
      <Controls />
      <MiniMap 
        className={isLight ? 'bg-zinc-100' : 'bg-zinc-800'}
      />
      <Background 
        variant={BackgroundVariant.Dots}
        className={isLight ? 'bg-white' : 'bg-zinc-900'} 
      />
    </ReactFlow>
  );
}
```

**Global CSS** (`frontend/app/globals.css`):
```css
/* Dark theme ReactFlow controls */
html.dark .react-flow__controls {
  @apply bg-zinc-900 border-zinc-700;
}

html.dark .react-flow__controls button {
  @apply bg-zinc-900 border-zinc-700 text-zinc-100;
}

html.dark .react-flow__controls button:hover {
  @apply bg-zinc-800;
}
```

### Advanced Patterns

#### Conditional Styling Based on Theme/Wallpaper

```tsx
function MyComponent() {
  const { isLight, hasWallpaper, getCardClass, getTextClass } = useTheme();

  // Use helper functions for most cases
  const cardClass = getCardClass();
  
  // Manual conditional styling for special cases
  const specialClass = hasWallpaper
    ? isLight
      ? "bg-white/95 backdrop-blur-lg"
      : "bg-zinc-900/90 backdrop-blur-xl border-white/20"
    : isLight
      ? "bg-white"
      : "bg-zinc-900";

  return (
    <div className={cardClass}>
      {/* content */}
    </div>
  );
}
```

#### Responsive Design with Theme

```tsx
function ResponsiveCard() {
  const { getCardClass, getTextClass } = useTheme();

  return (
    <div className={`${getCardClass()} sm:p-4 md:p-6 lg:p-8`}>
      <h2 className={`${getTextClass('primary')} text-lg md:text-xl lg:text-2xl`}>
        Responsive Title
      </h2>
    </div>
  );
}
```

## Best Practices

### DO ✅

1. **Always use ThemeContext helpers** for standard components
2. **Use semantic color names** (primary, secondary, muted)
3. **Test in all three modes**: Light theme, Dark theme, Dark theme + wallpaper
4. **Maintain consistent spacing** using Tailwind's spacing scale
5. **Use backdrop-blur for glass-morphism** when wallpaper is active
6. **Keep text readable** with proper contrast ratios
7. **Use font-medium or font-semibold** for primary text in dark mode
8. **Add smooth transitions** for theme changes (`transition-colors`)

### DON'T ❌

1. **Don't hardcode colors** like `bg-gray-800` or `text-white`
2. **Don't create custom theme state** in individual components
3. **Don't forget wallpaper mode** when styling
4. **Don't use low contrast colors** (e.g., gray-300 on gray-400)
5. **Don't mix color systems** (stick to zinc for neutrals)
6. **Don't ignore hover/active states**
7. **Don't create overly complex conditional styles** (use helper functions)

## Component Checklist

When creating a new component, ensure:

- [ ] Imports `useTheme` from `@/contexts/ThemeContext`
- [ ] Uses helper functions (`getCardClass`, `getTextClass`, etc.)
- [ ] Tested in light theme
- [ ] Tested in dark theme
- [ ] Tested in dark theme with wallpaper
- [ ] Text is readable in all modes
- [ ] Borders are visible but subtle
- [ ] Hover states are defined
- [ ] Active/selected states are clear
- [ ] Smooth transitions are applied
- [ ] No hardcoded colors

## Theming Workflow

### Changing Theme Mode

```tsx
const { theme, setTheme } = useTheme();

// Toggle theme
setTheme(theme === 'light' ? 'dark' : 'light');
```

### Applying Wallpaper

```tsx
const { setWallpaper } = useTheme();

// Set wallpaper
setWallpaper({
  id: '123',
  url: '/uploads/wallpaper.jpg',
  name: 'My Wallpaper',
  brightness: 'dark',
  blur: 5
});

// Remove wallpaper
setWallpaper(null);
```

## Common Issues & Solutions

### Issue: Component looks different than expected

**Solution**: Check if you're using helper functions consistently. Compare with existing components like `HomeContent.tsx` or `Sidebar.tsx`.

### Issue: Text not readable on wallpaper

**Solution**: Ensure you're using the wallpaper-specific styles with backdrop-blur and semi-transparent backgrounds.

### Issue: Theme not updating

**Solution**: Make sure component is wrapped in `ThemeProvider` and you're using the `useTheme()` hook.

### Issue: Inconsistent colors across components

**Solution**: Always use `getTextClass()`, `getCardClass()`, etc. Don't create custom color logic.

## Migration Guide

### Updating Existing Components

**Before:**
```tsx
<div className="bg-zinc-800 border border-zinc-700 text-white p-4">
  <h2 className="text-white font-bold">Title</h2>
  <p className="text-gray-400">Description</p>
</div>
```

**After:**
```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { getCardClass, getTextClass } = useTheme();
  
  return (
    <div className={getCardClass()}>
      <h2 className={`${getTextClass('primary')} font-bold`}>Title</h2>
      <p className={getTextClass('secondary')}>Description</p>
    </div>
  );
}
```

## Examples

See the following components for reference implementations:

- **Cards/Panels**: `frontend/components/HomeContent.tsx` (recent chats, quick actions)
- **Buttons**: `frontend/components/HomeContent.tsx` (project buttons)
- **Inputs**: `frontend/components/HomeContent.tsx` (chat input)
- **Dropdowns**: `frontend/components/CustomSelect.tsx`
- **Sidebar**: `frontend/components/Sidebar.tsx`
- **Chat Interface**: `frontend/components/ChatPanel.tsx`
- **Mind-Map Canvas**: `frontend/components/MindMap.tsx` (ReactFlow with theme support)

## Future Enhancements

Potential improvements to the theme system:

- [ ] Custom color schemes (allow users to define accent colors)
- [ ] High contrast mode for accessibility
- [ ] Automatic theme switching based on time of day
- [ ] Per-project theme preferences
- [ ] Theme presets (Synapse, VS Code Dark, etc.)
- [ ] Export/import theme configurations

## Support

For questions or issues with the theme system, refer to:
- `docs/THEME_TROUBLESHOOTING.md` (coming soon)
- Component examples in the codebase
- ThemeContext source code with inline comments

