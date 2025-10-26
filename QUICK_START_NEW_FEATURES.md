# 🚀 Quick Start - New Features Guide

## ⚠️ IMPORTANT: Clear Your Browser Cache First!

Before testing the new features, you **MUST** clear your browser cache:

### Method 1: Hard Refresh (Easiest)
1. Go to http://localhost:3000
2. Press **Ctrl + Shift + R** (or **Ctrl + F5**)
3. Wait for the page to reload

### Method 2: Developer Tools
1. Press **F12** to open Developer Tools
2. **Right-click** the refresh button in your browser
3. Select **"Empty Cache and Hard Reload"**

### Method 3: Incognito/Private Window
1. Open a new Incognito/Private window
2. Navigate to http://localhost:3000
3. Test features in the fresh session

---

## ✨ New Features to Test

### 1. 🏠 Home Screen
- **URL**: http://localhost:3000
- **What you'll see**: Welcome screen with quick action buttons
- **Actions**: 
  - "Create Project" → Opens template selector
  - "Open Project" → Shows project list
  - "Browse Templates" → Template gallery

### 2. ⚙️ Settings Modal
**Location**: Top-right corner of editor view (gear icon ⚙️)

**To Access**:
1. Create or open a project
2. Click the **⚙️ icon** in the header
3. Configure:
   - AI Provider (Ollama/OpenAI)
   - Ollama Model selection
   - Auto-save settings
   - Theme preferences

**Current Settings**:
- AI Provider: **Ollama** (local)
- Model: **llama3.2:latest**
- Auto-save: **Enabled** (2 seconds)

### 3. 🔍 Chat Focus Mode
**Location**: AI Assistant panel → **⛶ icon** in panel header

**To Use**:
1. Open a project
2. Find "🤖 AI Assistant" panel in right sidebar
3. Click the **⛶ (maximize)** icon in the panel header
4. Chat expands to fullscreen
5. Click **✕** to exit focus mode

**Features in Focus Mode**:
- Fullscreen chat interface
- Expanded message input (3 rows)
- Full conversation history
- Minimal UI distraction

### 4. ⋮⋮ Sidebar Toggle
**Location**: Top-left corner of header

**To Use**:
1. In editor view, find **⋮⋮** button (left of "← Home")
2. Click to hide sidebar → Mind map expands to full width
3. Click **☰** to show sidebar again

**What it hides/shows**:
- AI Chat panel
- Blueprints panel
- Notes panel

---

## 🎯 Complete Test Workflow

### Step 1: Start Fresh
```bash
# Clear browser cache with Ctrl+Shift+R
# Go to: http://localhost:3000
```

### Step 2: Create a Project
1. On home screen, click **"New Project"** or **"Create Project"**
2. Select a template (e.g., "SaaS Application")
3. You'll enter the editor view

### Step 3: Test Settings
1. Click **⚙️** in top-right
2. Review AI settings (should show Ollama)
3. Click "Cancel" or make changes and "Save"

### Step 4: Test Chat
1. Find "🤖 AI Assistant" in right sidebar
2. Type a message: "What features should my SaaS app have?"
3. Press **Enter** or click **Send**
4. Wait for Ollama to respond (may take 10-30 seconds first time)

### Step 5: Test Focus Mode
1. In AI Chat panel, click **⛶** icon
2. Chat goes fullscreen
3. Send another message
4. Click **✕** to exit

### Step 6: Test Sidebar Toggle
1. Click **⋮⋮** in top-left
2. Sidebar disappears, mind map expands
3. Click **☰** to restore sidebar

---

## 🐛 Troubleshooting

### "I still don't see the new features"
1. **Hard refresh again**: Ctrl + Shift + R
2. **Check URL**: Make sure you're on http://localhost:3000 (not cached domain)
3. **Try incognito**: Open incognito/private window
4. **Check containers**: `docker-compose ps` (both should show "Up")

### "Chat doesn't respond"
1. **Check Ollama**: Open http://localhost:11434 (should show "Ollama is running")
2. **Wait longer**: First response can take 30-60 seconds (model loading)
3. **Check backend logs**: `docker logs aiwhisper-backend-1`
4. **Try different model**: Settings → Change to "mistral:latest" or "deepseek-r1:latest"

### "Settings don't save"
1. **Click "Save Changes"**: Page will reload after save
2. **Check localStorage**: Press F12 → Application tab → Local Storage → check for `aiwhisper_settings`

### "Focus mode doesn't work"
1. **Make sure you're in editor view**: Not on home or template selector
2. **Look for ⛶ icon**: Should be in AI Chat panel header (top-right of panel)
3. **Check console**: Press F12 → Console tab → look for errors

---

## 📊 Services Status

Check if all services are running:
```bash
docker-compose ps
```

Should show:
```
aiwhisper-backend-1    Up    0.0.0.0:8000->8000/tcp
aiwhisper-frontend-1   Up    0.0.0.0:3000->3000/tcp
```

---

## 🎨 UI Layout Reference

### Normal View (Sidebar Visible)
```
┌─────────────────────────────────────────────────┐
│ [⋮⋮] [← Home] [Title]    [Stats] [Save] [⚙️]   │
├─────────────────────────────────────────────────┤
│ Mind Map (2/3 width)    │ AI Chat      │       │
│                         │ Blueprints   │       │
│                         │ Notes        │       │
└─────────────────────────────────────────────────┘
```

### Sidebar Hidden
```
┌─────────────────────────────────────────────────┐
│ [☰] [← Home] [Title]     [Stats] [Save] [⚙️]   │
├─────────────────────────────────────────────────┤
│                                                 │
│          Mind Map (Full Width)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Chat Focus Mode
```
┌─────────────────────────────────────────────────┐
│ 🤖 AI Assistant                            [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│        Chat Messages (Fullscreen)               │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Message Input - 3 rows]            [Send]     │
└─────────────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Can see home screen with action buttons
- [ ] Can click ⚙️ and see settings modal
- [ ] Can see AI Chat panel in sidebar
- [ ] Can send message and get response from Ollama
- [ ] Can click ⛶ and enter chat focus mode
- [ ] Can click ⋮⋮ to hide/show sidebar
- [ ] Mind map expands when sidebar is hidden
- [ ] Settings persist after page reload

---

**Need help?** Check the logs:
- Frontend: `docker logs aiwhisper-frontend-1`
- Backend: `docker logs aiwhisper-backend-1`

**All services running?** Both containers are up and ready! 🎉

