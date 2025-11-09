# Complete Styling Reference

**Document:** 11_STYLING_REFERENCE.md  
**Version:** 1.0  
**Purpose:** Quick lookup reference for all styling classes and patterns

---

## Quick Reference Index

1. [Theme-Specific Classes](#theme-specific-classes)
2. [Component Patterns](#component-patterns)
3. [Color Classes](#color-classes)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Interactive States](#interactive-states)
7. [Glassmorphism Patterns](#glassmorphism-patterns)
8. [Common Combinations](#common-combinations)

---

## Theme-Specific Classes

### Light Theme (withoutWallpaper)

```css
/* Cards */
bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg

/* Inputs */
bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md

/* Buttons (base) */
border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700

/* Text */
text-zinc-900  /* primary */
text-zinc-700  /* secondary */

/* Backgrounds */
bg-white
bg-zinc-50   /* subtle background */
bg-zinc-100  /* hover states */
```

### Dark Theme (withoutWallpaper)

```css
/* Cards */
bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl

/* Inputs */
bg-zinc-900/50 border border-zinc-700 rounded-3xl text-white

/* Buttons (base) */
border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800

/* Text */
text-white      /* primary */
text-zinc-400   /* secondary */

/* Backgrounds */
bg-zinc-900
bg-zinc-800   /* hover states */
bg-zinc-950   /* deeper backgrounds */
```

### Translucent Theme (withoutWallpaper)

```css
/* Cards (Frosted Glass) */
bg-white/[0.15] backdrop-blur-2xl border border-white/20 
hover:border-white/30 hover:bg-white/[0.20] rounded-2xl 
shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]

/* Inputs (Frosted Glass) */
bg-white/10 backdrop-blur-xl border border-white/20 
rounded-3xl text-white placeholder-zinc-400 shadow-xl

/* Buttons (Frosted Glass) */
bg-white/[0.15] backdrop-blur-2xl border border-white/20 
hover:border-white/30 text-white hover:bg-white/[0.20] 
shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-medium

/* Text */
text-white      /* primary */
text-zinc-400   /* secondary */

/* Background (from globals.css) */
background: linear-gradient(135deg, 
  #667eea 0%, #764ba2 25%, #f093fb 50%, 
  #4facfe 75%, #00f2fe 100%);
background-size: 400% 400%;
animation: gradient-shift 15s ease infinite;
```

---

## Component Patterns

### Card Pattern

```tsx
<div className="p-4 bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer">
  <h3 className="text-sm font-medium text-zinc-900 mb-1">
    Card Title
  </h3>
  <p className="text-xs text-zinc-700">
    Card description
  </p>
</div>
```

### Button Patterns

**Primary:**
```tsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
  Primary Action
</button>
```

**Secondary (Theme-Aware):**
```tsx
<button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 rounded-md transition-all">
  Secondary Action
</button>
```

**Ghost:**
```tsx
<button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
  <Icon size={20} />
</button>
```

**Frosted Glass (Translucent):**
```tsx
<button className="px-4 py-2.5 bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 text-white hover:bg-white/[0.20] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-medium transition-all">
  Glass Button
</button>
```

### Input Patterns

**Text Input:**
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
/>
```

**Textarea:**
```tsx
<textarea
  placeholder="Enter message..."
  className="w-full px-6 py-4 bg-white border border-zinc-300 rounded-3xl resize-none focus:outline-none"
  rows={3}
/>
```

**Frosted Glass Input (Translucent):**
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white placeholder-zinc-400 shadow-xl focus:outline-none focus:border-white/25 focus:bg-white/15 transition-all"
/>
```

### Panel/Container Pattern

```tsx
<div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-lg">
  <h3 className="text-lg font-semibold text-zinc-900 mb-4">
    Panel Title
  </h3>
  <div className="space-y-4">
    {/* Panel content */}
  </div>
</div>
```

**Frosted Panel (Translucent):**
```tsx
<div className="bg-white/[0.15] backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
  <h3 className="text-lg font-semibold text-white mb-4">
    Glass Panel
  </h3>
  {/* Content */}
</div>
```

---

## Color Classes

### Primary Colors

```css
/* Blue (Actions) */
bg-blue-50   text-blue-50   border-blue-50
bg-blue-500  text-blue-500  border-blue-500
bg-blue-600  text-blue-600  border-blue-600

/* Zinc (Neutrals) */
bg-zinc-50    text-zinc-50    border-zinc-50
bg-zinc-100   text-zinc-100   border-zinc-100
bg-zinc-200   text-zinc-200   border-zinc-200
bg-zinc-300   text-zinc-300   border-zinc-300
bg-zinc-400   text-zinc-400   border-zinc-400
bg-zinc-500   text-zinc-500   border-zinc-500
bg-zinc-600   text-zinc-600   border-zinc-600
bg-zinc-700   text-zinc-700   border-zinc-700
bg-zinc-800   text-zinc-800   border-zinc-800
bg-zinc-900   text-zinc-900   border-zinc-900
bg-zinc-950   text-zinc-950   border-zinc-950
```

### Opacity Variants

```css
/* Background Opacities */
bg-white/5   bg-white/8   bg-white/10
bg-white/15  bg-white/20  bg-white/30
bg-white/90  bg-white/95

/* Border Opacities */
border-white/10  border-white/15  border-white/20
border-white/25  border-white/30

/* Text Opacities */
text-white/90  text-zinc-400/80
```

---

## Typography

### Font Sizes

```css
text-xs     /* 12px - Small labels, captions */
text-sm     /* 14px - Body text, buttons */
text-base   /* 16px - Default body */
text-lg     /* 18px - Large body, small headings */
text-xl     /* 20px - Headings */
text-2xl    /* 24px - Large headings */
text-3xl    /* 30px - Page titles */
```

### Font Weights

```css
font-normal      /* 400 - Body text */
font-medium      /* 500 - Emphasized text, buttons */
font-semibold    /* 600 - Headings */
font-bold        /* 700 - Strong headings */
```

### Text Utilities

```css
/* Truncate */
truncate         /* Single line with ellipsis */
line-clamp-1     /* 1 line with ellipsis */
line-clamp-2     /* 2 lines with ellipsis */

/* Alignment */
text-left  text-center  text-right

/* Whitespace */
whitespace-nowrap    /* No line breaks */
whitespace-normal    /* Normal wrapping */
```

---

## Spacing & Layout

### Padding

```css
p-2    /* 8px all sides */
p-3    /* 12px all sides */
p-4    /* 16px all sides */
p-6    /* 24px all sides */

px-4   /* 16px horizontal */
py-2   /* 8px vertical */

px-4 py-2.5   /* Common button padding */
px-6 py-4     /* Common input padding */
```

### Margin

```css
m-2  m-3  m-4  m-6  m-8

mb-2  mb-4  mb-6  mb-8   /* Bottom margin */
mt-2  mt-4  mt-6  mt-8   /* Top margin */

space-y-2  space-y-4  space-y-6   /* Vertical spacing between children */
space-x-2  space-x-3  space-x-4   /* Horizontal spacing between children */
```

### Gap (Flexbox/Grid)

```css
gap-1  gap-2  gap-3  gap-4  gap-6  gap-8

/* Common combinations */
flex items-center gap-2
grid grid-cols-3 gap-4
```

---

## Interactive States

### Hover States

```css
/* Background */
hover:bg-zinc-100  hover:bg-zinc-800  hover:bg-white/15

/* Border */
hover:border-zinc-300  hover:border-white/30

/* Shadow */
hover:shadow-md  hover:shadow-xl  hover:shadow-2xl

/* Transform */
hover:scale-105  hover:scale-[1.02]
```

### Focus States

```css
/* Ring (for inputs/buttons) */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

/* Border (alternative to ring) */
focus:outline-none focus:border-blue-500

/* Background */
focus:bg-white/15  focus:bg-zinc-900/70
```

### Active States

```css
/* Selected items */
bg-blue-50 text-blue-700   /* Light theme */
bg-zinc-800 text-white     /* Dark theme */
bg-blue-500/20 text-white  /* Translucent theme */
```

### Group Hover

```css
/* Parent */
<div className="group">
  {/* Child responds to parent hover */}
  <Icon className="text-zinc-500 group-hover:text-blue-500" />
</div>
```

---

## Glassmorphism Patterns

### Core Glassmorphism Classes

```css
/* Required combination for frosted glass: */
bg-white/[0.15]           /* Semi-transparent background */
backdrop-blur-2xl         /* Heavy blur (40px) */
border border-white/20    /* Subtle border */
shadow-[0_8px_32px_rgba(0,0,0,0.12)]  /* Soft shadow */
```

### Opacity Levels

```css
/* Very subtle */
bg-white/[0.08]  backdrop-blur-xl    /* 8% opacity, 24px blur */

/* Subtle */
bg-white/10  backdrop-blur-xl         /* 10% opacity, 24px blur */

/* Standard */
bg-white/[0.15]  backdrop-blur-2xl    /* 15% opacity, 40px blur */

/* Prominent */
bg-white/20  backdrop-blur-2xl        /* 20% opacity, 40px blur */
```

### Hover Glassmorphism

```css
/* Standard → Hover */
bg-white/[0.15]    →    hover:bg-white/[0.20]
border-white/20    →    hover:border-white/30
shadow-[0_8px_32px_rgba(0,0,0,0.12)]    →    hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
```

### Complete Frosted Glass Element

```tsx
<div className="
  bg-white/[0.15]
  backdrop-blur-2xl
  border border-white/20
  hover:border-white/30
  hover:bg-white/[0.20]
  rounded-2xl
  p-4
  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
  transition-all
  cursor-pointer
">
  Frosted Glass Content
</div>
```

---

## Common Combinations

### Button Sizes

```css
/* Small */
px-3 py-1.5 text-xs rounded-md

/* Medium (default) */
px-4 py-2 text-sm rounded-md

/* Large */
px-6 py-3 text-base rounded-lg

/* Extra Large (action buttons) */
px-4 py-2.5 text-sm rounded-xl
```

### Card Sizes

```css
/* Compact */
p-3 rounded-lg

/* Standard */
p-4 rounded-lg

/* Spacious */
p-6 rounded-xl
```

### Shadow Elevations

```css
/* Level 1 (subtle) */
shadow-sm

/* Level 2 (default) */
shadow-md

/* Level 3 (elevated) */
shadow-lg

/* Level 4 (prominent) */
shadow-xl

/* Level 5 (dramatic) */
shadow-2xl

/* Frosted glass shadows */
shadow-[0_8px_32px_rgba(0,0,0,0.12)]   /* Soft */
shadow-[0_12px_48px_rgba(0,0,0,0.18)]  /* Medium */
shadow-[0_8px_32px_rgba(0,0,0,0.3)]    /* Dark */
```

### Border Radius

```css
/* Elements by type */
rounded-md      /* Buttons, small cards */
rounded-lg      /* Standard cards */
rounded-xl      /* Large cards, panels, action buttons */
rounded-2xl     /* Featured elements, frosted glass tiles */
rounded-3xl     /* Pills, inputs */
rounded-full    /* Circles, avatars, toggles */
```

### Backdrop Blur Levels

```css
backdrop-blur-sm     /*  4px - Subtle */
backdrop-blur        /*  8px - Default */
backdrop-blur-md     /* 12px - Medium */
backdrop-blur-lg     /* 16px - Large */
backdrop-blur-xl     /* 24px - Extra large */
backdrop-blur-2xl    /* 40px - Heavy (main translucent) */
backdrop-blur-3xl    /* 64px - Extreme */
```

---

## Responsive Patterns

### Breakpoint Classes

```css
/* Mobile first approach */
class                  /* All sizes */
sm:class              /* >= 640px */
md:class              /* >= 768px */
lg:class              /* >= 1024px */
xl:class              /* >= 1280px */
2xl:class             /* >= 1536px */
```

### Common Responsive Patterns

```css
/* Grid columns */
grid-cols-1 sm:grid-cols-2 md:grid-cols-3

/* Hide/Show */
hidden md:block               /* Hide on mobile, show on desktop */
block md:hidden               /* Show on mobile, hide on desktop */

/* Padding */
p-4 md:p-6 lg:p-8            /* Adaptive padding */

/* Text size */
text-2xl md:text-3xl lg:text-4xl
```

---

## Transition Classes

### Standard Transitions

```css
transition-all         /* All properties, 150ms */
transition-colors      /* Colors only */
transition-transform   /* Transform only */
transition-shadow      /* Shadow only */

/* Duration */
duration-150  duration-200  duration-300
```

### Transform Patterns

```css
/* Scale */
hover:scale-105        /* Slight grow */
hover:scale-[1.02]     /* Subtle grow */

/* Translate */
translate-x-0  -translate-x-full   /* Slide animations */
translate-y-0  -translate-y-full
```

---

## Utility Combinations

### Flexbox Centering

```css
/* Horizontal + Vertical Center */
flex items-center justify-center

/* Horizontal Space Between */
flex items-center justify-between

/* Vertical Stack with Gap */
flex flex-col gap-4
```

### Grid Layouts

```css
/* Auto-responsive */
grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4

/* Equal columns */
grid grid-cols-3 gap-4

/* Auto-fit */
grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4
```

### Overflow Handling

```css
/* Scrollable */
overflow-y-auto max-h-[500px]

/* Hidden */
overflow-hidden

/* Ellipsis */
truncate
```

---

## Testing Quick Checks

Use this checklist when implementing new components:

```
Component Styling Checklist:
[ ] Works in light theme (without wallpaper)
[ ] Works in dark theme (without wallpaper)
[ ] Works in translucent theme (uses gradient)
[ ] Hover states defined
[ ] Focus states defined (if interactive)
[ ] Responsive breakpoints applied
[ ] Transitions smooth
[ ] Text readable in all themes
[ ] Proper spacing/padding
[ ] Consistent with other components
```

---

## Copy-Paste Templates

### Frosted Glass Card (Translucent Theme)

```tsx
<div className="
  p-4
  bg-white/[0.15]
  backdrop-blur-2xl
  border border-white/20
  hover:border-white/30
  hover:bg-white/[0.20]
  rounded-2xl
  transition-all
  group
  cursor-pointer
  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
">
  <h3 className="text-sm font-medium text-white mb-1">
    Card Title
  </h3>
  <p className="text-xs text-zinc-400">
    Card description
  </p>
</div>
```

### Theme-Aware Card

```tsx
<div className={`
  p-4 rounded-lg transition-all group cursor-pointer
  ${isLight
    ? 'bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
    : 'bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90'
  }
`}>
  <h3 className={`text-sm font-medium mb-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
    Card Title
  </h3>
  <p className={`text-xs ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
    Card description
  </p>
</div>
```

### Action Button (Frosted Glass)

```tsx
<button className="
  px-4 py-2.5
  bg-white/[0.15]
  backdrop-blur-2xl
  border border-white/20
  hover:border-white/30
  text-white
  hover:bg-white/[0.20]
  rounded-xl
  text-sm
  font-medium
  transition-all
  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
">
  Action Button
</button>
```

---

## End of Specifications

This completes the comprehensive UI/UX specification documentation for the AI Whisper application. All documents provide complete implementation details, code examples, and testing criteria necessary to rebuild the application from scratch.

**Document Set:**
- 00_OVERVIEW.md
- 01_THEME_SYSTEM.md
- 02_LAYOUT_STRUCTURE.md
- 03_STYLING_ARCHITECTURE.md
- 04_HOME_PAGE.md
- 05_CHAT_INTERFACE.md (partial)
- 06_SIDEBAR.md
- 07_SETTINGS.md
- 09_STATE_MANAGEMENT.md
- 11_STYLING_REFERENCE.md (this document)

Use these documents as a complete reference for maintaining or rebuilding the application.

