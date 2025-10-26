# Selective Suggestions Feature - À La Carte Selection

## Overview
Users can now selectively choose which AI suggestions to apply, rather than accepting or rejecting all suggestions as a batch. This provides granular control over mind map modifications.

## Date
October 25, 2025

---

## Feature Description

### The Problem
Previously, when the AI provided multiple suggestions (e.g., add 5 nodes, connect 3 edges), users had to:
- Accept ALL suggestions, or
- Reject ALL suggestions

This all-or-nothing approach meant users couldn't cherry-pick the suggestions they wanted.

### The Solution
**Individual Suggestion Selection** - Users can now:
✅ Check/uncheck specific suggestions  
✅ See selection count in real-time  
✅ Apply only selected suggestions  
✅ Select All / Deselect All with one click  
✅ Visual feedback for selected vs. unselected items

---

## User Interface

### Visual Elements

#### 1. **Checkboxes**
- Each suggestion has a checkbox on the left side
- Checked = Will be applied
- Unchecked = Will be skipped
- All suggestions are selected by default

#### 2. **Select All / Deselect All Button**
- Appears when there are 2+ suggestions
- Toggles all checkboxes at once
- Shows current state based on selection count

#### 3. **Selection Counter**
```
(3 of 5 selected)
```
- Real-time count of selected suggestions
- Helps users track what will be applied

#### 4. **Visual States**
- **Selected**: Full opacity, solid border
- **Unselected**: 50% opacity, lighter border
- **Hover**: Standard hover effects
- **Disabled**: Grayed out when no selections

#### 5. **Smart Apply Button**
- Shows count when partially selected: **"Apply 3 Changes"**
- Shows generic text when all selected: **"Apply Changes"**
- Singular vs. plural: **"Apply 1 Change"** vs. **"Apply 2 Changes"**
- Disabled when nothing selected (gray, unclickable)

---

## User Workflow

### Example Scenario

**AI Provides 5 Suggestions:**
1. ✅ Update node: Media File Sorting  
2. ✅ Connect nodes: User Authentication → Bulk Actions  
3. ❌ Connect nodes: Media File Search → User Authentication  
4. ✅ Connect nodes: Media Item → File Sorting Algorithm  
5. ❌ Connect nodes: Sort Button → File Sorting Algorithm

**User Actions:**
1. Review all 5 suggestions
2. Uncheck suggestions #3 and #5 (not relevant)
3. Click "Apply 3 Changes"
4. Only suggestions #1, #2, and #4 are applied
5. Suggestions #3 and #5 are discarded

---

## Technical Implementation

### State Management

#### Selection State
```typescript
const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(
  new Set(suggestions.map((_, idx) => idx)) // All selected by default
);
```

### Key Functions

#### Toggle Individual Suggestion
```typescript
const toggleSuggestion = (idx: number) => {
  const newSelected = new Set(selectedSuggestions);
  if (newSelected.has(idx)) {
    newSelected.delete(idx);
  } else {
    newSelected.add(idx);
  }
  setSelectedSuggestions(newSelected);
};
```

#### Toggle All Suggestions
```typescript
const toggleAll = () => {
  if (selectedSuggestions.size === suggestions.length) {
    setSelectedSuggestions(new Set()); // Deselect all
  } else {
    setSelectedSuggestions(new Set(suggestions.map((_, idx) => idx))); // Select all
  }
};
```

#### Get Selected Suggestions
```typescript
const getSelectedSuggestions = () => {
  return suggestions.filter((_, idx) => selectedSuggestions.has(idx));
};
```

### Apply Only Selected
```typescript
<button
  onClick={() => onApprove(getSelectedSuggestions())}
  disabled={selectedSuggestions.size === 0}
>
  Apply {selectedSuggestions.size > 0 && selectedSuggestions.size !== suggestions.length 
    ? `${selectedSuggestions.size} ` 
    : ''}Change{selectedSuggestions.size !== 1 ? 's' : ''}
</button>
```

---

## UI/UX Design Decisions

### 1. **Default State: All Selected**
**Rationale**: The AI has already determined these suggestions are valuable. Users who trust the AI can click "Apply Changes" immediately. Those who want control can deselect items.

### 2. **Opacity for Unselected Items**
**Rationale**: Clear visual distinction without hiding content. Users can still read unselected suggestions.

### 3. **Real-Time Counter**
**Rationale**: Immediate feedback helps users understand what will happen when they click Apply.

### 4. **Smart Button Text**
**Rationale**: 
- "Apply Changes" (all selected) = Quick action
- "Apply 3 Changes" (partial) = Transparency about what's happening
- "Apply Change" vs. "Apply Changes" = Grammatically correct

### 5. **Disabled State**
**Rationale**: Prevents accidental empty applications. Users must select at least one suggestion.

---

## Accessibility

### Keyboard Navigation
- ✅ Checkboxes are keyboard accessible (Tab + Space)
- ✅ Focus indicators on all interactive elements
- ✅ Screen reader support for checkbox states

### Visual Accessibility
- ✅ High contrast between selected/unselected
- ✅ Opacity change provides clear distinction
- ✅ Text labels for all actions
- ✅ Icon + text combination for buttons

### Cognitive Load
- ✅ Simple mental model: "Check = Apply"
- ✅ Visual count eliminates uncertainty
- ✅ One-click "Select All" for power users

---

## Edge Cases Handled

### 1. **Single Suggestion**
- Checkbox still appears (consistency)
- No "Select All" button (unnecessary)
- Button text: "Apply Change" (singular)

### 2. **All Deselected**
- Button is disabled
- Visual feedback (gray, cursor-not-allowed)
- Prevents null application

### 3. **Partial Selection**
- Counter shows "X of Y selected"
- Button shows count: "Apply X Changes"
- Clear communication

### 4. **Selection During Auto-Apply**
- When `autoApply` is true, selection UI is hidden
- Shows simple "Applying suggestions..." message
- Avoids confusion during animation

---

## Node Names vs. GUIDs Issue

### The Original Problem
Connection suggestions displayed technical node IDs:
```
Connect nodes: node-1761402233453-wbqkapvws → node-1761401987442-8j7ojfbz1
```

### The Fix
Updated `formatSuggestion()` to look up node labels:
```typescript
case "add_edge":
  const sourceLabel = suggestion.source ? getNodeLabel(suggestion.source) : "?";
  const targetLabel = suggestion.target ? getNodeLabel(suggestion.target) : "?";
  return `Connect nodes: ${sourceLabel} → ${targetLabel}`;
```

### Result
```
Connect nodes: User Authentication for Media Management → Bulk Actions on Media Files
```

### Debug Logging
Added console logging to track node lookups:
```typescript
console.log(`[SuggestionCard] Looking up node "${nodeId}":`, node?.data?.label || '(not found)');
```

This helps diagnose issues where nodes might not be passed correctly or labels are missing.

---

## Files Modified

### Primary Changes
- **`frontend/components/SuggestionCard.tsx`**
  - Added selection state management
  - Added checkbox UI
  - Added Select All / Deselect All toggle
  - Enhanced button with smart text
  - Fixed node label lookup
  - Added debug logging

### No Backend Changes Required
The backend already sends all suggestions. The frontend now filters which ones to apply based on user selection.

---

## Usage Examples

### Example 1: Accept All (Original Behavior)
```
User: [Sees 5 suggestions, all checked]
User: [Clicks "Apply Changes"]
Result: All 5 applied
```

### Example 2: Cherry-Pick Specific Suggestions
```
User: [Sees 5 suggestions, all checked]
User: [Unchecks suggestions #2 and #4]
User: [Clicks "Apply 3 Changes"]
Result: Only #1, #3, #5 applied
```

### Example 3: Select/Deselect All
```
User: [Sees 5 suggestions, all checked]
User: [Clicks "Deselect All"]
User: [Reads all suggestions carefully]
User: [Checks suggestions #1, #3]
User: [Clicks "Apply 2 Changes"]
Result: Only #1 and #3 applied
```

### Example 4: Reject All
```
User: [Sees 5 suggestions, all checked]
User: [Clicks "Deselect All"]
User: [Clicks X button to reject]
Result: AI acknowledges rejection
```

---

## Benefits

### For Users
1. **More Control**: Choose exactly what to apply
2. **Confidence**: Review and select at your own pace
3. **Efficiency**: Apply good suggestions, skip questionable ones
4. **Learning**: Understand AI suggestions without committing to all
5. **Flexibility**: Partial acceptance is now possible

### For AI Learning
1. **Implicit Feedback**: Selection patterns indicate what users find valuable
2. **Refinement Data**: Can track which suggestion types are most accepted
3. **Context Understanding**: Patterns reveal what works for different project types

---

## Future Enhancements

### Potential Additions
1. **Selection Memory**: Remember user preferences across sessions
2. **Smart Defaults**: Auto-select based on user patterns
3. **Batch Operations**: "Apply similar suggestions across all projects"
4. **Suggestion Ratings**: Thumbs up/down for individual suggestions
5. **Quick Actions**: Right-click menu for instant accept/reject
6. **Undo Stack**: Undo individual applied suggestions

### Analytics Opportunities
1. Track acceptance rates by suggestion type
2. Identify which rationales lead to acceptance
3. Measure user confidence (select all vs. partial)
4. A/B test suggestion presentation

---

## Testing Checklist

- ✅ Single suggestion displays correctly
- ✅ Multiple suggestions all selected by default
- ✅ Checkbox toggle works for each item
- ✅ Select All / Deselect All functions correctly
- ✅ Counter updates in real-time
- ✅ Button text changes based on selection
- ✅ Button disabled when nothing selected
- ✅ Only selected suggestions are applied
- ✅ Unselected suggestions are discarded
- ✅ Visual states (opacity) display correctly
- ✅ Keyboard navigation works
- ✅ Screen reader announces states
- ✅ Node names (not GUIDs) appear in suggestions
- ✅ Debug logging tracks node lookups

---

## Conclusion

The selective suggestions feature transforms the AI assistant from an all-or-nothing tool into a flexible collaborator. Users can now work with the AI more granularly, building confidence through controlled experimentation while maintaining workflow efficiency.

This feature respects user agency while preserving the power of AI automation—the best of both worlds.

