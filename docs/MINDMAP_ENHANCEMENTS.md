# Mind-Map Enhancements

## Overview
This document describes the enhanced mind-mapping capabilities that allow users to manually edit, create, and manage nodes and connections, with full AI awareness of all changes.

---

## ✅ Implemented Features

### 1. **Editable Node Labels (Double-Click to Rename)**

All node types now support inline editing:
- **Double-click** any node label to edit it
- Type the new name
- Press **Enter** to save or **Escape** to cancel
- Hover effect shows nodes are editable
- Changes are immediately saved and propagated to parent component

**Supported Node Types:**
- ◉ User Story Nodes (yellow)
- ◆ Feature Nodes (blue)
- ⚙ Technical Nodes (green)
- ▣ Data Model Nodes (purple)

**User Experience:**
- Instant feedback with hover highlighting
- Input field styled to match node theme
- Automatic focus and text selection on edit
- Empty names are reverted to original

### 2. **Manual Node Creation Toolbar**

A floating action button (FAB) in the bottom-right corner allows users to add nodes manually:

**Features:**
- Click the **+** button to open node type menu
- Select from 4 node types: User Story, Feature, Technical, Data Model
- Nodes are positioned using the same logical left-to-right layout as AI suggestions
- New nodes auto-fit into view with smooth animation
- Menu closes automatically after selection

**Node Positioning:**
- User Stories: x=100 (far left)
- Features: x=400 (middle-left)
- Technical: x=700 (middle-right)
- Data Models: x=1000 (far right)
- Vertical stacking for nodes of the same type

### 3. **Manual Connections**

Users can now create connections between nodes manually:

**How to Connect:**
1. Hover over a node to see connection handles
2. Drag from the **right handle** (source) of one node
3. Drop onto the **left handle** (target) of another node
4. Connection is created with smooth step animation

**Connection Features:**
- Visual feedback during dragging
- Snap-to-handle precision
- Smooth step edge style
- Consistent stroke width and color
- Connections flow left-to-right naturally

### 4. **Delete Functionality (Keyboard Shortcut)**

**Delete Key** now removes selected nodes and edges:
- Select a node or edge by clicking it
- Press **Delete** or **Backspace**
- Selected element is removed
- Changes are automatically saved

**Visual Feedback:**
- Selected nodes have a border highlight
- Selected edges appear with increased opacity
- Multi-select supported (Ctrl+Click or Shift+Click)

### 5. **Drag and Reposition**

All nodes can be freely dragged and repositioned:
- Click and hold any node
- Drag to desired location
- Release to drop
- New position is automatically saved
- Mini-map updates in real-time

---

## AI Awareness of Manual Changes

### How AI Tracks Changes

All manual changes are automatically synchronized with the AI:

1. **Automatic Saving**
   - Every node/edge change triggers `onNodesChange` or `onEdgesChange`
   - Changes are saved to the database
   - State is synchronized across the application

2. **AI Context Inclusion**
   - When user sends a chat message, the AI receives full current state:
     - All nodes (id, type, label, position, data)
     - All edges (source, target, label)
     - Template information
     - Progress metrics

3. **AI Understanding**
   - AI can see renamed nodes and understand new labels
   - AI recognizes manually added nodes and incorporates them into suggestions
   - AI respects user-created connections when suggesting new ones
   - AI can reference manual changes in its responses

### Example AI Interaction

**User Action:** Manually adds a "Payment Gateway" technical node and connects it to "Checkout" feature

**AI Sees:**
```json
{
  "nodes": [
    {"id": "...", "type": "technical", "label": "Payment Gateway"},
    {"id": "...", "type": "feature", "label": "Checkout"}
  ],
  "edges": [
    {"source": "checkout-id", "target": "payment-id"}
  ]
}
```

**AI Response:** "I see you've added a Payment Gateway and connected it to Checkout. Would you like me to suggest additional components like Transaction Logging or Payment Validation?"

---

## User Interaction Patterns

### Quick Actions

| Action | Method | Result |
|--------|--------|--------|
| **Rename Node** | Double-click label | Inline editor appears |
| **Add Node** | Click **+** FAB → Select type | New node created |
| **Connect Nodes** | Drag from source handle → drop on target | Edge created |
| **Delete Node** | Select node → Press **Delete** | Node removed |
| **Delete Edge** | Select edge → Press **Delete** | Edge removed |
| **Move Node** | Click and drag | Node repositioned |
| **Zoom** | Mouse wheel or pinch gesture | Canvas zooms in/out |
| **Pan** | Click and drag canvas | View pans |

### Keyboard Shortcuts

- **Delete/Backspace**: Delete selected node or edge
- **Enter**: Confirm node label edit
- **Escape**: Cancel node label edit
- **Ctrl+Z**: Undo last change (ReactFlow built-in)
- **Mouse wheel**: Zoom in/out

### Node Handle Positions

All nodes have consistent handle positions:
- **Left handle** (target): Receives incoming connections
- **Right handle** (source): Creates outgoing connections

This enforces the left-to-right flow: User Stories → Features → Technical → Data Models

---

## Technical Implementation

### Component Architecture

```
MindMap.tsx (Main container)
├── ReactFlow (Mind-map engine)
│   ├── FeatureNode (editable)
│   ├── TechnicalNode (editable)
│   ├── UserStoryNode (editable)
│   ├── DataModelNode (editable)
│   ├── NotesNode
│   ├── Controls (zoom, fit view)
│   ├── MiniMap (overview)
│   └── Background (dots)
└── MindMapToolbar (FAB for adding nodes)
```

### State Management

**Local State (ReactFlow):**
- `nodes` - Array of all nodes
- `edges` - Array of all connections
- Managed by `useNodesState` and `useEdgesState` hooks

**Parent State Sync:**
- `onNodesChange` callback - Notifies parent of node changes
- `onEdgesChange` callback - Notifies parent of edge changes
- Changes propagate to database and AI context

### Node Edit Implementation

Each node type uses a consistent pattern:
1. `useState` for edit mode and label value
2. `useRef` for input element
3. `useReactFlow` hook for updating nodes
4. Event handlers: `onDoubleClick`, `onBlur`, `onKeyDown`
5. Conditional rendering: input vs. display mode

**Example (FeatureNode):**
```typescript
const [isEditing, setIsEditing] = useState(false);
const [label, setLabel] = useState(data.label);
const { setNodes } = useReactFlow();

const handleBlur = () => {
  setIsEditing(false);
  if (label.trim() && label !== data.label) {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: label.trim() } }
          : node
      )
    );
  }
};
```

---

## Future Enhancements (Not Yet Implemented)

### Context Menu
- Right-click nodes for more options:
  - Edit description
  - Duplicate node
  - Change node type
  - Delete node
  - Add note

### Edge Labels
- Editable labels on connections
- Describe relationship type
- AI can see and reference edge labels

### Undo/Redo
- Full history tracking
- Ctrl+Z / Ctrl+Y shortcuts
- Visual undo history panel

### Node Templates
- Save frequently used node configurations
- Quick insert from template library
- Share templates with team

### Collaborative Editing
- Real-time multi-user editing
- Cursor positions visible
- Change attribution

---

## Files Modified

### Node Components (All made editable)
1. `frontend/components/nodes/FeatureNode.tsx`
2. `frontend/components/nodes/TechnicalNode.tsx`
3. `frontend/components/nodes/UserStoryNode.tsx`
4. `frontend/components/nodes/DataModelNode.tsx`

### New Components
5. `frontend/components/MindMapToolbar.tsx` (FAB for adding nodes)

### Updated Components
6. `frontend/components/MindMap.tsx` (integrated toolbar, enabled delete key)

### Backend (Already configured)
7. `backend/app/routes/suggestions.py` (AI receives full node/edge context)

---

## Testing Checklist

- [x] Double-click node labels to edit
- [x] Edit node names with Enter/Escape
- [x] Add nodes using FAB (+) button
- [x] Manually connect nodes by dragging handles
- [x] Delete nodes with Delete key
- [x] Delete edges with Delete key
- [x] Drag nodes to reposition
- [x] Zoom and pan canvas
- [x] Node changes save automatically
- [x] AI receives manual changes in context
- [x] New nodes use logical positioning (left-to-right)
- [ ] Context menu (not implemented)
- [ ] Edge labels (not implemented)

---

## Related Documentation
- `docs/NODE_POSITIONING_AND_FIXES.md` - Node positioning logic
- `docs/UI_UX_NAVIGATION.md` - Overall navigation patterns
- `backend/app/routes/suggestions.py` - AI suggestion system

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: Implemented and ready for testing

