# Chat Wallpaper Feature Guide

## Overview

The wallpaper feature allows you to customize the background of both your **Home Page** and **Chat Panel** with your own images. Once you select and save a wallpaper, it applies across the entire application for a consistent, personalized experience.

## How to Set a Wallpaper

### Step-by-Step Instructions

1. **Open Settings**
   - Click the gear icon (⚙️) in the top right

2. **Go to Appearance Tab**
   - Click "Appearance" if not already selected

3. **Upload a Wallpaper** (First Time)
   - Scroll down to "Chat Wallpapers" section
   - Click the "Upload" / "Add New" tile
   - Select an image (PNG, JPG, GIF - max 5MB)
   - Give it a name when prompted
   - The wallpaper will be added to your collection

4. **Select a Wallpaper**
   - Click on any wallpaper thumbnail
   - A **blue border** will appear around the selected one
   - "None" removes the wallpaper

5. **Save Your Changes** ⭐ **IMPORTANT!**
   - Click the **"Save" button** at the bottom of the settings
   - The wallpaper will now apply to your chat background

6. **Close Settings**
   - Click "Close" to exit settings
   - Your wallpaper will now show on:
     - **Home Page** - The main landing screen with greeting and quick actions
     - **Chat Panel** - The AI conversation interface
     - Both views maintain the same wallpaper for consistency

---

## Troubleshooting

### Wallpaper Not Showing?

**Problem:** Selected a wallpaper but it's not displaying in chat

**Solution:**
1. Make sure you clicked the **"Save" button** after selecting the wallpaper
2. The "Save" button should turn from gray to black when changes are made
3. Close and reopen the chat window if needed
4. Try a hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)

### Can't Upload Wallpaper?

**Problem:** Upload button not working

**Possible causes:**
- File is too large (max 5MB)
- File is not an image format (must be PNG, JPG, or GIF)
- Browser storage is full

**Solution:**
- Compress your image before uploading
- Use a different image format
- Clear browser storage if full

### Wallpaper Looks Pixelated?

**Problem:** Wallpaper quality is poor

**Solution:**
- Use higher resolution images
- Recommended size: 1920x1080 or larger
- Keep file size under 5MB

---

## Features

### Multiple Wallpapers
- Upload multiple wallpapers and switch between them
- Each wallpaper is saved with a custom name
- Quick carousel-style selection

### Remove Wallpapers
- Hover over a wallpaper thumbnail
- Click the red ❌ button in the top-right corner
- Wallpaper is removed from your collection

### None Option
- Select "None" to remove the wallpaper
- Returns both home page and chat to default backgrounds

### Application-Wide
- **Single wallpaper** applies to both Home Page and Chat Panel
- Consistent visual experience across all views
- Wallpaper persists when navigating between home and chat
- Automatic refresh when changed in settings

---

## Important Notes

### The "Background" Toggle

**Note:** The "Background" toggle in settings is **NOT** for wallpapers!

- The "Background" toggle controls a different setting (`customBackground`)
- Wallpapers work independently of this toggle
- You don't need to enable any toggle to use wallpapers

### How Wallpapers Work

1. **Selection** happens when you click a wallpaper thumbnail
2. **Saving** happens when you click the "Save" button
3. **Application** happens automatically after saving
4. **Storage** is in your browser's localStorage

### Storage Considerations

- Wallpapers are stored as base64 in localStorage
- Browser localStorage has a limit (usually 5-10MB total)
- Large images or too many wallpapers may hit this limit
- Recommended: Keep 3-5 wallpapers maximum

---

## Technical Details

### For Developers

#### How It Works

1. **Upload:** Image → FileReader → Base64 → localStorage
2. **Selection:** Sets `selectedWallpaperId` in state
3. **Save:** Writes to localStorage + dispatches `chatWallpaperChanged` event
4. **Application:** ChatPanel listens for event + applies as `backgroundImage`

#### localStorage Keys

```javascript
chatWallpapers:      JSON array of { id, name, image }
selectedWallpaperId: String ID of currently selected wallpaper
```

#### Custom Event

```javascript
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { 
  detail: wallpaperBase64OrNull 
}));
```

#### CSS Application

Applied to both HomeContent and ChatPanel:

```jsx
<div style={{
  backgroundImage: `url(${wallpaper})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed'
}}>
```

**Components with wallpaper:**
- `frontend/components/HomeContent.tsx` - Home page background
- `frontend/components/ChatPanel.tsx` - Chat panel background
- Both listen to the same `chatWallpaperChanged` event
- Both load from the same localStorage keys

---

## Future Enhancements

Planned improvements:
- [ ] Preset wallpaper library
- [ ] Wallpaper blur/opacity controls
- [ ] Auto-contrast text adjustment
- [ ] Wallpaper categories/tags
- [ ] Cloud sync for wallpapers
- [ ] Wallpaper preview mode

---

Last Updated: November 2025

