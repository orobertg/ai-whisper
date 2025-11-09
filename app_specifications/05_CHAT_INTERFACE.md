# Chat Interface Specification

**Document:** 05_CHAT_INTERFACE.md  
**Version:** 1.0  
**Dependencies:** 01_THEME_SYSTEM.md, 03_STYLING_ARCHITECTURE.md

---

## Overview

The Chat Interface (`ChatPanel.tsx`) provides an AI-powered conversational interface with mind map integration, file attachments, and real-time message streaming. It features a glassmorphic design in translucent theme and adapts to wallpaper settings.

---

## Component Structure

### File: `frontend/components/ChatPanel.tsx`

### Props Interface

```typescript
type ChatPanelProps = {
  template?: Template | null;
  nodes?: Node[];
  edges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  currentMindMapId?: number;
  currentProjectTitle?: string;
  onProjectRename?: (newTitle: string) => void;
  onChatHistoryUpdate?: (history: any[]) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
};
```

### State Management

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [inputMessage, setInputMessage] = useState("");
const [isStreaming, setIsStreaming] = useState(false);
const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
const [chatWallpaper, setChatWallpaper] = useState<string | null>(null);
const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
```

**State Descriptions:**
- `messages`: Array of chat messages (user and AI)
- `inputMessage`: Current input text
- `isStreaming`: Whether AI is currently responding
- `attachedFiles`: Files attached to current message
- `chatWallpaper`: Wallpaper for chat area (separate from home wallpaper)
- `wallpaperBlur`: Blur amount for chat wallpaper
- `messagesEndRef`: Reference for auto-scrolling to latest message
- `inputRef`: Reference for input focus

### Theme Integration

```typescript
const { isLight, isTranslucent } = useTheme();

// Chat panel always uses effectiveHasWallpaper pattern
const effectiveHasWallpaper = isTranslucent ? false : !!chatWallpaper;

// Get theme styles
const inputClass = getThemeStyle('input', effectiveHasWallpaper, isLight,
