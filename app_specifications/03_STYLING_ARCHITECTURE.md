# Styling Architecture Specification

**Document:** 03_STYLING_ARCHITECTURE.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 02_LAYOUT_STRUCTURE.md

---

## Overview

This document defines the complete styling architecture, Tailwind configuration, and design patterns used throughout the AI Whisper application.

---

## Tailwind CSS Configuration

### File: `frontend/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom colors if needed (using Tailwind defaults is recommended)
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Key Extensions:**
1. **Font Family:** Inter font via CSS variable
2. **Backdrop Blur:** Added `3xl` (64px) for heavy frosted glass
3. **Animations:** Gradient animation for translucent theme

---

## Design System

### Color Palette

**Zinc Scale (Primary):**
```css
zinc-50:   #fafafa  /* Very light backgrounds */
zinc-100:  #f4f4f5  /* Light backgrounds */
zinc-200:  #e4e4e7  /* Light borders */
zinc-300:  #d4d4d8  /* Medium borders, disabled text */
zinc-400:  #a1a1aa  /* Muted text, placeholders */
zinc-500:  #71717a  /* Secondary text */
zinc-600:  #52525b  /* Body text (light theme) */
zinc-700:  #3f3f46  /* Headings, dark borders */
zinc-800:  #27272a  /* Dark backgrounds, hover states */
zinc-900:  #18181b  /* Primary dark backgrounds */
zinc-950:  #09090b  /* Deepest dark */
```

**Blue Scale (Accents):**
```css
blue-50:   #eff6ff  /* Light blue backgrounds */
blue-500:  #3b82f6  /* Primary action color */
blue-600:  #2563eb  /* Primary action hover */
blue-700:  #1d4ed8  /* Active states */
```

**White with Opacity (Glassmorphism):**
```css
white/5    /* 5% opacity - extremely subtle */
white/8    /* 8% opacity - very subtle */
white/10   /* 10% opacity - subtle */
white/15   /* 15% opacity - noticeable translucent */
white/20   /* 20% opacity - clear translucent */
white/30   /* 30% opacity - semi-transparent */
white/90   /* 90% opacity - nearly opaque */
white/95   /* 95% opacity - barely transparent */
```

### Typography

**Font Sizes:**
```css
text-xs:    0.75rem (12px)  /* Small labels, captions */
text-sm:    0.875rem (14px) /* Body text, buttons */
text-base:  1rem (16px)     /* Default body text */
text-lg:    1.125rem (18px) /* Large body, small headings */
text-xl:    1.25rem (20px)  /* Headings */
text-2xl:   1.5rem (24px)   /* Large headings */
text-3xl:   1.875rem (30px) /* Page titles */
```

**Font Weights:**
```css
font-normal:    400  /* Body text */
font-medium:    500  /* Emphasized text, buttons */
font-semibold:  600  /* Headings, strong emphasis */
font-bold:      700  /* Strong headings */
```

**Line Heights:**
```css
leading-tight:    1.25   /* Headings */
leading-normal:   1.5    /* Body text */
leading-relaxed:  1.625  /* Comfortable reading */
```

### Spacing

**Standard Scale:**
```css
0:    0px
0.5:  0.125rem (2px)
1:    0.25rem (4px)
1.5:  0.375rem (6px)
2:    0.5rem (8px)
2.5:  0.625rem (10px)
3:    0.75rem (12px)
4:    1rem (16px)
5:    1.25rem (20px)
6:    1.5rem (24px)
8:    2rem (32px)
10:   2.5rem (40px)
12:   3rem (48px)
16:   4rem (64px)
20:   5rem (80px)
```

**Common Padding Patterns:**
```css
p-2:    0.5rem (8px)   /* Tight padding, small elements */
p-3:    0.75rem (12px) /* Compact padding */
p-4:    1rem (16px)    /* Standard padding, cards */
p-6:    1.5rem (24px)  /* Spacious padding, sections */
px-4:   Horizontal 1rem /* Button, input horizontal */
py-2:   Vertical 0.5rem /* Button vertical */
```

### Border Radius

```css
rounded-none:  0px       /* Square corners */
rounded-sm:    0.125rem  /* 2px - subtle rounding */
rounded:       0.25rem   /* 4px - default rounding */
rounded-md:    0.375rem  /* 6px - medium rounding */
rounded-lg:    0.5rem    /* 8px - large rounding, cards */
rounded-xl:    0.75rem   /* 12px - extra large, panels */
rounded-2xl:   1rem      /* 16px - very round, featured elements */
rounded-3xl:   1.5rem    /* 24px - pill-like, inputs */
rounded-full:  9999px    /* Perfect circle, avatars */
```

**Usage:**
- Cards: `rounded-lg` or `rounded-xl`
- Buttons: `rounded-md` or `rounded-xl`
- Inputs: `rounded-3xl` (pill-shaped)
- Action buttons (home): `rounded-xl`
- Chat tiles (translucent): `rounded-2xl`

### Shadows

**Shadow Scale:**
```css
shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)  /* Subtle depth */
shadow:      0 1px 3px 0 rgb(0 0 0 / 0.1)   /* Default card shadow */
shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1) /* Elevated card */
shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1) /* Prominent shadow */
shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1) /* Large shadow */
shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25) /* Dramatic shadow */
```

**Custom Shadows (Translucent Theme):**
```css
shadow-[0_8px_32px_rgba(0,0,0,0.12)]      /* Soft glassmorphism */
shadow-[0_12px_48px_rgba(0,0,0,0.18)]     /* Pronounced glassmorphism */
shadow-[0_8px_32px_rgba(0,0,0,0.3)]       /* Dark glassmorphism hover */
```

### Backdrop Blur

**Scale:**
```css
backdrop-blur-none:  blur(0)
backdrop-blur-sm:    blur(4px)   /* Subtle blur */
backdrop-blur:       blur(8px)   /* Default blur */
backdrop-blur-md:    blur(12px)  /* Medium blur */
backdrop-blur-lg:    blur(16px)  /* Large blur */
backdrop-blur-xl:    blur(24px)  /* Extra large blur */
backdrop-blur-2xl:   blur(40px)  /* Heavy blur - main translucent */
backdrop-blur-3xl:   blur(64px)  /* Extreme blur - special cases */
```

**Usage:**
- Light theme with wallpaper: `backdrop-blur-sm`
- Dark theme with wallpaper: `backdrop-blur-md` to `backdrop-blur-lg`
- Translucent theme: `backdrop-blur-2xl` (standard) or `backdrop-blur-3xl` (emphasis)

---

## Component Styling Patterns

### Card Pattern

**Structure:**
```tsx
<div className={`p-4 ${cardClass}`}>
  <h3 className={`text-sm font-medium ${textPrimaryClass}`}>
    Card Title
  </h3>
  <p className={`text-xs ${textSecondaryClass}`}>
    Card description
  </p>
</div>
```

**Classes (from themeStyles.ts):**
- Light: `bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg`
- Dark: `bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl`
- Translucent: `bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]`

### Button Pattern

**Primary Button:**
```tsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
  Primary Action
</button>
```

**Secondary Button (Theme-Aware):**
```tsx
<button className={`px-4 py-2 border rounded-md font-medium transition-all ${buttonBaseClass}`}>
  Secondary Action
</button>
```

**Ghost Button:**
```tsx
<button className={`p-2 rounded-md transition-colors ${getButtonClass('ghost')}`}>
  <Icon size={20} />
</button>
```

### Input Pattern

**Text Input:**
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className={`w-full px-4 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
/>
```

**Textarea:**
```tsx
<textarea
  placeholder="Enter message..."
  className={`w-full px-6 py-4 ${inputClass} resize-none focus:outline-none`}
  rows={3}
/>
```

### Panel/Container Pattern

**Expanded Panel:**
```tsx
<div className={expandedPanelClass}>
  <div className="space-y-4">
    {/* Panel content */}
  </div>
</div>
```

---

## Layout Patterns

### Flexbox Patterns

**Horizontal Stack:**
```tsx
<div className="flex items-center gap-2">
  <Icon />
  <span>Label</span>
</div>
```

**Vertical Stack:**
```tsx
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Space Between:**
```tsx
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

**Centered Content:**
```tsx
<div className="flex items-center justify-center h-full">
  <div>Centered</div>
</div>
```

### Grid Patterns

**Responsive Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Auto-fit Grid:**
```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
  {/* Automatically fits items */}
</div>
```

### Overflow Handling

**Scrollable Container:**
```tsx
<div className="overflow-y-auto max-h-[500px] scrollbar-thin">
  {/* Scrollable content */}
</div>
```

**Hidden Overflow:**
```tsx
<div className="overflow-hidden">
  <div className="truncate">Long text that gets cut off...</div>
</div>
```

---

## Glassmorphism Implementation

### Requirements for Frosted Glass Effect

1. **Semi-transparent background:** `bg-white/10` to `bg-white/20`
2. **Backdrop blur:** `backdrop-blur-xl` or `backdrop-blur-2xl`
3. **Subtle border:** `border border-white/20`
4. **Soft shadow:** `shadow-xl` or custom shadow
5. **Content behind element:** Gradient or wallpaper

### Complete Glassmorphism Pattern

```tsx
<div className="relative">
  {/* Background layer (gradient or wallpaper) */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500" />
  
  {/* Glassmorphic element */}
  <div className="relative bg-white/15 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
    <h2 className="text-white font-semibold">Frosted Glass Card</h2>
    <p className="text-white/90">Content with beautiful blur effect</p>
  </div>
</div>
```

### Common Glassmorphism Mistakes

**❌ Wrong: Opaque background**
```tsx
<div className="bg-white backdrop-blur-xl"> {/* Won't blur! */}
```

**✅ Correct: Semi-transparent background**
```tsx
<div className="bg-white/15 backdrop-blur-xl"> {/* Blurs correctly */}
```

**❌ Wrong: No content behind**
```tsx
<div className="bg-zinc-900"> {/* Solid background blocks blur */}
  <div className="bg-white/15 backdrop-blur-xl"> {/* Nothing to blur */}
```

**✅ Correct: Transparent parent with background**
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500" />
  <div className="relative bg-white/15 backdrop-blur-xl"> {/* Blurs gradient */}
```

---

## Transition and Animation Patterns

### Standard Transitions

**All Properties:**
```tsx
className="transition-all duration-300"
```

**Specific Properties:**
```tsx
className="transition-colors duration-200"    // Colors only
className="transition-transform duration-300" // Transform only
className="transition-shadow duration-200"    // Shadow only
```

### Hover States

**Scale on Hover:**
```tsx
className="transition-transform hover:scale-105"
```

**Opacity Change:**
```tsx
className="transition-opacity hover:opacity-80"
```

**Background Change:**
```tsx
className="transition-colors hover:bg-zinc-100"
```

### Focus States

**Ring Focus (Inputs):**
```tsx
className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Border Focus:**
```tsx
className="focus:outline-none focus:border-blue-500"
```

---

## Responsive Design Patterns

### Mobile-First Approach

**Show on Desktop Only:**
```tsx
<div className="hidden md:block">
  Desktop content
</div>
```

**Show on Mobile Only:**
```tsx
<div className="block md:hidden">
  Mobile content
</div>
```

**Responsive Padding:**
```tsx
<div className="p-4 md:p-6 lg:p-8">
  Adapts to screen size
</div>
```

### Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

### Responsive Grids

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Adapts column count to screen size */}
</div>
```

---

## Accessibility Patterns

### Focus Visible

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Screen Reader Only

```tsx
<span className="sr-only">
  Screen reader only text
</span>
```

### Aria Labels

```tsx
<button aria-label="Close modal" className="p-2">
  <XIcon />
</button>
```

---

## Performance Optimizations

### Will-Change for Animations

```tsx
<div className="will-change-transform transition-transform hover:scale-105">
  Optimized animation
</div>
```

### GPU Acceleration

```tsx
<div className="transform-gpu transition-transform">
  Uses GPU for smoother transitions
</div>
```

---

## Testing Checklist

### Visual Testing
- [ ] All themes display correctly
- [ ] Hover states work on all interactive elements
- [ ] Focus states visible for keyboard navigation
- [ ] Transitions smooth and not jarring
- [ ] Glassmorphism effect visible in translucent theme

### Responsive Testing
- [ ] Layout adapts to mobile (< 640px)
- [ ] Layout adapts to tablet (640px - 1024px)
- [ ] Layout adapts to desktop (> 1024px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Text readable at all sizes

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Screen reader labels present
- [ ] Touch targets at least 44x44px

---

## Next Document

Proceed to **04_HOME_PAGE.md** for detailed home page component specifications.

