# Specification: Mind-Map Enhancements
**Feature ID**: 002-mindmap-enhancements  
**Status**: Draft  
**Created**: November 2025  
**Owner**: AI Whisper Development Team  

---

## 1. Purpose & Context

### 1.1 Problem Statement
Users currently experience friction in their mind-mapping workflow:
- **No Auto-Save**: Risk of losing work if browser crashes or tab closes
- **Limited Export Options**: Cannot share or backup mind maps in standard formats
- **Performance Issues**: Large mind maps (100+ nodes) become sluggish
- **No Real-time Updates**: Node content requires manual refresh to see AI changes
- **Inconsistent Node Styling**: Node themes don't adapt to custom wallpapers
- **No History/Undo**: Cannot recover from accidental deletions or unwanted changes

### 1.2 User Impact
**Priority**: High  
**Users Affected**: All mind-map users  
**Business Value**: Reduces friction, improves retention, enables collaboration

### 1.3 Success Criteria
| Metric | Target | Measurement |
|--------|--------|-------------|
| Auto-save frequency | Every 3-5 seconds | Technical telemetry |
| Export success rate | >95% | User analytics |
| Large mind map performance | <200ms render time | Performance monitoring |
| User satisfaction | +20% in surveys | Post-feature survey |
| Data loss incidents | 0 | Error tracking |

---

## 2. User Stories

### 2.1 Auto-Save
**As a** mind-map user  
**I want** my work to save automatically  
**So that** I never lose progress due to browser crashes or accidental closures

**Acceptance Criteria:**
- Changes save within 5 seconds of last edit
- Visual indicator shows "Saving..." and "Saved" states
- Works offline and syncs when connection restored
- No performance degradation during auto-save

### 2.2 Export Functionality
**As a** project manager  
**I want** to export my mind map to PDF, PNG, Markdown, and JSON  
**So that** I can share with stakeholders and backup my work

**Acceptance Criteria:**
- Export to PDF preserves layout and styling
- PNG export at selectable resolutions (1x, 2x, 4x)
- Markdown export maintains hierarchical structure
- JSON export includes all nodes, edges, and metadata
- Export options accessible via toolbar button

### 2.3 Performance Optimization
**As a** power user with large projects  
**I want** smooth performance with 200+ nodes  
**So that** I can work efficiently without lag

**Acceptance Criteria:**
- Mind maps with <100 nodes render instantly (<100ms)
- Mind maps with 100-500 nodes render smoothly (<300ms)
- Mind maps with 500+ nodes render acceptably (<1000ms)
- Zoom, pan, and node dragging remain smooth
- Auto-save doesn't cause UI freezes

### 2.4 Real-Time Node Updates
**As a** user collaborating with AI  
**I want** nodes to update automatically when AI modifies them  
**So that** I don't have to manually refresh to see changes

**Acceptance Criteria:**
- AI-modified nodes update within 500ms
- Smooth animation when content changes
- No flickering or jarring transitions
- User cursor position preserved during updates

### 2.5 Enhanced Node Styling
**As a** user who uses custom wallpapers  
**I want** node themes that adapt to my background  
**So that** text remains readable and aesthetically pleasing

**Acceptance Criteria:**
- Nodes have semi-transparent backgrounds when wallpaper active
- Text color contrasts with node background
- Node borders visible against wallpaper
- Theme consistency across all node types
- Smooth transitions when changing themes/wallpapers

### 2.6 History & Undo System
**As a** user making complex edits  
**I want** to undo/redo changes  
**So that** I can experiment freely without fear of breaking my mind map

**Acceptance Criteria:**
- Undo last 50 actions
- Redo reverted actions
- Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- History persists across sessions
- Visual feedback for undo/redo actions

---

## 3. Functional Requirements

### 3.1 Auto-Save System
**MUST HAVE:**
- Debounced save mechanism (wait 3-5s after last edit)
- Visual status indicator ("Saving...", "Saved", "Error")
- Queue system for concurrent edits
- Conflict resolution for simultaneous AI + user edits
- Retry logic for failed saves (3 attempts, exponential backoff)

**SHOULD HAVE:**
- Offline storage (IndexedDB)
- Background sync when connection restored
- Save history (last 10 auto-saves)

**WON'T HAVE (this phase):**
- Real-time collaboration between multiple users
- Version branching

### 3.2 Export System
**MUST HAVE:**
- Export to PDF (preserves layout, A3/A4 paper sizes)
- Export to PNG (1x, 2x, 4x resolution options)
- Export to Markdown (hierarchical structure)
- Export to JSON (full data model)
- Progress indicator for large exports
- Error handling and user feedback

**SHOULD HAVE:**
- Export filename customization
- Batch export multiple formats
- Export to clipboard (image)

**WON'T HAVE (this phase):**
- Export to PowerPoint/Keynote
- Interactive HTML export
- Export animations

### 3.3 Performance Optimization
**MUST HAVE:**
- React Flow virtualization for large graphs
- Memoization of node components
- Debounced re-renders during drag operations
- Lazy loading of node content (truncate long text)
- Web Worker for heavy computations

**SHOULD HAVE:**
- Canvas rendering mode for 1000+ nodes
- Progressive loading (render viewport first)
- Memory leak prevention (cleanup observers)

**WON'T HAVE (this phase):**
- Server-side rendering
- Distributed computation

### 3.4 Real-Time Updates
**MUST HAVE:**
- React state synchronization with AI responses
- Smooth CSS transitions for content changes
- Optimistic UI updates (show immediately, confirm async)
- Error recovery (rollback on failure)

**SHOULD HAVE:**
- Cursor position preservation
- Scroll position preservation
- Selection preservation

**WON'T HAVE (this phase):**
- Operational Transform (OT) for collaboration
- CRDT-based sync

### 3.5 Enhanced Styling
**MUST HAVE:**
- Theme-aware node backgrounds
- Wallpaper-adaptive opacity
- High-contrast text colors
- Consistent borders and shadows
- Smooth theme transitions

**SHOULD HAVE:**
- Custom node color picker
- Node shape variations
- Icon library for nodes

**WON'T HAVE (this phase):**
- Custom fonts per node
- Animated nodes
- 3D effects

### 3.6 History System
**MUST HAVE:**
- Action history stack (50 actions)
- Undo/redo functions
- Keyboard shortcuts
- History persistence (localStorage)

**SHOULD HAVE:**
- Named checkpoints ("Save point: Feature complete")
- History timeline view
- Selective undo (specific actions)

**WON'T HAVE (this phase):**
- Server-side history
- Diff visualization
- Time-travel debugging

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Auto-save: <100ms processing time
- Export: <5s for 100-node mind map
- Render: <300ms for 200-node mind map
- Undo/Redo: <50ms response time

### 4.2 Reliability
- Auto-save: 99.9% success rate
- Export: 95% success rate (failure = graceful degradation)
- Data integrity: No data loss under normal conditions
- Offline support: Full functionality without network

### 4.3 Usability
- Auto-save indicator: Always visible
- Export: <3 clicks from any screen
- Undo/Redo: Standard keyboard shortcuts
- Error messages: Clear, actionable

### 4.4 Compatibility
- Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Screen sizes: Desktop (1280x720+), Tablet (768x1024+)
- File formats: PDF 1.7, PNG, JSON, Markdown

### 4.5 Security
- Exported data: No sensitive metadata in files
- Local storage: Encrypted if browser supports it
- Error logs: No PII in logs

---

## 5. Out of Scope

### 5.1 Explicitly Excluded (This Phase)
- Multi-user real-time collaboration
- Server-side conflict resolution
- Video/audio attachment to nodes
- AI voice narration of mind maps
- Mobile app (native iOS/Android)
- Integration with external tools (Notion, Trello, etc.)
- Presentation mode (slideshow from mind map)
- Advanced graph analysis (centrality, clustering)

### 5.2 Future Phases
These features are deferred to later iterations:
- **Phase 3**: Real-time collaboration
- **Phase 4**: Advanced AI analysis
- **Phase 5**: Mobile applications
- **Phase 6**: Third-party integrations

---

## 6. Constraints & Dependencies

### 6.1 Technical Constraints
- React Flow library (v11.x) - current version
- FastAPI backend (Python 3.9+)
- SQLite database (local development)
- Browser local storage limits (5-10MB)

### 6.2 Dependencies
- **External Libraries:**
  - `html2canvas` for PNG export
  - `jsPDF` for PDF generation
  - `remark` for Markdown export
- **Internal Systems:**
  - Existing theme system must be compatible
  - Auto-save must not conflict with chat history saves
  - Export must work with custom wallpapers

### 6.3 Assumptions
- Users have stable internet connection (auto-save sync)
- Browsers support modern JavaScript (ES2020+)
- Users understand standard undo/redo patterns
- Export formats meet common user needs

---

## 7. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Auto-save conflicts with user edits | High | Medium | Implement locking mechanism, queue edits |
| Large exports crash browser | High | Low | Implement chunked rendering, progress bars |
| Performance degradation with virtualization | Medium | Medium | Extensive testing, fallback to canvas mode |
| History system memory leak | High | Low | Cap history size, periodic cleanup |
| Export quality issues (PDF/PNG) | Medium | Medium | Manual QA, user testing |

---

## 8. Acceptance Tests

### 8.1 Auto-Save
```gherkin
Given I am editing a mind map
When I add a new node with text "Test Node"
And I wait 5 seconds
Then I should see a "Saved" indicator
And the node should persist after page refresh
```

### 8.2 Export to PDF
```gherkin
Given I have a mind map with 50 nodes
When I click "Export" and select "PDF"
And I choose "A4" paper size
Then a PDF file should download within 5 seconds
And the PDF should contain all nodes with correct layout
```

### 8.3 Performance with Large Graph
```gherkin
Given I have a mind map with 200 nodes
When I pan and zoom the canvas
Then the frame rate should remain above 30fps
And there should be no visible lag
```

### 8.4 Undo/Redo
```gherkin
Given I have made 5 changes to a mind map
When I press Ctrl+Z twice
Then the last 2 changes should be reverted
And when I press Ctrl+Shift+Z once
Then the most recent reverted change should be restored
```

---

## 9. Dependencies & Validation

### 9.1 Clarifications Needed
- [ ] **NEEDS CLARIFICATION**: Preferred auto-save interval (3s, 5s, 10s)?
- [ ] **NEEDS CLARIFICATION**: Maximum history size (50, 100, 200 actions)?
- [ ] **NEEDS CLARIFICATION**: Should export include chat history?

### 9.2 Approvals Required
- [ ] Product Owner approval of success metrics
- [ ] UX Designer approval of UI/UX changes
- [ ] Engineering approval of technical approach
- [ ] QA approval of test plan

---

## 10. Related Documents
- [Implementation Plan](./plan.md) - Technical approach
- [Task Breakdown](./tasks.md) - Ordered implementation steps
- [Theme System Architecture](../../docs/THEME_SYSTEM.md) - For node styling
- [Database Schema](../../docs/DATABASE_MIGRATIONS.md) - For auto-save persistence

---

**Document Status**: Draft (Pending Clarifications)  
**Next Step**: Resolve clarifications, then proceed to `plan.md`  
**Constitutional Compliance**: ✅ Simplicity, ✅ Test-First, ✅ Integration-First

