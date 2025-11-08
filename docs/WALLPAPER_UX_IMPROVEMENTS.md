# Wallpaper UX Improvements

## Changes Made

### 1. Inverted Theme Logic for Better Contrast
**Rationale:** When a wallpaper is displayed, the UI theme should provide maximum contrast for readability.

**New Behavior:**
- **Dark Wallpaper** → **Light UI** (white buttons, dark text)
- **Light Wallpaper** → **Dark UI** (dark buttons, light text)

This ensures text and UI elements are always readable regardless of wallpaper brightness.

**Implementation:**
```tsx
// frontend/components/HomeContent.tsx
const isLight = hasWallpaper 
  ? !wallpaperTheme || wallpaperTheme === 'dark'  // Invert for contrast
  : systemTheme === 'light';                       // Use system theme when no wallpaper
```

### 2. Automatic Wallpaper Naming from Filename
**Rationale:** Reduce friction in the wallpaper upload process - users shouldn't need to manually name their wallpapers.

**New Behavior:**
- Wallpaper name is automatically extracted from the uploaded filename
- File extension is removed
- Long filenames (>30 chars) are truncated with "..."
- No prompt dialog appears

**Before:**
```
User uploads "pexels-billelmoula-12345.jpg"
→ Prompt: "Name your wallpaper: pexels-billelmoula-12345"
→ User must click OK or type new name
```

**After:**
```
User uploads "pexels-billelmoula-12345.jpg"
→ Automatically named "pexels-billelmoula-12345"
→ No prompt, instant upload
```

**Implementation:**
```tsx
// frontend/components/Settings.tsx
const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
const name = fileName.length > 30 ? fileName.substring(0, 30) + "..." : fileName;
// Use 'name' directly, no prompt
```

## User Benefits

### Enhanced Readability
- **Dark wallpapers** (e.g., night sky, dark landscape) now show **light-colored buttons and text**
- **Light wallpapers** (e.g., clouds, beach) now show **dark-colored buttons and text**
- UI elements always stand out against the wallpaper

### Streamlined Upload Flow
1. Click "Add New" or "Upload"
2. Select image file
3. ✅ Done! Wallpaper is instantly added with filename as name

### Reduced Cognitive Load
- No need to think of creative names
- No interruption with prompt dialogs
- Filenames are already descriptive (especially from stock photo sites)

## Examples

### Dark Wallpaper Examples
**Wallpaper:** Starry night sky (dark)  
**UI Theme:** Light buttons, dark text  
**Contrast:** ⭐⭐⭐⭐⭐ Excellent

**Wallpaper:** Forest at dusk (dark)  
**UI Theme:** Light buttons, dark text  
**Contrast:** ⭐⭐⭐⭐⭐ Excellent

### Light Wallpaper Examples
**Wallpaper:** White clouds (light)  
**UI Theme:** Dark buttons, light text  
**Contrast:** ⭐⭐⭐⭐⭐ Excellent

**Wallpaper:** Sandy beach (light)  
**UI Theme:** Dark buttons, light text  
**Contrast:** ⭐⭐⭐⭐⭐ Excellent

## Technical Details

### Brightness Detection
- Image brightness is analyzed using luminance formula: `0.299*R + 0.587*G + 0.114*B`
- Threshold: 140 (0-255 scale)
- `brightness > 140` → Light wallpaper → Dark UI
- `brightness ≤ 140` → Dark wallpaper → Light UI

### Theme Persistence
- Wallpaper brightness data is stored in localStorage
- `isLight` flag indicates if wallpaper is light or dark
- UI theme is calculated on every render based on this flag

## Related Files
- `frontend/components/HomeContent.tsx` - Theme inversion logic
- `frontend/components/Settings.tsx` - Automatic naming
- `frontend/lib/imageAnalyzer.ts` - Brightness detection

## Testing
- ✅ Upload dark wallpaper → Light UI appears
- ✅ Upload light wallpaper → Dark UI appears
- ✅ Remove wallpaper → System theme is restored
- ✅ Filename is used as wallpaper name
- ✅ Long filenames are truncated gracefully

