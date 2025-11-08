# AI Whisper Documentation Index

Welcome to the AI Whisper documentation! This index will help you find the information you need.

---

## 📚 Documentation Categories

### For End Users

#### Getting Started
- **[Quick Start Guide](QUICK_START_NEW_FEATURES.md)**  
  Get up and running quickly with AI Whisper. Covers installation, first chat, and basic features.

#### Feature Reference
- **[Features List](../FEATURES.md)**  
  Complete inventory of all 95+ features, 6 node types, 5 templates, and API endpoints.

- **[Changelog](CHANGELOG.md)**  
  Version history with detailed release notes for all major features and bug fixes.

- **[Wallpaper Guide](WALLPAPER_GUIDE.md)**  
  How to use chat wallpapers - upload, select, and customize your chat background.

- **[Wallpaper Troubleshooting](WALLPAPER_TROUBLESHOOTING.md)** 🔧  
  Debug guide for wallpaper issues - step-by-step solutions and common fixes.

### For Developers

#### Design & UI
- **[UI Design System](UI_DESIGN_SYSTEM.md)** ⭐ **NEW**  
  Comprehensive design guidelines including:
  - Color palette and theme system
  - Selection states (light gray everywhere!)
  - Button styles and input fields
  - Spacing, borders, and shadows
  - Design principles and consistency rules

- **[Component Documentation](COMPONENTS.md)** ⭐ **NEW**  
  Detailed docs for custom components:
  - **CustomSelect** - Custom dropdown component
  - Props, usage examples, and styling details
  - Keyboard navigation and accessibility
  - Migration guides from native elements

#### Project Planning
- **[Roadmap](ROADMAP.md)**  
  Development timeline, completed phases, and future plans organized by sprint.

- **[Phase Documentation](ARCHIVE/)**  
  Historical implementation docs for completed phases (archived for reference).

---

## 🎨 Design System Quick Reference

### Key Design Principles

**1. Light Gray Selections**
```css
Selected: bg-zinc-100 text-zinc-900 font-medium
Hover:    bg-zinc-50 text-zinc-900
Default:  text-zinc-700
```

**2. Custom Components**
- Use `CustomSelect` for all dropdowns (NOT native `<select>`)
- White backgrounds for popups and overlays
- Light borders (`border-zinc-200`)
- Strong shadows for depth (`shadow-xl`)

**3. Consistent Everywhere**
- Sidebar selections → Light gray
- Dropdown menus → Light gray
- Popup menus → White with light gray selections
- Settings → Light gray selections

### Visual Identity

**Our Signature Look:**
- ✅ Light gray selection backgrounds (`bg-zinc-100`)
- ✅ Clean white popups with light borders
- ✅ Professional, cohesive design
- ✅ Smooth transitions and animations

---

## 📖 How to Use This Documentation

### I want to...

**...learn how to use AI Whisper**
→ Start with [Quick Start Guide](QUICK_START_NEW_FEATURES.md)

**...see what features are available**
→ Check [Features List](../FEATURES.md)

**...understand the design system**
→ Read [UI Design System](UI_DESIGN_SYSTEM.md)

**...use CustomSelect in my component**
→ See [Component Documentation](COMPONENTS.md)

**...know what's coming next**
→ Review [Roadmap](ROADMAP.md)

**...see what changed in the latest version**
→ Browse [Changelog](CHANGELOG.md)

---

## 🔧 Technical Documentation

### Architecture

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React with TypeScript
- **Styling:** Tailwind CSS
- **Mind Mapping:** ReactFlow
- **Icons:** Hugeicons

#### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite with SQLModel ORM
- **AI Integration:** Multi-provider support
  - Ollama (local)
  - OpenAI
  - Anthropic
  - Google Gemini
  - DeepSeek

### Key Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `CustomSelect` | Dropdown selectors | [COMPONENTS.md](COMPONENTS.md) |
| `Sidebar` | Navigation and folders | [COMPONENTS.md](COMPONENTS.md) |
| `ChatPanel` | AI conversation interface | Code comments |
| `MindMap` | Node-based planning canvas | Code comments |
| `Settings` | App configuration | [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) |

---

## 🎯 Development Guidelines

### Before Making UI Changes

1. **Review** [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) for color palette
2. **Check** existing components for similar patterns
3. **Use** `CustomSelect` instead of native `<select>`
4. **Follow** the light gray selection standard
5. **Test** across different screen sizes
6. **Document** any new components in [COMPONENTS.md](COMPONENTS.md)

### Component Checklist

When creating or modifying components:
- [ ] Uses `bg-zinc-100` for selections
- [ ] Has proper hover states (`bg-zinc-50`)
- [ ] Includes keyboard navigation
- [ ] Follows border radius standards (`rounded-xl`)
- [ ] Has smooth transitions
- [ ] Properly typed with TypeScript
- [ ] Documented in COMPONENTS.md

---

## 📝 Contributing to Documentation

### When to Update Docs

**UI_DESIGN_SYSTEM.md:**
- Adding new color variants
- Creating new button styles
- Changing selection colors
- Modifying spacing standards

**COMPONENTS.md:**
- Creating new reusable components
- Updating existing component props
- Adding new usage examples
- Documenting component patterns

**ROADMAP.md:**
- Completing sprint milestones
- Planning new features
- Updating phase status

**CHANGELOG.md:**
- After every release
- When adding major features
- For significant bug fixes

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add visual descriptions where helpful
- Keep formatting consistent
- Update the index when adding new docs

---

## 🚀 Quick Links

### Most Important Docs
1. [UI Design System](UI_DESIGN_SYSTEM.md) - **Start here for design questions**
2. [Component Documentation](COMPONENTS.md) - **Component usage guide**
3. [Quick Start Guide](QUICK_START_NEW_FEATURES.md) - **User onboarding**

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ReactFlow](https://reactflow.dev)
- [FastAPI](https://fastapi.tiangolo.com)

---

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review existing component implementations
3. Consult the design system guidelines
4. Ask the development team

**Remember:** Consistency is key. When in doubt, follow established patterns rather than creating new ones.

---

Last Updated: November 2025  
Version: 0.4.0

