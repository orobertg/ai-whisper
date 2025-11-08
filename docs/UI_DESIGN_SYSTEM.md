# AI Whisper - UI Design System

## Overview

This document defines the design system and component usage guidelines for AI Whisper to maintain a consistent, professional look and feel throughout the application.

---

## Color Palette

### Selection & Interactive States

```css
/* Selection States */
Selected Item:       bg-zinc-100 text-zinc-900 font-medium
Hover State:         bg-zinc-50 text-zinc-900
Default State:       text-zinc-700

/* Backgrounds */
White Background:    bg-white
Light Background:    bg-zinc-50
Card Background:     bg-zinc-100

/* Borders */
Light Border:        border-zinc-200
Medium Border:       border-zinc-300
Hover Border:        border-zinc-400
Focus Border:        border-blue-400

/* Text Colors */
Primary Text:        text-zinc-900
Secondary Text:      text-zinc-700
Muted Text:          text-zinc-500
Placeholder:         text-zinc-400

/* Shadows */
Standard Shadow:     shadow-lg
Strong Shadow:       shadow-xl
```

### Dark Theme (Sidebar)

```css
Background:          bg-zinc-900/50
Selected Item:       bg-zinc-100 text-zinc-900 font-medium (light!)
Hover State:         bg-zinc-800
Border:              border-zinc-800
Text:                text-gray-300
```

**Important:** Even in dark-themed areas (like the sidebar), selections use **light gray** (`bg-zinc-100`) for consistency.

---

## Custom Components

### 1. CustomSelect Component

**Location:** `frontend/components/CustomSelect.tsx`

**Purpose:** A custom dropdown selector that replaces native HTML `<select>` elements throughout the application.

#### Props

```typescript
interface CustomSelectProps {
  value: string;              // Current selected value
  onChange: (value: string) => void;  // Callback when selection changes
  options: string[];          // Array of options to display
  placeholder?: string;       // Placeholder text (default: "Select")
  label?: string;            // Optional label above the select
  disabled?: boolean;        // Disable the dropdown
  className?: string;        // Additional CSS classes
}
```

#### Usage Example

```tsx
import CustomSelect from "./CustomSelect";

<CustomSelect
  value={selectedModel}
  onChange={setSelectedModel}
  options={["Option 1", "Option 2", "Option 3"]}
  placeholder="Select an option"
  label="Model Selection"
/>
```

#### Visual States

**Closed State:**
- Border: `border-zinc-300` (default)
- Background: `bg-white`
- Text: `text-zinc-900` (if value selected) or `text-zinc-500` (placeholder)

**Open State:**
- Border: `border-blue-400` (blue accent)
- Dropdown: White background with light border
- Arrow icon rotates 180°

**Option States:**
- **Default:** `text-zinc-700`
- **Hover:** `bg-zinc-50 text-zinc-900`
- **Selected:** `bg-zinc-100 text-zinc-900 font-medium` with checkmark icon

#### Features

- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Click outside to close
- ✅ Checkmark icon for selected item
- ✅ Smooth animations
- ✅ Accessibility support
- ✅ Disabled state support

#### Current Usage Locations

1. **Settings → AI Providers → Model Selection**
   ```tsx
   <CustomSelect
     value={model}
     onChange={(value) => setModel(value)}
     options={availableModels}
     placeholder="Select a model"
   />
   ```

2. **Home Page → Chat Input → Model Selection**
   ```tsx
   <CustomSelect
     value={selectedModel}
     onChange={setSelectedModel}
     options={["Ollama - Llama 3.2", "OpenAI - GPT-4", ...]}
     placeholder="Select a model"
   />
   ```

---

## Selection States Guidelines

### Standard Light Theme Selection

Use this pattern for **all** selectable items in light-themed areas:

```tsx
className={`... ${
  isSelected 
    ? "bg-zinc-100 text-zinc-900 font-medium" 
    : "text-zinc-700 hover:bg-zinc-50"
}`}
```

**Examples:**
- Dropdown menu items
- List items
- Navigation items
- Filter options
- Template cards

### Dark Theme Selection (Sidebar)

Even in dark areas, use **light gray** for selections:

```tsx
className={`... ${
  isSelected 
    ? "bg-zinc-100 text-zinc-900 font-medium"  // Light gray!
    : "text-gray-300 hover:bg-zinc-800"
}`}
```

**Important:** We intentionally use light backgrounds for selections even in dark areas for:
- Consistency across the app
- Better visibility
- Professional appearance

**Examples:**
- Sidebar folder selection
- Sidebar chat selection
- Collapsed sidebar icons

---

## Popup Menus & Tooltips

### Standard Popup Style

All popup menus should use this consistent style:

```tsx
<div className="fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-xl">
  {/* Header (optional) */}
  <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
    Header Text
  </div>
  
  {/* Menu Items */}
  <button className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
    isSelected 
      ? "bg-zinc-100 text-zinc-900 font-medium" 
      : "text-zinc-700 hover:bg-zinc-50"
  }`}>
    <Icon size={14} />
    Item Label
  </button>
</div>
```

### Tooltip Style

For simple information tooltips:

```tsx
<div className="fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-xl px-4 py-3">
  <p className="text-sm text-zinc-900 font-medium">Title</p>
  <p className="text-xs text-zinc-500 mt-1">Description</p>
</div>
```

### Current Usage Locations

1. **Sidebar → Folders Popup (Collapsed)**
   - White background
   - Light gray selection
   - Header with border separator

2. **Sidebar → Chat Tooltips (Collapsed)**
   - White background
   - Simple card layout
   - Title + date

---

## Button Styles

### Primary Button

```tsx
<button className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors">
  Primary Action
</button>
```

### Secondary Button

```tsx
<button className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-sm font-medium transition-colors">
  Secondary Action
</button>
```

### Outline Button

```tsx
<button className="px-4 py-2.5 bg-transparent border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 rounded-xl text-sm font-medium transition-colors">
  Outline Action
</button>
```

---

## Input Fields

### Standard Text Input

```tsx
<input
  type="text"
  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text..."
/>
```

### Textarea

```tsx
<textarea
  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
  rows={4}
  placeholder="Enter text..."
/>
```

---

## Layout Guidelines

### Spacing Scale

```css
xs:  0.25rem (1px)
sm:  0.5rem  (2px)
md:  1rem    (4px)
lg:  1.5rem  (6px)
xl:  2rem    (8px)
2xl: 2.5rem  (10px)
```

### Border Radius

```css
Small:    rounded-md   (6px)
Medium:   rounded-lg   (8px)
Large:    rounded-xl   (12px)
X-Large:  rounded-2xl  (16px)
Round:    rounded-3xl  (24px)
```

### Common Padding Patterns

```css
Compact Button:     px-3 py-1.5
Standard Button:    px-4 py-2.5
Large Button:       px-6 py-3

Compact Card:       p-3
Standard Card:      p-4
Large Card:         p-6

Input Fields:       px-4 py-2.5
Dropdown Items:     px-4 py-2.5
```

---

## Design Principles

### 1. Consistency is Key

**Always use:**
- `bg-zinc-100` for selected states
- `bg-zinc-50` for hover states
- `border-zinc-200` for light borders
- `text-zinc-900` for primary text

**Never use:**
- Blue backgrounds for selections (use `bg-zinc-100` instead)
- Black backgrounds for selections in light themes
- Inconsistent border radius sizes
- Different shadow weights for similar components

### 2. Light Gray Selection Everywhere

The signature of our design system is the **light gray selection** (`bg-zinc-100`). This applies to:
- Dropdown menu items
- Sidebar selections
- List items
- Navigation items
- Filter chips
- Template cards

### 3. White Popups & Overlays

All popup menus, dropdowns, and tooltips should have:
- White background (`bg-white`)
- Light border (`border-zinc-200`)
- Strong shadow (`shadow-xl`)
- Clean, minimal design

### 4. Progressive Disclosure

Use hover states to show additional actions:
- Hover to show delete icons
- Hover to show tooltips
- Hover to lighten backgrounds
- Hover to darken borders

---

## Component Checklist

When creating or modifying interactive components, ensure:

- [ ] Selection states use `bg-zinc-100 text-zinc-900 font-medium`
- [ ] Hover states use `bg-zinc-50`
- [ ] Borders use `border-zinc-200` or `border-zinc-300`
- [ ] Focus states have blue ring (`focus:ring-2 focus:ring-blue-500`)
- [ ] Transitions are smooth (`transition-colors` or `transition-all`)
- [ ] Icons are sized consistently (14-20px for UI elements)
- [ ] Text sizes are appropriate (text-xs to text-sm for UI)
- [ ] Shadows are used for depth (`shadow-lg` or `shadow-xl`)
- [ ] Border radius matches the design system
- [ ] Disabled states are visually distinct

---

## Migration Guide

### Replacing Native Select Elements

**Before:**
```tsx
<select className="...">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

**After:**
```tsx
import CustomSelect from "./CustomSelect";

<CustomSelect
  value={selectedValue}
  onChange={setSelectedValue}
  options={["Option 1", "Option 2"]}
/>
```

### Updating Selection Styles

**Before:**
```tsx
className={isSelected ? "bg-blue-500 text-white" : "text-gray-700"}
```

**After:**
```tsx
className={isSelected 
  ? "bg-zinc-100 text-zinc-900 font-medium" 
  : "text-zinc-700 hover:bg-zinc-50"
}
```

---

## Future Considerations

### Planned Components

1. **CustomCheckbox** - Styled checkboxes matching the design system
2. **CustomRadio** - Styled radio buttons
3. **CustomToggle** - Toggle switches for settings
4. **CustomModal** - Consistent modal dialogs
5. **CustomToast** - Notification toasts

### Expansion Guidelines

When adding new components:
1. Follow the established color palette
2. Use light gray (`bg-zinc-100`) for selections
3. Maintain consistent spacing and sizing
4. Add proper accessibility support
5. Include keyboard navigation
6. Document usage in this file

---

## References

### Key Files

- **CustomSelect Component:** `frontend/components/CustomSelect.tsx`
- **Sidebar Component:** `frontend/components/Sidebar.tsx`
- **Settings Modal:** `frontend/components/Settings.tsx`
- **Provider Settings:** `frontend/components/ProviderSettings.tsx`
- **Home Content:** `frontend/components/HomeContent.tsx`

### Color Reference

```css
/* Zinc Gray Scale (Our Primary Scale) */
zinc-50:   #fafafa
zinc-100:  #f4f4f5  ← Selection background
zinc-200:  #e4e4e7  ← Borders
zinc-300:  #d4d4d8  ← Input borders
zinc-400:  #a1a1aa  ← Placeholder text
zinc-500:  #71717a  ← Muted text
zinc-700:  #3f3f46  ← Secondary text
zinc-800:  #27272a  ← Hover in dark areas
zinc-900:  #18181b  ← Primary text

/* Accent Colors */
blue-400:  #60a5fa  ← Focus border
blue-500:  #3b82f6  ← Focus ring
blue-600:  #2563eb  ← Active states
```

---

## Support & Questions

For questions about the design system or component usage:
1. Review this document first
2. Check existing component implementations
3. Refer to Tailwind CSS documentation
4. Ask the team for clarification

**Remember:** Consistency is more important than individual preferences. Follow the established patterns to maintain a cohesive user experience.

