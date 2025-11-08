# Wallpaper Troubleshooting Guide

## Issue: Wallpapers Not Showing Up

If you can select wallpapers but they're not displaying in the background (on Home Page or Chat), follow these debugging steps:

---

## ✅ Step-by-Step Debugging

### 1. **Hard Refresh Your Browser**

First, clear your browser cache:

**Windows/Linux:**
```
Ctrl + Shift + R
```

**Mac:**
```
Cmd + Shift + R
```

**Or manually:**
- Chrome/Edge: `Ctrl + Shift + Delete` → Clear cached images and files
- Firefox: `Ctrl + Shift + Delete` → Cookies and Site Data
- Safari: `Cmd + Option + E`

---

### 2. **Verify Save Process**

1. Open **Settings** → **Appearance**
2. Select a wallpaper (you'll see the **blue checkmark ✓**)
3. Click the **"Save"** button at the bottom
4. You should see an alert: **"Settings saved! Wallpaper has been applied to your chat."**
5. If you don't see this alert, the save didn't work

**Common mistake:** Selecting a wallpaper but NOT clicking Save!

---

### 3. **Check Browser Console**

Open the browser developer console to see debug logs:

**How to open console:**
- Press `F12` or `Ctrl + Shift + I` (Windows/Linux)
- Press `Cmd + Option + I` (Mac)
- Click the **Console** tab

**Look for these logs:**

When you **upload a wallpaper:**
```
(No specific log yet, but the wallpaper should appear in the grid)
```

When you **click Save:**
```
🎨 Saving wallpaper: [Wallpaper Name] ID: [timestamp]
```

When **ChatPanel loads:**
```
💬 ChatPanel loading wallpaper: { savedWallpapers: true, savedSelectedId: '1234567890' }
💬 Found wallpaper: [Wallpaper Name]
```

When **Home Page loads:**
```
🏠 Home loading wallpaper: { savedWallpapers: true, savedSelectedId: '1234567890' }
🏠 Found wallpaper for home: [Wallpaper Name]
```

When **wallpaper changes:**
```
💬 Wallpaper changed event received: true
🏠 Home wallpaper changed event received: true
```

---

### 4. **Inspect localStorage**

Open browser console (F12) and check what's stored:

```javascript
// Check if wallpapers are saved
console.log(JSON.parse(localStorage.getItem('chatWallpapers')));

// Check selected wallpaper ID
console.log(localStorage.getItem('selectedWallpaperId'));
```

**Expected output:**
```javascript
// Wallpapers array
[
  {
    id: "1730000000000",
    name: "My Wallpaper",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
]

// Selected ID
"1730000000000"
```

**If these are `null`:**
- The save didn't work
- Try selecting again and clicking Save

---

### 5. **Check Background Rendering**

With console open (F12), inspect the home page or chat area and look for the background style:

**Inspect the background container:**
1. Right-click on the home page or chat area
2. Select "Inspect" or "Inspect Element"
3. For Home Page: Find the `<div>` with class `flex-1 flex flex-col bg-gradient-to-br`
4. For Chat: Find the `<div>` with class containing `overflow-y-auto`
5. Check the `style` attribute

**Expected:**
```html
<div style="background-image: url(data:image/jpeg;base64,...); background-size: cover; ...">
```

**If missing:**
- The wallpaper state didn't apply
- Check console for errors
- Verify localStorage has the data
- Try navigating to a different view and back

---

### 6. **Test with Fresh Data**

If nothing works, try starting fresh:

```javascript
// Clear all wallpaper data
localStorage.removeItem('chatWallpapers');
localStorage.removeItem('selectedWallpaperId');

// Reload the page
location.reload();
```

Then:
1. Upload a NEW wallpaper
2. Select it (see checkmark)
3. Click **Save** (see alert)
4. Check if it appears

---

## 🐛 Common Issues & Solutions

### Issue 1: "Save" Button is Grayed Out

**Problem:** Can't click the Save button

**Solution:**
- The Save button is only enabled when changes are made
- Select a different wallpaper or change a theme setting
- The button should turn black/clickable

---

### Issue 2: Wallpaper Appears in Settings but Not on Home/Chat

**Problem:** Can see the wallpaper thumbnail but not in background on home page or chat

**Possible causes:**
1. **Didn't click Save** - The most common issue!
2. **Browser cache** - Hard refresh needed
3. **localStorage quota** - Storage is full
4. **Event not firing** - Check console logs

**Solution:**
1. Select wallpaper → See checkmark
2. Click "Save" → See alert
3. Hard refresh (Ctrl+Shift+R)
4. Check console for errors

---

### Issue 3: Wallpaper Was Working, Now It's Gone

**Problem:** Wallpaper disappeared after reload

**Possible causes:**
1. **Browser cleared storage** - Privacy mode or settings
2. **localStorage was cleared** - Manual or automated
3. **Different browser** - localStorage is per-browser

**Solution:**
- Re-upload your wallpaper
- Check browser privacy settings
- Don't use incognito/private mode for persistent data

---

### Issue 4: Wallpaper is Too Large / Pixelated

**Problem:** Image quality or performance issues

**Solution:**
- Images are stored as base64 in localStorage (5-10MB limit)
- Compress large images before uploading
- Recommended size: 1920x1080 or smaller
- Keep under 2MB for best performance

---

### Issue 5: Multiple Wallpapers Not Saving

**Problem:** Can only save one wallpaper

**Solution:**
- You CAN have multiple wallpapers
- Each upload adds to the collection
- Switch between them by clicking different thumbnails
- Always click "Save" after selecting

---

## 🔍 Advanced Debugging

### Check Event Listener

In the console, test if the event system is working:

```javascript
// Manually dispatch wallpaper change
window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { 
  detail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' 
}));
```

**Expected:** Chat background should change (even if it's just a 1x1 red pixel)

If nothing happens:
- ChatPanel isn't mounted
- Event listener isn't registered
- Check for JavaScript errors

---

### Verify Component Mounting

Check if Home or ChatPanel is rendering:

```javascript
// Look for home wallpaper container
document.querySelector('[class*="bg-gradient-to-br"]')

// Look for chat wallpaper container
document.querySelector('[class*="overflow-y-auto"]')
```

**Expected:** Should return the background container element

If `null`:
- You're not in the correct view
- Component isn't mounted
- Navigate to home or chat view

---

### Check for Conflicting Styles

Sometimes other styles override the background:

**Look for:**
- Other `background` CSS rules
- `background-color` taking precedence
- Parent element styles

**Solution:**
- Use browser inspector
- Check computed styles
- Look for `!important` rules

---

## 📋 Debug Checklist

Use this checklist to systematically debug:

- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Selected wallpaper (blue checkmark visible)
- [ ] Clicked "Save" button
- [ ] Saw "Settings saved!" alert
- [ ] Checked browser console for logs
- [ ] Verified localStorage has data
- [ ] Inspected chat div for background-image style
- [ ] Tried with a different/smaller image
- [ ] Cleared localStorage and tried fresh upload
- [ ] Checked for JavaScript errors in console

---

## 🆘 Still Not Working?

If you've tried everything above:

1. **Screenshot the console logs** (when you click Save and load chat)
2. **Check for errors** in the console (red text)
3. **Note your browser** and version
4. **Try a different browser** to isolate the issue

### Report the Issue

Include:
- Browser and version
- Console logs (both Settings and ChatPanel)
- localStorage contents
- Steps to reproduce
- Any error messages

---

## 💡 Quick Fixes Summary

**Most Common Solutions:**

1. **Click the Save button!** (80% of cases)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Check console logs** for actual errors
4. **Verify localStorage** has the data
5. **Try a smaller image** (<2MB)

---

Last Updated: November 2025

