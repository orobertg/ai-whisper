# Settings Modal Specification

**Document:** 07_SETTINGS.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 03_STYLING_ARCHITECTURE.md

---

## Overview

The Settings Modal (`Settings.tsx`) provides user preferences for appearance (theme, wallpapers) and AI provider configuration. It's a modal overlay with tabbed interface and theme-aware styling.

---

## Component Structure

### File: `frontend/components/Settings.tsx`

### Props Interface

```typescript
type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'appearance' | 'providers';
  initialProvider?: string;
};

type Theme = "light" | "dark" | "translucent" | "system";

type Wallpaper = {
  id: string;
  name: string;
  image: string; // base64 data URL
};
```

### State Management

```typescript
const [activeTab, setActiveTab] = useState<'appearance' | 'providers'>(initialTab || 'appearance');
const [theme, setTheme] = useState<Theme>("system");
const [customBackground, setCustomBackground] = useState(false);
const [chatColor, setChatColor] = useState(false);
const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
const [selectedWallpaperId, setSelectedWallpaperId] = useState<string | null>(null);
const [wallpaperBlur, setWallpaperBlur] = useState(0);
const [hasChanges, setHasChanges] = useState(false);
const [providerHasChanges, setProviderHasChanges] = useState(false);
```

### Theme Integration

```typescript
const { setTheme: setGlobalTheme, isLight, getTextClass, getBorderClass } = useTheme();

const bgClass = isLight ? 'bg-white' : 'bg-zinc-900';
const borderClass = getBorderClass();
const textPrimary = getTextClass('primary');
const textSecondary = getTextClass('secondary');
const textMuted = getTextClass('muted');
```

---

## Modal Structure

### Layout

```
┌─────────────────────────────────────┐
│  Settings                      [X]  │ Header
├─────────────────────────────────────┤
│  [Appearance] [AI Providers]        │ Tabs
├─────────────────────────────────────┤
│                                     │
│  [Tab Content - Scrollable]         │ Content
│                                     │
│                                     │
├─────────────────────────────────────┤
│              [Close] [Save]         │ Footer
└─────────────────────────────────────┘
```

### Modal Container

```tsx
<div 
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" 
  onClick={handleClose}
>
  <div 
    className={`
      ${bgClass} 
      rounded-3xl 
      shadow-2xl 
      w-full 
      mx-4 
      flex 
      flex-col 
      ${activeTab === "providers" ? "max-w-4xl max-h-[85vh]" : "max-w-xl max-h-[80vh]"}
    `} 
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    {/* Tabs */}
    {/* Content - Scrollable */}
    {/* Footer */}
  </div>
</div>
```

**Key Features:**
- **Z-Index:** `z-50` to overlay everything
- **Backdrop:** `bg-black/30 backdrop-blur-sm` for focus
- **Click Outside:** Close modal when clicking backdrop
- **Stop Propagation:** Prevent close when clicking modal content
- **Dynamic Size:** Larger for providers tab
- **Max Height:** Enforced with overflow for scrolling

---

## Appearance Tab

### 1. Interface Theme Section

```tsx
<div>
  <div className="mb-3">
    <h3 className={`text-sm font-semibold ${textPrimary}`}>
      Interface Theme
    </h3>
    <p className={`text-xs ${textSecondary} mt-0.5`}>
      Select or customize your UI theme
    </p>
  </div>

  <div className="grid grid-cols-4 gap-4">
    {/* System Preference */}
    <button
      onClick={() => handleThemeChange("system")}
      className={`
        group relative rounded-2xl border-2 transition-all overflow-hidden
        ${theme === "system"
          ? "border-blue-500 shadow-md"
          : `${borderClass.replace('border-', 'border-2 border-')} hover:border-zinc-300`
        }
      `}
    >
      {/* Preview mockup */}
      <div className="aspect-[4/3] bg-gradient-to-br from-zinc-200 via-white to-zinc-200 p-3">
        {/* Light/Dark split mockup */}
      </div>
      <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
        <div className="flex items-center justify-center gap-1.5">
          <MonitorIcon size={16} />
          <span className="text-xs font-medium">System preference</span>
        </div>
      </div>
    </button>

    {/* Light Mode */}
    <button
      onClick={() => handleThemeChange("light")}
      className={/* similar structure */}
    >
      {/* Light theme mockup */}
    </button>

    {/* Dark Mode */}
    <button
      onClick={() => handleThemeChange("dark")}
      className={/* similar structure */}
    >
      {/* Dark theme mockup */}
    </button>

    {/* Translucent Mode */}
    <button
      onClick={() => handleThemeChange("translucent")}
      className={/* similar structure */}
    >
      {/* Translucent theme mockup with gradient */}
    </button>
  </div>
</div>
```

**Theme Change Handler:**
```typescript
const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);
  applyTheme(newTheme); // Apply immediately for preview
  setHasChanges(true);
  
  // Update global theme context
  if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'translucent') {
    setGlobalTheme(newTheme);
  } else if (newTheme === 'system') {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setGlobalTheme(prefersDark ? 'dark' : 'light');
  }
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('themeChanged'));
};
```

**Apply Theme Function:**
```typescript
const applyTheme = (selectedTheme: Theme) => {
  let effectiveTheme = selectedTheme;
  
  if (selectedTheme === "system") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
      ? "dark" 
      : "light";
  }
  
  document.documentElement.classList.remove("light", "dark", "translucent");
  document.documentElement.classList.add(effectiveTheme);
};
```

### 2. Background Toggle

```tsx
<div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
  <div>
    <h3 className={`text-sm font-medium ${textPrimary}`}>Background</h3>
    <p className={`text-xs ${textSecondary} mt-0.5`}>
      Customize your background
    </p>
  </div>
  <button
    onClick={() => {
      setCustomBackground(!customBackground);
      setHasChanges(true);
    }}
    className={`
      relative w-11 h-6 rounded-full transition-colors
      ${customBackground ? 'bg-blue-500' : 'bg-zinc-300'}
    `}
  >
    <div className={`
      absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
      transition-transform
      ${customBackground ? 'translate-x-5' : 'translate-x-0'}
    `} />
  </button>
</div>
```

### 3. Chat Wallpapers Section

```tsx
{customBackground && (
  <div className="py-3">
    <div className="mb-3">
      <h3 className={`text-sm font-semibold ${textPrimary}`}>
        Chat Wallpapers
      </h3>
      <p className={`text-xs ${textSecondary} mt-0.5`}>
        Select or upload custom backgrounds for the chat area
      </p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      {/* None Option */}
      <button
        onClick={() => handleSelectWallpaper(null)}
        className={`
          group relative rounded-2xl border-2 transition-all overflow-hidden
          ${selectedWallpaperId === null
            ? "border-blue-500 shadow-md"
            : `${borderClass.replace('border-', 'border-2 border-')}`
          }
        `}
      >
        <div className="aspect-square bg-zinc-100 flex items-center justify-center">
          <span className="text-2xl">🚫</span>
        </div>
        <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
          <p className="text-xs font-medium text-center">None</p>
        </div>
      </button>

      {/* Existing Wallpapers */}
      {wallpapers.map((wallpaper) => (
        <div
          key={wallpaper.id}
          className={`
            group relative rounded-2xl border-2 transition-all overflow-hidden
            ${selectedWallpaperId === wallpaper.id
              ? "border-blue-500 shadow-md"
              : borderClass.replace('border-', 'border-2 border-')
            }
          `}
        >
          <button
            onClick={() => handleSelectWallpaper(wallpaper.id)}
            className="w-full"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={wallpaper.image}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
              <p className="text-xs font-medium text-center truncate">
                {wallpaper.name}
              </p>
            </div>
          </button>
          
          {/* Remove Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveWallpaper(wallpaper.id);
            }}
            className="
              absolute top-2 right-2 
              bg-red-500 text-white 
              rounded-full p-1 
              opacity-0 group-hover:opacity-100 
              transition-opacity
            "
          >
            <XIcon size={12} />
          </button>
        </div>
      ))}

      {/* Upload New Wallpaper */}
      <label
        htmlFor="wallpaper-upload"
        className={`
          group relative rounded-2xl border-2 border-dashed 
          transition-all overflow-hidden cursor-pointer
          ${borderClass.replace('border-', 'border-2 border-')}
          hover:border-blue-500
        `}
      >
        <div className="aspect-square flex flex-col items-center justify-center gap-2">
          <UploadIcon size={24} className="text-zinc-400" />
          <span className="text-xs text-zinc-500">Upload</span>
        </div>
        <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
          <p className="text-xs font-medium text-zinc-500 text-center">
            Add New
          </p>
        </div>
      </label>
      <input
        id="wallpaper-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleWallpaperUpload}
      />
    </div>
  </div>
)}
```

**Wallpaper Upload Handler:**
```typescript
const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageData = event.target?.result as string;
    const newWallpaper: Wallpaper = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      image: imageData
    };
    
    setWallpapers([...wallpapers, newWallpaper]);
    setSelectedWallpaperId(newWallpaper.id);
    setHasChanges(true);
  };
  
  reader.readAsDataURL(file);
};
```

**Remove Wallpaper Handler:**
```typescript
const handleRemoveWallpaper = (id: string) => {
  setWallpapers(wallpapers.filter(w => w.id !== id));
  if (selectedWallpaperId === id) {
    setSelectedWallpaperId(null);
  }
  setHasChanges(true);
};
```

### 4. Wallpaper Blur Control

```tsx
{selectedWallpaperId && selectedWallpaperId !== 'null' && (
  <div className={`
    mt-6 p-4 rounded-xl border
    ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-800/50 border-zinc-700'}
  `}>
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className={`text-sm font-medium ${textPrimary}`}>
          Wallpaper Blur
        </h4>
        <p className={`text-xs ${textSecondary} mt-0.5`}>
          Add blur effect to wallpaper
        </p>
      </div>
      <span className="text-sm font-semibold text-blue-600">
        {wallpaperBlur}px
      </span>
    </div>
    
    <input
      type="range"
      min="0"
      max="20"
      value={wallpaperBlur}
      onChange={(e) => {
        setWallpaperBlur(Number(e.target.value));
        setHasChanges(true);
      }}
      className="w-full accent-blue-500"
    />
  </div>
)}
```

---

## AI Providers Tab

### Structure

```tsx
{activeTab === "providers" && (
  <ProviderSettings
    onHasChanges={setProviderHasChanges}
    initialProvider={initialProvider}
  />
)}
```

**Note:** `ProviderSettings` is a separate component that manages AI provider configurations (API keys, endpoints, etc.). It follows the same theme-aware patterns.

---

## Save Changes Handler

```typescript
const handleSaveChanges = () => {
  if (activeTab === "appearance") {
    // Save theme
    localStorage.setItem("systemTheme", theme);
    
    // Update ThemeContext
    if (theme === 'light' || theme === 'dark' || theme === 'translucent') {
      setGlobalTheme(theme);
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setGlobalTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Save appearance settings
    localStorage.setItem("customBackground", String(customBackground));
    localStorage.setItem("chatColor", String(chatColor));
    localStorage.setItem("chatWallpapers", JSON.stringify(wallpapers));
    localStorage.setItem("wallpaperBlur", String(wallpaperBlur));
    
    // Handle wallpaper selection
    if (customBackground && selectedWallpaperId && selectedWallpaperId !== 'null') {
      localStorage.setItem("selectedWallpaperId", selectedWallpaperId);
      const selectedWallpaper = wallpapers.find(w => w.id === selectedWallpaperId);
      
      // Dispatch events to notify all components
      window.dispatchEvent(new CustomEvent('wallpaperChanged'));
      window.dispatchEvent(new CustomEvent('chatWallpaperChanged', {
        detail: selectedWallpaper || null
      }));
    } else {
      localStorage.removeItem("selectedWallpaperId");
      window.dispatchEvent(new CustomEvent('wallpaperChanged'));
      window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { detail: null }));
    }
    
    applyTheme(theme);
    setHasChanges(false);
    
    // Dispatch theme change event
    window.dispatchEvent(new Event('themeChanged'));
  }
};
```

**Critical: Event Dispatching**
- `wallpaperChanged` → For `ThemeContext` and `page.tsx`
- `chatWallpaperChanged` → For `ChatPanel` component
- `themeChanged` → For components listening to theme changes

---

## Load Settings on Mount

```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem("systemTheme") as Theme;
  const savedBg = localStorage.getItem("customBackground") === "true";
  const savedColor = localStorage.getItem("chatColor") === "true";
  const savedWallpapers = localStorage.getItem("chatWallpapers");
  const savedSelectedId = localStorage.getItem("selectedWallpaperId");
  const savedBlur = localStorage.getItem("wallpaperBlur");
  
  if (savedTheme) {
    setTheme(savedTheme);
    applyTheme(savedTheme);
    
    // Sync with ThemeContext
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'translucent') {
      setGlobalTheme(savedTheme);
    } else if (savedTheme === 'system') {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setGlobalTheme(prefersDark ? 'dark' : 'light');
    }
  } else {
    applyTheme("system");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setGlobalTheme(prefersDark ? 'dark' : 'light');
  }
  
  setCustomBackground(savedBg);
  setChatColor(savedColor);
  
  if (savedWallpapers) {
    try {
      const parsed = JSON.parse(savedWallpapers);
      setWallpapers(Array.isArray(parsed) ? parsed : []);
    } catch {
      setWallpapers([]);
    }
  }
  
  setSelectedWallpaperId(savedSelectedId);
  setWallpaperBlur(savedBlur ? Number(savedBlur) : 0);
}, [setGlobalTheme]);
```

---

## Footer Actions

```tsx
<div className={`
  px-6 py-4 border-t ${borderClass} 
  flex justify-end items-center gap-3 
  flex-shrink-0
`}>
  <button
    onClick={handleClose}
    className={`
      px-5 py-2 text-sm font-medium rounded-xl transition-colors
      ${isLight
        ? 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
      }
    `}
  >
    Close
  </button>
  <button
    onClick={handleSaveChanges}
    disabled={activeTab === "appearance" ? !hasChanges : !providerHasChanges}
    className={`
      px-6 py-2 text-sm font-medium rounded-xl transition-colors
      ${(activeTab === "appearance" ? hasChanges : providerHasChanges)
        ? `${isLight ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-zinc-100'} 
           ${isLight ? 'text-white' : 'text-zinc-900'}`
        : `${isLight ? 'bg-zinc-200 text-zinc-400' : 'bg-zinc-800 text-zinc-600'} 
           cursor-not-allowed`
      }
    `}
  >
    Save
  </button>
</div>
```

---

## Testing Checklist

### Visual
- [ ] Modal displays correctly in all themes
- [ ] Theme preview cards show correct mockups
- [ ] Wallpaper thumbnails display correctly
- [ ] Blur slider shows current value
- [ ] Disabled save button is visually distinct

### Functional
- [ ] Theme changes apply immediately
- [ ] Theme persists after save
- [ ] Wallpaper upload works
- [ ] Wallpaper selection updates preview
- [ ] Wallpaper removal works
- [ ] Blur slider updates wallpaper
- [ ] Settings load from localStorage
- [ ] Save button enables on changes
- [ ] Close button works

### Integration
- [ ] Theme changes propagate to app
- [ ] Wallpaper changes propagate to chat
- [ ] Events dispatch correctly
- [ ] localStorage updates correctly
- [ ] No console errors

---

## Next Document

Proceed to **09_STATE_MANAGEMENT.md** for state and context specifications.

