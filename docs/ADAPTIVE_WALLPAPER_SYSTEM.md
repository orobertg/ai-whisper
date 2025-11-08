# Adaptive Wallpaper System

## Overview

AI Whisper features an intelligent wallpaper system that automatically analyzes the brightness of uploaded wallpapers and adapts the UI elements for optimal contrast and readability.

---

## 🎨 How It Works

### 1. Image Analysis

When you upload a wallpaper, the system:

1. **Analyzes the image** using canvas-based pixel sampling
2. **Calculates average brightness** using the luminance formula: `Y = 0.299R + 0.587G + 0.114B`
3. **Determines theme** (light or dark) based on a threshold of 140 (out of 255)
4. **Stores brightness data** with the wallpaper in localStorage

### 2. Adaptive UI

Based on the wallpaper's brightness, the UI automatically switches between two modes:

#### **Light Wallpapers** (brightness > 140)
- **Darker UI elements** for contrast
- **White/light backgrounds** for panels
- **Darker text** (zinc-900, zinc-700)
- **Subtle borders** (zinc-300)
- **Darker shadows** for depth

#### **Dark Wallpapers** (brightness ≤ 140)
- **Lighter UI elements** for visibility
- **Semi-transparent dark panels** with blur
- **Light text** (white, gray-200)
- **Subtle borders** (zinc-700)
- **Light shadows** for depth

---

## 🔧 Technical Implementation

### Components

**1. Image Analyzer (`frontend/lib/imageAnalyzer.ts`)**
```typescript
analyzeImageBrightness(imageData: string): Promise<ImageAnalysis>
```
- Samples image at 100x100 pixels for performance
- Uses perceived brightness formula
- Returns brightness value (0-255) and isLight boolean

**2. Settings Component**
- Analyzes on upload
- Stores brightness data with wallpaper
- Dispatches full wallpaper object with theme data

**3. Home Page**
- Receives wallpaper theme
- Passes to HomeContent component

**4. HomeContent Component**
- Applies adaptive styles based on `wallpaperTheme` prop
- Switches between light/dark UI classes dynamically

### Data Structure

```typescript
type Wallpaper = {
  id: string;
  name: string;
  image: string;          // base64 encoded
  brightness?: number;    // 0-255
  isLight?: boolean;      // theme determination
};
```

### localStorage Keys

```javascript
chatWallpapers: [
  {
    id: "1730000000000",
    name: "Ocean Waves",
    image: "data:image/jpeg;base64,...",
    brightness: 95,
    isLight: false
  }
]
selectedWallpaperId: "1730000000000"
```

---

## 📋 Adaptive Styles Reference

### Headers

**Light Wallpaper:**
```css
bg-white/90 backdrop-blur-xl border-zinc-200/80
```

**Dark Wallpaper:**
```css
bg-zinc-900/70 backdrop-blur-xl border-zinc-800/50
```

### Text

**Light Wallpaper:**
- Primary: `text-zinc-900`
- Secondary: `text-zinc-700`
- Tertiary: `text-zinc-600`

**Dark Wallpaper:**
- Primary: `text-white`
- Secondary: `text-gray-200`
- Tertiary: `text-gray-400`

### Buttons

**Light Wallpaper:**
```css
border-zinc-300/70 hover:border-zinc-400
bg-white/70 text-zinc-800 hover:text-zinc-900
```

**Dark Wallpaper:**
```css
border-zinc-700/70 hover:border-zinc-600
bg-zinc-900/60 text-gray-200 hover:text-white
```

### Panels & Cards

**Light Wallpaper:**
```css
bg-white/90 backdrop-blur-md border-zinc-300/70
```

**Dark Wallpaper:**
```css
bg-zinc-900/80 backdrop-blur-md border-zinc-700/70
```

---

## 🚀 User Experience

### Upload Process

1. **Select wallpaper** in Settings → Appearance
2. **System analyzes** brightness automatically
3. **Choose name** for wallpaper
4. **Wallpaper is added** to collection with theme data
5. **Select wallpaper** (checkmark appears)
6. **Click Save** button
7. **UI adapts** instantly to wallpaper theme

### Console Logs

When uploading:
```
✅ Wallpaper "Ocean Waves" uploaded - Dark theme (brightness: 95)
🎨 Image Analysis: { averageBrightness: '95.23', isLight: false, theme: 'dark' }
```

When loading:
```
🏠 Home loading wallpaper: { savedWallpapers: true, savedSelectedId: '1730000000000' }
🏠 Found wallpaper for home: Ocean Waves
🎨 Wallpaper theme: dark (brightness: 95)
```

---

## ✨ Benefits

### 1. **Automatic Adaptation**
- No manual theme switching needed
- Works with any wallpaper
- Instant response

### 2. **Optimal Readability**
- Text always contrasts with background
- Buttons and cards remain visible
- Professional appearance maintained

### 3. **Consistent Experience**
- Same wallpaper across home and chat
- UI adapts consistently everywhere
- Smooth transitions

### 4. **Smart Algorithm**
- Perceived brightness (luminance formula)
- Threshold tuned for best results
- Fallback to dark theme if analysis fails

---

## 🎯 Design Philosophy

### Light Wallpapers
Think: Beach, snow, clouds, bright sky

**UI Approach:**
- Mimic "light mode" apps
- White panels with subtle shadows
- Dark text for readability
- Clean, minimal look

### Dark Wallpapers
Think: Night sky, forest, ocean, abstract dark

**UI Approach:**
- Mimic "dark mode" apps
- Semi-transparent dark panels
- Light text for visibility
- Glass-morphism effects

---

## 🔄 Event System

### Wallpaper Change Event

```typescript
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { 
  detail: {
    id: "1730000000000",
    name: "Ocean Waves",
    image: "data:image/jpeg;base64,...",
    brightness: 95,
    isLight: false
  }
}));
```

**Listeners:**
- Home page (page.tsx)
- Chat panel (ChatPanel.tsx)

Both components receive full wallpaper data and update their theme accordingly.

---

## 📊 Brightness Threshold

### Why 140 instead of 127.5?

The threshold is set to **140** (out of 255) rather than the mathematical middle (127.5):

**Reasoning:**
- Most wallpapers tend to be darker
- Humans perceive brightness non-linearly
- 140 provides better results in practice
- Favors dark theme (which looks better with blur effects)

**Formula:**
```javascript
const isLight = averageBrightness > 140;
```

---

## 🛠️ Fallback Behavior

If brightness analysis fails:
- **Defaults to dark theme**
- **Brightness value: 100**
- **isLight: false**
- System continues to work normally

---

## 🎨 Examples

### Scenario 1: Beach Wallpaper (Light)
```
Brightness: 180
Theme: Light
UI: Dark text, white panels, subtle shadows
```

### Scenario 2: Night Sky Wallpaper (Dark)
```
Brightness: 65
Theme: Dark
UI: Light text, dark panels with blur, glass effect
```

### Scenario 3: Sunset Wallpaper (Medium-Dark)
```
Brightness: 120
Theme: Dark (below 140 threshold)
UI: Light text, dark panels
```

---

## 🚧 Future Enhancements

Potential improvements:
- [ ] Adjustable brightness threshold in settings
- [ ] Manual theme override option
- [ ] Region-based analysis (focus on center of image)
- [ ] Dominant color extraction
- [ ] Seasonal wallpaper suggestions
- [ ] Preset wallpaper library with pre-analyzed themes
- [ ] Auto-wallpaper rotation with time-based themes

---

## 📱 Responsive Design

The adaptive system works across:
- **Desktop** - Full panels and effects
- **Tablet** - Optimized layouts
- **Mobile** - Simplified shadows, maintained contrast

---

## 🔐 Privacy & Performance

### Storage
- Wallpapers stored in localStorage (browser-only)
- No server uploads
- Data stays on your device

### Performance
- Analysis: ~100ms average
- Sampling: 100x100 pixels (fast)
- No impact on app performance
- One-time analysis on upload

---

## 💡 Tips for Best Results

### Wallpaper Selection

**For Light Wallpapers:**
- Use images with overall bright tones
- Avoid high contrast images
- Beaches, clouds, snow work great

**For Dark Wallpapers:**
- Use images with darker tones
- Abstract, night scenes, forests
- Deep blues, blacks work well

### Recommendations

- **Image size:** 1920x1080 or larger
- **File size:** Under 2MB for best performance
- **Format:** JPG for photos, PNG for graphics
- **Contrast:** Moderate contrast works best

---

## 📝 Changelog

### v0.4.0 - Adaptive Wallpaper System
- ✅ Automatic brightness detection
- ✅ Light/dark theme switching
- ✅ Comprehensive UI adaptation
- ✅ Luminance-based analysis
- ✅ Persistent theme storage
- ✅ Real-time UI updates

---

Last Updated: November 2025  
Version: 0.4.0

