# AIWhisper Documentation

## 📚 Documentation Index

Welcome to the AIWhisper documentation! This directory contains comprehensive guides for understanding, using, and developing AIWhisper features.

---

## 🎯 Quick Navigation

### For New Users
- **[Getting Started](./GETTING_STARTED.md)** - Installation and first steps *(coming soon)*
- **[User Guide](./USER_GUIDE.md)** - How to use AIWhisper features *(coming soon)*

### For Developers
- **[Development Setup](./DEVELOPMENT.md)** - Set up your dev environment *(coming soon)*
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and tech stack *(coming soon)*

### For Contributors
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute *(coming soon)*
- **[Code Style](./CODE_STYLE.md)** - Coding standards *(coming soon)*

---

## 🎨 UI/UX Documentation

### Theme System
- **[UI Design System](./UI_DESIGN_SYSTEM.md)** - Design principles and patterns
- **[Components](./COMPONENTS.md)** - Component library documentation
- **[Theme System Architecture](./THEME_SYSTEM_ARCHITECTURE.md)** ⭐ NEW - Centralized theming
  - React Context implementation
  - Helper functions for styling
  - Color palette and accessibility
  - Migration guide

### Wallpaper Feature
- **[Wallpaper Guide](./WALLPAPER_GUIDE.md)** - How to use custom backgrounds
- **[Wallpaper Troubleshooting](./WALLPAPER_TROUBLESHOOTING.md)** - Common issues
- **[Adaptive Wallpaper System](./ADAPTIVE_WALLPAPER_SYSTEM.md)** - Brightness detection
- **[Wallpaper Settings Update](./WALLPAPER_SETTINGS_UPDATE.md)** - Settings integration
- **[Wallpaper UX Improvements](./WALLPAPER_UX_IMPROVEMENTS.md)** - Enhancement history
- **[Theme Detection Fix](./THEME_DETECTION_FIX.md)** - Theme bug fixes

---

## 🚀 Feature Planning

### Kanban Board Project ⭐ NEW
A major feature addition bringing full project management capabilities to AIWhisper.

#### Overview Documents
1. **[Kanban Project Summary](./KANBAN_PROJECT_SUMMARY.md)** - **START HERE**
   - Executive summary
   - Documentation structure
   - Quick start guide
   - Success metrics

2. **[Kanban Board Planning](./KANBAN_BOARD_PLANNING.md)**
   - Feature goals and vision
   - Data model design
   - Component architecture
   - User stories
   - Implementation phases
   - Open questions

3. **[Theme System Architecture](./THEME_SYSTEM_ARCHITECTURE.md)**
   - Centralized theme management
   - ThemeContext implementation
   - Helper functions and utilities
   - Color palette specification
   - Accessibility guidelines
   - Migration strategy

4. **[Kanban Database Schema](./KANBAN_DATABASE_SCHEMA.md)**
   - SQLModel database models
   - REST API specifications
   - Request/response examples
   - Task ID generation
   - Database indexing
   - AI endpoints

5. **[Kanban Implementation Roadmap](./KANBAN_IMPLEMENTATION_ROADMAP.md)**
   - 6-phase implementation plan
   - Day-by-day task breakdown
   - Component code examples
   - Testing checklists
   - Future enhancements

#### Reading Order
For **Product/Design Review**:
```
1. KANBAN_PROJECT_SUMMARY.md (10 min)
2. KANBAN_BOARD_PLANNING.md (20 min)
3. THEME_SYSTEM_ARCHITECTURE.md (15 min)
```

For **Backend Development**:
```
1. KANBAN_PROJECT_SUMMARY.md (10 min)
2. KANBAN_DATABASE_SCHEMA.md (30 min)
3. KANBAN_IMPLEMENTATION_ROADMAP.md - Phase 3 (20 min)
```

For **Frontend Development**:
```
1. KANBAN_PROJECT_SUMMARY.md (10 min)
2. THEME_SYSTEM_ARCHITECTURE.md (20 min)
3. KANBAN_IMPLEMENTATION_ROADMAP.md - Phase 4 (30 min)
```

---

## 🔧 Technical Documentation

### Backend
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation *(coming soon)*
- **[Database Schema](./DATABASE_SCHEMA.md)** - Current database structure *(coming soon)*
- **[AI Providers](./AI_PROVIDERS.md)** - AI integration details *(coming soon)*

### Frontend
- **[Component Library](./COMPONENTS.md)** - React component documentation
- **[State Management](./STATE_MANAGEMENT.md)** - State patterns *(coming soon)*
- **[Routing](./ROUTING.md)** - Navigation structure *(coming soon)*

---

## 📝 Planning Documents

### Active Projects
- ✅ **Custom Wallpapers** - Completed
- ✅ **Model Selector UX** - Completed
- 🚧 **Kanban Board** - In Planning (4 documents)
- 🚧 **Enhanced Recent Chats** - In Planning
- 🚧 **Centralized Theme System** - In Planning

### Completed Projects
- Custom wallpaper system with blur effects
- Smart model selector with green dot indicators
- Auto-redirect to settings for unconfigured models
- Light/dark theme with wallpaper support

---

## 🎯 Project Status

### Current Version: 0.2.0

#### Recent Updates (Latest First)
- **2025-01-08**: Kanban board planning documents created
- **2025-01-08**: Model selector UX improvements
- **2025-01-08**: Theme system architecture designed
- **2025-01-07**: OpenAI connectivity fixes
- **2025-01-06**: Folder management UI
- **2025-01-05**: Custom wallpaper system

#### Upcoming Features
1. **Kanban Board** (3-4 weeks)
   - Enhanced recent chats
   - Centralized theme system
   - Task management UI
   - AI task generation

2. **User Accounts** (TBD)
   - Authentication
   - Multi-user support
   - Permissions

3. **Mobile App** (TBD)
   - React Native
   - Offline mode
   - Push notifications

---

## 🤝 Contributing

### How to Contribute
1. Read the [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*
2. Check the [Good First Issues](https://github.com/yourorg/aiwhisper/labels/good%20first%20issue)
3. Fork the repository
4. Create a feature branch
5. Submit a pull request

### Documentation Contributions
Help us improve documentation by:
- Fixing typos or unclear explanations
- Adding examples and screenshots
- Translating docs to other languages
- Creating video tutorials

---

## 📖 Additional Resources

### External Links
- [Project Website](https://aiwhisper.app) *(coming soon)*
- [Blog](https://blog.aiwhisper.app) *(coming soon)*
- [Community Forum](https://forum.aiwhisper.app) *(coming soon)*
- [Discord Server](https://discord.gg/aiwhisper) *(coming soon)*

### Related Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📋 Documentation Standards

### File Naming Convention
- Use UPPERCASE_WITH_UNDERSCORES for doc files
- Use descriptive names (e.g., `KANBAN_BOARD_PLANNING.md`)
- Group related docs with common prefixes (e.g., `KANBAN_*`, `WALLPAPER_*`)

### Document Structure
All documentation should include:
1. **Title** - Clear, descriptive heading
2. **Overview** - Brief introduction (2-3 sentences)
3. **Table of Contents** - For docs > 500 words
4. **Content** - Well-organized sections with headers
5. **Examples** - Code samples where applicable
6. **Next Steps** - Clear action items
7. **Metadata** - Version, date, status

### Markdown Best Practices
- Use proper heading hierarchy (H1 → H2 → H3)
- Include code blocks with language tags
- Add alt text to images
- Use tables for structured data
- Link to related documents

---

## 🔍 Search Tips

To find specific documentation:
1. Use GitHub's search: Press `/` and search within the `docs/` folder
2. Check the relevant section index above
3. Look for documents with specific prefixes:
   - `KANBAN_*` - Kanban board feature
   - `WALLPAPER_*` - Custom wallpaper feature
   - `THEME_*` - Theme system
   - `API_*` - API documentation

---

## 📞 Need Help?

- **Bug Reports**: [Open an issue](https://github.com/yourorg/aiwhisper/issues/new?template=bug_report.md)
- **Feature Requests**: [Open an issue](https://github.com/yourorg/aiwhisper/issues/new?template=feature_request.md)
- **Questions**: [Ask in Discussions](https://github.com/yourorg/aiwhisper/discussions)
- **Security Issues**: Email security@aiwhisper.app

---

## 📄 License

This documentation is licensed under [MIT License](../LICENSE).

---

**Last Updated**: 2025-01-08
**Documentation Version**: 2.0
**Maintained By**: AIWhisper Team

