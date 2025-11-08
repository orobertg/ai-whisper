# AI Whisper - Component Documentation

## Custom Components Library

This document provides detailed documentation for all custom reusable components in AI Whisper.

---

## CustomSelect

**Location:** `frontend/components/CustomSelect.tsx`

### Overview

A fully-featured dropdown select component that replaces native HTML `<select>` elements. Provides a consistent, accessible, and beautiful selection interface throughout the application.

### Features

- ✅ Custom styling matching the app design system
- ✅ Keyboard navigation (Arrow keys, Enter, Escape, Space)
- ✅ Click-outside-to-close functionality
- ✅ Visual feedback for hover, focus, and selection states
- ✅ Checkmark icon for selected items
- ✅ Smooth animations and transitions
- ✅ Disabled state support
- ✅ Responsive design
- ✅ Accessibility features

### Props

```typescript
interface CustomSelectProps {
  value: string;              // Current selected value
  onChange: (value: string) => void;  // Callback function when selection changes
  options: string[];          // Array of string options to display
  placeholder?: string;       // Placeholder text when no value selected (default: "Select")
  label?: string;            // Optional label displayed above the select
  disabled?: boolean;        // Disable the dropdown (default: false)
  className?: string;        // Additional CSS classes for the container
}
```

### Basic Usage

```tsx
import { useState } from "react";
import CustomSelect from "@/components/CustomSelect";

function MyComponent() {
  const [selectedModel, setSelectedModel] = useState("gpt-4");

  return (
    <CustomSelect
      value={selectedModel}
      onChange={setSelectedModel}
      options={["gpt-4", "gpt-3.5-turbo", "claude-3"]}
      placeholder="Select a model"
      label="AI Model"
    />
  );
}
```

### Advanced Usage

```tsx
// With disabled state
<CustomSelect
  value={model}
  onChange={setModel}
  options={availableModels}
  disabled={isLoading}
  placeholder="Loading models..."
/>

// With custom className
<CustomSelect
  value={option}
  onChange={setOption}
  options={options}
  className="w-full max-w-xs"
/>

// Without label
<CustomSelect
  value={selection}
  onChange={setSelection}
  options={["Option A", "Option B", "Option C"]}
/>
```

### Styling Details

#### Select Button

**Closed State:**
- Background: `bg-white`
- Border: `border-zinc-300` (light gray)
- Text: `text-zinc-900` (selected) or `text-zinc-500` (placeholder)
- Padding: `px-4 py-2.5`
- Border radius: `rounded-xl`

**Open State:**
- Border: `border-blue-400` (blue accent)
- Arrow icon rotates 180 degrees

**Hover State:**
- Border: `border-zinc-400` (slightly darker)

**Disabled State:**
- Background: `bg-zinc-50`
- Border: `border-zinc-200`
- Text: `text-zinc-400`
- Cursor: `cursor-not-allowed`

#### Dropdown Menu

**Container:**
- Background: `bg-white`
- Border: `border border-zinc-200`
- Shadow: `shadow-xl`
- Border radius: `rounded-lg`
- Max height: `max-h-60` (scrollable)
- Padding: `py-1`

**Menu Items:**

*Default:*
- Text: `text-zinc-700`
- Padding: `px-4 py-2.5`

*Hover:*
- Background: `bg-zinc-50`
- Text: `text-zinc-900`

*Selected:*
- Background: `bg-zinc-100`
- Text: `text-zinc-900 font-medium`
- Icon: Checkmark (16px, `text-zinc-600`)

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open dropdown / Select highlighted option |
| `Escape` | Close dropdown |
| `Arrow Down` | Highlight next option / Open dropdown |
| `Arrow Up` | Highlight previous option |

### State Management

The component manages its own internal state for:
- `isOpen` - Whether the dropdown is open
- `highlightedIndex` - Currently highlighted option index
- Click-outside detection
- Keyboard navigation

The parent component only needs to manage the `value` state.

### Accessibility

- Proper keyboard navigation support
- Visual focus indicators
- Disabled state handling
- Semantic HTML structure
- ARIA-friendly (can be enhanced with ARIA attributes if needed)

### Performance Considerations

- Efficient re-renders (uses React.memo internally where applicable)
- Event listeners properly cleaned up on unmount
- Smooth animations with CSS transitions (no JS animation loops)
- Minimal DOM manipulation

### Usage Locations in App

1. **Settings → AI Providers → Model Selection**
   - Displays available models after connection test
   - Allows model selection from loaded options

2. **Home Page → Chat Input → Model Selection**
   - Quick model selection for new chats
   - Displayed above the main chat textarea

3. *(Future)* **Chat Panel → Model Switcher**
   - In-chat model switching
   - Context-aware model recommendations

### Design Decisions

**Why not use native `<select>`?**
- Limited styling capabilities
- Inconsistent appearance across browsers
- Poor mobile experience
- Cannot add custom icons/elements
- Limited control over dropdown behavior

**Why light gray selections?**
- Consistent with overall app design
- Better visibility than blue
- Professional appearance
- Reduces color fatigue
- Works well in both light and dark contexts

### Migration from Native Select

**Before:**
```tsx
<select 
  value={model}
  onChange={(e) => setModel(e.target.value)}
  className="px-2 py-1 border rounded"
>
  <option value="gpt-4">GPT-4</option>
  <option value="gpt-3.5">GPT-3.5</option>
</select>
```

**After:**
```tsx
<CustomSelect
  value={model}
  onChange={setModel}
  options={["GPT-4", "GPT-3.5"]}
/>
```

### Common Patterns

#### Loading State

```tsx
const [models, setModels] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(true);

// After loading...
{isLoading ? (
  <div className="text-sm text-zinc-500">Loading models...</div>
) : (
  <CustomSelect
    value={selectedModel}
    onChange={setSelectedModel}
    options={models}
  />
)}
```

#### With Validation

```tsx
const [model, setModel] = useState("");
const [error, setError] = useState("");

const handleModelChange = (value: string) => {
  setModel(value);
  setError(""); // Clear error on change
};

return (
  <div>
    <CustomSelect
      value={model}
      onChange={handleModelChange}
      options={availableModels}
      label="Model"
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);
```

#### Empty State

```tsx
{availableModels.length > 0 ? (
  <CustomSelect
    value={model}
    onChange={setModel}
    options={availableModels}
    placeholder="Select a model"
  />
) : (
  <input
    type="text"
    value={model}
    onChange={(e) => setModel(e.target.value)}
    placeholder="Enter model name manually"
    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl"
  />
)}
```

### Troubleshooting

**Dropdown not closing:**
- Ensure click-outside detection is not blocked by parent elements
- Check z-index conflicts

**Options not visible:**
- Verify parent container doesn't have `overflow: hidden`
- Check if dropdown is positioned correctly

**Keyboard navigation not working:**
- Ensure the select button receives focus
- Check for conflicting event handlers

### Future Enhancements

Potential improvements for future versions:

1. **Multi-select support** - Select multiple options
2. **Search/filter** - Search through large option lists
3. **Grouped options** - Support option groups
4. **Custom option rendering** - Render custom content in options
5. **Async loading** - Load options on-demand
6. **Virtualization** - Efficient rendering of large lists
7. **ARIA enhancements** - Full accessibility compliance

### Related Components

- **Sidebar** - Uses custom popup menus with similar styling
- **Settings** - Contains CustomSelect instances
- **HomeContent** - Uses CustomSelect for model selection

---

## Component Development Guidelines

When creating new custom components:

1. **Follow the design system** - Use colors from `UI_DESIGN_SYSTEM.md`
2. **Make it reusable** - Accept props for customization
3. **Add TypeScript types** - Full type safety
4. **Include keyboard support** - Accessibility first
5. **Handle edge cases** - Loading, empty, error states
6. **Document thoroughly** - Add to this file
7. **Test across browsers** - Chrome, Firefox, Safari, Edge
8. **Optimize performance** - Minimize re-renders

---

## More Components (Coming Soon)

### Planned Components

1. **CustomCheckbox** - Styled checkbox component
2. **CustomRadio** - Styled radio button component  
3. **CustomToggle** - Toggle switch for settings
4. **CustomModal** - Consistent modal dialog
5. **CustomToast** - Notification toast
6. **CustomTooltip** - Reusable tooltip component
7. **CustomTabs** - Tab navigation component

Each component will be documented here as it's developed.

