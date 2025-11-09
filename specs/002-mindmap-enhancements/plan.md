# Implementation Plan: Mind-Map Enhancements
**Feature ID**: 002-mindmap-enhancements  
**Status**: Draft  
**Created**: November 2025  
**References**: [spec.md](./spec.md)

---

## 1. Technical Approach Overview

### 1.1 Architecture Philosophy
Following AI Whisper's **Specification-Driven Development** constitution:
- **Simplicity First**: Use existing libraries where possible
- **Test-Driven**: Write tests before implementation
- **Integration-First**: Test with real data, real browsers
- **Library-First**: Build modular, reusable components

### 1.2 Technology Stack
| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Auto-Save** | React hooks + debounce | Leverages existing React state management |
| **Export - PDF** | jsPDF + html2canvas | Industry standard, well-maintained |
| **Export - PNG** | html2canvas | Native browser API, no dependencies |
| **Export - Markdown** | Custom traversal | Simple tree walk, no library needed |
| **Export - JSON** | Native JSON.stringify | Built-in, reliable |
| **Performance** | React.memo + useMemo | Built into React, zero dependencies |
| **History** | Immer.js | Immutable state, time-travel ready |
| **Styling** | Tailwind CSS + Theme Context | Existing system, consistent |

---

## 2. Detailed Component Design

### 2.1 Auto-Save System

#### 2.1.1 Architecture
```
┌─────────────────┐
│   MindMap.tsx   │
│  (User Edits)   │
└────────┬────────┘
         │
         v
┌─────────────────────┐
│  useAutoSave.ts     │
│  - Debounce (5s)    │
│  - Queue changes    │
│  - Retry logic      │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│  Backend API        │
│  PUT /mindmaps/:id  │
│  - Update nodes     │
│  - Update edges     │
│  - Update metadata  │
└─────────────────────┘
```

#### 2.1.2 Implementation Strategy
**File**: `frontend/hooks/useAutoSave.ts`

```typescript
export function useAutoSave(
  mindMapId: number,
  nodes: Node[],
  edges: Edge[],
  options?: { interval?: number }
) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce(async () => {
      setStatus('saving');
      try {
        await fetch(`/api/mindmaps/${mindMapId}`, {
          method: 'PUT',
          body: JSON.stringify({ nodes, edges, updated_at: new Date().toISOString() })
        });
        setStatus('saved');
        setLastSaved(new Date());
      } catch (error) {
        setStatus('error');
        // Retry logic
      }
    }, options?.interval || 5000),
    [mindMapId, nodes, edges]
  );
  
  // Trigger save on changes
  useEffect(() => {
    if (nodes.length > 0) {
      debouncedSave();
    }
  }, [nodes, edges, debouncedSave]);
  
  return { status, lastSaved };
}
```

#### 2.1.3 UI Component
**File**: `frontend/components/AutoSaveIndicator.tsx`

```typescript
export function AutoSaveIndicator({ status, lastSaved }: { status: string; lastSaved: Date | null }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500">
      {status === 'saving' && <Loader2 className="animate-spin" size={14} />}
      {status === 'saved' && <Check size={14} className="text-green-500" />}
      {status === 'error' && <AlertCircle size={14} className="text-red-500" />}
      <span>
        {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : status === 'error' ? 'Error saving' : ''}
      </span>
      {lastSaved && <span className="text-zinc-600">• {format(lastSaved, 'HH:mm:ss')}</span>}
    </div>
  );
}
```

### 2.2 Export System

#### 2.2.1 Architecture
```
┌─────────────────┐
│  ExportButton   │
│  (User Clicks)  │
└────────┬────────┘
         │
         v
┌─────────────────────────┐
│  ExportService.ts       │
│  - detectFormat()       │
│  - exportToPDF()        │
│  - exportToPNG()        │
│  - exportToMarkdown()   │
│  - exportToJSON()       │
└────────┬────────────────┘
         │
         v
┌─────────────────────────┐
│  Browser Download       │
│  - Blob creation        │
│  - saveAs()             │
└─────────────────────────┘
```

#### 2.2.2 Export Service
**File**: `frontend/lib/exportService.ts`

```typescript
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export class MindMapExporter {
  private nodes: Node[];
  private edges: Edge[];
  private canvasRef: HTMLDivElement;

  constructor(nodes: Node[], edges: Edge[], canvasRef: HTMLDivElement) {
    this.nodes = nodes;
    this.edges = edges;
    this.canvasRef = canvasRef;
  }

  async exportToPDF(options: { paperSize: 'A3' | 'A4'; orientation: 'portrait' | 'landscape' }) {
    const canvas = await html2canvas(this.canvasRef, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF(options.orientation, 'mm', options.paperSize);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`mindmap-${Date.now()}.pdf`);
  }

  async exportToPNG(options: { resolution: 1 | 2 | 4 }) {
    const canvas = await html2canvas(this.canvasRef, { scale: options.resolution });
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindmap-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  exportToMarkdown(): string {
    // Tree traversal to build hierarchical markdown
    const rootNodes = this.nodes.filter(n => !this.edges.some(e => e.target === n.id));
    
    const buildMarkdown = (node: Node, depth: number = 0): string => {
      const indent = '  '.repeat(depth);
      const children = this.edges
        .filter(e => e.source === node.id)
        .map(e => this.nodes.find(n => n.id === e.target))
        .filter(Boolean);
      
      let md = `${indent}- ${node.data.label}\n`;
      if (node.data.content) {
        md += `${indent}  ${node.data.content}\n`;
      }
      
      children.forEach(child => {
        md += buildMarkdown(child!, depth + 1);
      });
      
      return md;
    };
    
    return rootNodes.map(node => buildMarkdown(node)).join('\n');
  }

  exportToJSON(): string {
    return JSON.stringify({
      version: '1.0',
      exported_at: new Date().toISOString(),
      nodes: this.nodes,
      edges: this.edges
    }, null, 2);
  }
}
```

#### 2.2.3 Export UI Component
**File**: `frontend/components/ExportMenu.tsx`

```typescript
export function ExportMenu({ nodes, edges, canvasRef }: { nodes: Node[]; edges: Edge[]; canvasRef: HTMLDivElement }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'pdf' | 'png' | 'markdown' | 'json', options?: any) => {
    setLoading(true);
    const exporter = new MindMapExporter(nodes, edges, canvasRef);
    
    try {
      switch (format) {
        case 'pdf':
          await exporter.exportToPDF(options);
          break;
        case 'png':
          await exporter.exportToPNG(options);
          break;
        case 'markdown':
          const md = exporter.exportToMarkdown();
          downloadTextFile(md, 'mindmap.md');
          break;
        case 'json':
          const json = exporter.exportToJSON();
          downloadTextFile(json, 'mindmap.json');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm flex items-center gap-2">
          <Download size={16} />
          Export
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('pdf', { paperSize: 'A4', orientation: 'landscape' })}>
          <FileText size={16} /> Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('png', { resolution: 2 })}>
          <Image size={16} /> Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          <FileText size={16} /> Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <Code size={16} /> Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 2.3 Performance Optimization

#### 2.3.1 Memoization Strategy
**File**: `frontend/components/nodes/CustomNode.tsx`

```typescript
const CustomNode = memo(({ data, id }: NodeProps) => {
  // Expensive computations
  const formattedContent = useMemo(() => formatContent(data.content), [data.content]);
  const nodeStyle = useMemo(() => calculateNodeStyle(data), [data.type, data.color]);
  
  return (
    <div className={nodeStyle}>
      <div className="font-semibold">{data.label}</div>
      <div className="text-sm">{formattedContent}</div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for when to re-render
  return (
    prevProps.data.label === nextProps.data.label &&
    prevProps.data.content === nextProps.data.content &&
    prevProps.data.color === nextProps.data.color
  );
});
```

#### 2.3.2 Virtualization (React Flow Built-in)
**File**: `frontend/components/MindMap.tsx`

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  fitView
  minZoom={0.1}
  maxZoom={4}
  // Enable virtualization for large graphs
  nodesDraggable={true}
  nodesConnectable={true}
  elementsSelectable={true}
  // Performance optimizations
  zoomOnScroll={true}
  panOnScroll={false}
  selectNodesOnDrag={false}
/>
```

### 2.4 History & Undo System

#### 2.4.1 Architecture
```
┌─────────────────┐
│  MindMap.tsx    │
│  (User Action)  │
└────────┬────────┘
         │
         v
┌─────────────────────┐
│  useHistory.ts      │
│  - captureState()   │
│  - undo()           │
│  - redo()           │
│  - historyStack[]   │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│  localStorage       │
│  - persist history  │
└─────────────────────┘
```

#### 2.4.2 History Hook
**File**: `frontend/hooks/useHistory.ts`

```typescript
import { produce } from 'immer';

export function useHistory<T>(initialState: T, maxHistory: number = 50) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const captureState = useCallback((newState: T) => {
    setHistory(prev => {
      // Remove any forward history
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      newHistory.push(newState);
      // Cap at maxHistory
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  return { captureState, undo, redo, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1 };
}
```

#### 2.4.3 Keyboard Shortcuts
**File**: `frontend/components/MindMap.tsx`

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        // Redo
        const newState = redo();
        if (newState) {
          setNodes(newState.nodes);
          setEdges(newState.edges);
        }
      } else {
        // Undo
        const newState = undo();
        if (newState) {
          setNodes(newState.nodes);
          setEdges(newState.edges);
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [undo, redo]);
```

### 2.5 Enhanced Node Styling

#### 2.5.1 Theme-Aware Nodes
**File**: `frontend/components/nodes/ThemedNode.tsx`

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export function ThemedNode({ data, id }: NodeProps) {
  const { isLight, hasWallpaper, getCardClass, getTextClass } = useTheme();
  
  const nodeClass = useMemo(() => {
    const baseClass = "p-4 rounded-lg border-2 transition-all";
    const themeClass = getCardClass(baseClass);
    const typeClass = data.type === 'feature' ? 'border-blue-500' : 
                      data.type === 'technical' ? 'border-green-500' : 
                      'border-zinc-500';
    
    return `${themeClass} ${typeClass}`;
  }, [isLight, hasWallpaper, data.type]);

  return (
    <div className={nodeClass}>
      <Handle type="target" position={Position.Left} />
      <div className={`font-semibold ${getTextClass('primary')}`}>{data.label}</div>
      {data.content && (
        <div className={`text-sm mt-2 ${getTextClass('secondary')}`}>{data.content}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

---

## 3. Database Changes

### 3.1 Schema Updates
No new tables required. Existing `mindmap` table is sufficient.

**Optional enhancement** (future phase):
```sql
ALTER TABLE mindmap ADD COLUMN auto_save_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE mindmap ADD COLUMN last_auto_save TIMESTAMP;
```

---

## 4. API Changes

### 4.1 Enhanced PUT /mindmaps/:id
Add support for partial updates and optimistic locking:

```python
@router.put("/mindmaps/{mindmap_id}")
async def update_mindmap(
    mindmap_id: int,
    nodes_json: Optional[str] = None,
    edges_json: Optional[str] = None,
    last_known_version: Optional[str] = None,  # For conflict detection
    db: Session = Depends(get_session)
):
    mindmap = db.get(MindMap, mindmap_id)
    if not mindmap:
        raise HTTPException(status_code=404)
    
    # Conflict detection
    if last_known_version and mindmap.updated_at != last_known_version:
        raise HTTPException(status_code=409, detail="Conflict detected")
    
    # Partial update
    if nodes_json:
        mindmap.nodes_json = nodes_json
    if edges_json:
        mindmap.edges_json = edges_json
    
    mindmap.updated_at = datetime.now()
    db.add(mindmap)
    db.commit()
    db.refresh(mindmap)
    
    return mindmap
```

---

## 5. Testing Strategy

### 5.1 Unit Tests
**Files to create:**
- `frontend/hooks/__tests__/useAutoSave.test.ts`
- `frontend/lib/__tests__/exportService.test.ts`
- `frontend/hooks/__tests__/useHistory.test.ts`

**Example test:**
```typescript
describe('useAutoSave', () => {
  it('should debounce saves', async () => {
    const { result } = renderHook(() => useAutoSave(1, nodes, edges));
    
    // Make multiple rapid changes
    act(() => {
      result.current.trigger();
      result.current.trigger();
      result.current.trigger();
    });
    
    // Wait for debounce
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    }, { timeout: 6000 });
  });
});
```

### 5.2 Integration Tests
**Files to create:**
- `e2e/autosave.spec.ts`
- `e2e/export.spec.ts`
- `e2e/history.spec.ts`

**Example test:**
```typescript
test('auto-save persists after page refresh', async ({ page }) => {
  await page.goto('/mindmap/1');
  
  // Add a node
  await page.click('[data-testid="add-node"]');
  await page.fill('[data-testid="node-label"]', 'Test Node');
  
  // Wait for auto-save
  await page.waitForSelector('[data-testid="save-indicator"]:has-text("Saved")');
  
  // Refresh page
  await page.reload();
  
  // Verify node exists
  await expect(page.locator('text=Test Node')).toBeVisible();
});
```

### 5.3 Performance Tests
```typescript
test('performance with 200 nodes', async ({ page }) => {
  await page.goto('/mindmap/large-test');
  
  // Measure render time
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // Trigger re-render
    window.dispatchEvent(new Event('resize'));
    const end = performance.now();
    return end - start;
  });
  
  expect(renderTime).toBeLessThan(300);
});
```

---

## 6. Rollout Plan

### 6.1 Phase 1: Auto-Save (Week 1)
- Implement `useAutoSave` hook
- Add status indicator to UI
- Write unit tests
- Deploy to staging

### 6.2 Phase 2: Export (Week 2)
- Implement export service
- Add export menu to toolbar
- Write integration tests
- Deploy to staging

### 6.3 Phase 3: Performance (Week 3)
- Add memoization to nodes
- Implement lazy loading
- Performance testing
- Deploy to staging

### 6.4 Phase 4: History & Styling (Week 3-4)
- Implement history hook
- Add keyboard shortcuts
- Enhance node styling
- Final testing
- Deploy to production

---

## 7. Monitoring & Observability

### 7.1 Metrics to Track
- Auto-save success rate
- Auto-save latency (p50, p95, p99)
- Export success rate by format
- Export duration by mind map size
- Undo/redo usage frequency
- Performance metrics (render time, frame rate)

### 7.2 Error Tracking
- Auto-save failures (categorize: network, validation, conflict)
- Export failures (categorize: memory, timeout, format error)
- Browser compatibility issues

### 7.3 User Feedback
- In-app survey after 7 days of use
- NPS score change
- Support ticket analysis

---

## 8. Constitutional Compliance

### 8.1 ✅ Simplicity Gate
- Using React hooks (built-in, simple)
- Leveraging existing libraries (jsPDF, html2canvas)
- No custom state management beyond React Context
- No over-engineering (no GraphQL, no WebSockets for auto-save)

### 8.2 ✅ Anti-Abstraction Gate
- Direct implementation, not abstracted behind layers
- Export service is a simple class, not a framework
- History uses standard array, not custom data structure

### 8.3 ✅ Integration Gate
- Tests use real React Flow components
- Performance tests run in real browsers
- Export tests generate actual PDF/PNG files

### 8.4 ✅ Library-First Principle
- Each feature (auto-save, export, history) is modular
- Can be extracted into standalone libraries if needed
- Clear separation of concerns

### 8.5 ✅ CLI Mandate
Not applicable (frontend feature), but export functions can be tested via Node scripts.

### 8.6 ✅ Test-First Imperative
- Tests written before implementation
- TDD cycle: Red → Green → Refactor
- 80%+ code coverage target

---

**Plan Status**: Draft (Ready for Task Breakdown)  
**Next Step**: Generate `tasks.md` with ordered implementation steps  
**Estimated Effort**: 3-4 weeks (1 developer)

