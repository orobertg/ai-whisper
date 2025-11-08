"use client";
import { useState, useRef, useEffect } from "react";
import { Node, Edge } from "reactflow";
import { Template } from "@/lib/templates";
import { ProgressMetrics } from "@/lib/progress";
import SuggestionCard from "./SuggestionCard";
import ThinkingLogo from "./ThinkingLogo";
import CustomSelect from "./CustomSelect";
import { getModelsWithStatus, getProviderFromModel } from "@/lib/providerUtils";
import {
  Copy01Icon,
  RepeatIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  AiChat01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  AiNetworkIcon,
  Menu01Icon,
  Home01Icon,
  HierarchyIcon,
  Settings02Icon,
  Download01Icon,
  CheckmarkCircle02Icon
} from "@hugeicons/react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
  id?: string;
  suggestions?: any[];
  impact?: "minor" | "moderate" | "major";
  needsApproval?: boolean;
};

type Suggestion = {
  type: "add_node" | "update_node" | "add_edge" | "rename_project";
  nodeType?: string;
  label?: string;
  description?: string;
  category?: string;
  todos?: Array<{ text: string; completed: boolean }>;  // For todo nodes
  nodeId?: string;
  updates?: Record<string, any>;
  source?: string;
  target?: string;
  newTitle?: string;  // For rename_project
  rationale: string;
};

type ChatPanelProps = {
  nodes: Node[];
  edges: Edge[];
  template: Template | null;
  progressMetrics: ProgressMetrics;
  isFocusMode?: boolean;
  onToggleFocus?: () => void;
  onToggleSidebar?: () => void;
  onGoHome?: () => void;
  onOpenSettings?: () => void;
  onOpenExport?: () => void;  // Open export modal
  initialMessage?: string | null;
  savedChatHistory?: Message[];  // Pre-existing chat history to restore
  onMessageSent?: () => void;
  onSessionCreate?: (firstMessage: string) => Promise<any>;
  currentMindMapId?: number;
  currentProjectTitle?: string;  // Current project title for AI context
  onChatHistoryUpdate?: (history: Message[]) => void;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onProjectRename?: (newTitle: string) => void;  // Handle project rename
  selectedModel: string;
  onModelChange: (model: string) => void;
};

export default function ChatPanel({ 
  nodes, 
  edges, 
  template, 
  progressMetrics, 
  isFocusMode = false, 
  onToggleFocus, 
  onToggleSidebar,
  onGoHome,
  onOpenSettings,
  onOpenExport,
  initialMessage,
  savedChatHistory,
  onMessageSent,
  onSessionCreate,
  currentMindMapId,
  currentProjectTitle = "Untitled Mind Map",
  onChatHistoryUpdate,
  onNodesChange,
  onEdgesChange,
  onProjectRename,
  selectedModel,
  onModelChange
}: ChatPanelProps) {
  // Available model options
  const modelOptions = [
    "Ollama - Llama 3.2",
    "OpenAI - GPT-4",
    "Anthropic - Claude 3.5",
    "DeepSeek - Coder V2"
  ];
  
  // Handle unconfigured model selection - redirect to settings
  const handleUnconfiguredModel = (modelName: string) => {
    const providerKey = getProviderFromModel(modelName);
    if (providerKey && onOpenSettings) {
      // Store the provider to pre-select in settings
      sessionStorage.setItem("openProviderSettings", providerKey);
      onOpenSettings();
    }
  };
  
  // Initialize messages: use saved history if available, otherwise show welcome
  const getInitialMessages = () => {
    if (savedChatHistory && savedChatHistory.length > 0) {
      return savedChatHistory;
    }
    if (initialMessage) {
      return [];
    }
    return [
      {
        role: "assistant" as const,
        content: "👋 Hi! I'm your AI specification assistant. I can help you build out your mind map, suggest components, and answer questions about your project.\n\nWhat would you like to work on?",
        id: "welcome"
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState<{suggestions: Suggestion[], impact: string, messageId: string} | null>(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [chatWallpaper, setChatWallpaper] = useState<string | null>(null);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load wallpaper from localStorage
  useEffect(() => {
    const savedWallpapers = localStorage.getItem("chatWallpapers");
    const savedSelectedId = localStorage.getItem("selectedWallpaperId");
    const savedBlur = localStorage.getItem("wallpaperBlur");
    const customBackgroundEnabled = localStorage.getItem("customBackground") === "true";
    
    console.log("💬 ChatPanel loading wallpaper:", { 
      savedWallpapers: !!savedWallpapers, 
      savedSelectedId, 
      savedBlur,
      customBackgroundEnabled 
    });
    
    // Only show wallpaper if customBackground is enabled
    if (customBackgroundEnabled && savedWallpapers && savedSelectedId) {
      try {
        const wallpapers = JSON.parse(savedWallpapers);
        const selectedWallpaper = wallpapers.find((w: any) => w.id === savedSelectedId);
        console.log("💬 Found wallpaper:", selectedWallpaper?.name);
        setChatWallpaper(selectedWallpaper?.image || null);
      } catch (e) {
        console.error("Failed to load wallpaper:", e);
        setChatWallpaper(null);
      }
    } else {
      console.log("💬 Custom background disabled or no wallpaper, clearing...");
      setChatWallpaper(null);
    }
    
    if (savedBlur) {
      setWallpaperBlur(Number(savedBlur));
      console.log("💬 Wallpaper blur set to:", savedBlur);
    }

    // Listen for wallpaper changes
    const handleWallpaperChange = (e: CustomEvent) => {
      console.log("💬 Wallpaper changed event received:", !!e.detail);
      
      // Check if custom background is enabled
      const isEnabled = localStorage.getItem("customBackground") === "true";
      
      if (e.detail && isEnabled) {
        setChatWallpaper(e.detail.image || e.detail);
      } else {
        setChatWallpaper(null);
      }
      
      // Reload blur setting
      const currentBlur = localStorage.getItem("wallpaperBlur");
      if (currentBlur) {
        setWallpaperBlur(Number(currentBlur));
      }
    };

    window.addEventListener('chatWallpaperChanged', handleWallpaperChange as EventListener);
    return () => {
      window.removeEventListener('chatWallpaperChanged', handleWallpaperChange as EventListener);
    };
  }, []);

  // Load chat history and handle resumption
  useEffect(() => {
    const loadChatHistory = async () => {
      if (initialMessage?.startsWith("__RESUME__:")) {
        setIsLoadingHistory(true);
        try {
          // Extract mindmap ID from the resume message
          const parts = initialMessage.split(":");
          const mindmapId = parts[1] ? parseInt(parts[1]) : currentMindMapId;
          
          if (!mindmapId) {
            console.error("No mindmap ID available for resume");
            return;
          }
          
          console.log("Loading chat history for mindmap:", mindmapId);
          const response = await fetch(`${API}/mindmaps/${mindmapId}`);
          if (!response.ok) throw new Error("Failed to load chat history");
          
          const data = await response.json();
          const history = JSON.parse(data.chat_history || "[]");
          console.log("Loaded chat history:", history);
          
          if (history.length > 0) {
            setMessages(history);
            
            // Smart greeting logic:
            // - If chat history is very long (30+ messages), offer a summary prompt
            // - Otherwise, just let the user continue where they left off (no greeting)
            const messageCount = history.length;
            if (messageCount >= 30) {
              // Offer summary for long conversations
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  role: "assistant",
                  content: "💭 We've had quite a conversation! Would you like me to summarize what we've discussed so far, or shall we continue?",
                  id: `summary-prompt-${Date.now()}`
                }]);
              }, 500);
            }
            // Otherwise: no greeting, user continues where they left off
          } else {
            console.log("No chat history found for this session");
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        } finally {
          setIsLoadingHistory(false);
          if (onMessageSent) onMessageSent();
        }
      } else if (initialMessage && !initialMessage.startsWith("__RESUME__:") && onMessageSent) {
        console.log("Sending initial message:", initialMessage);
        handleSendMessage(initialMessage);
        onMessageSent();
      }
    };
    
    loadChatHistory();
  }, [initialMessage, currentMindMapId]);
  
  // Helper to generate summary from chat history
  const generateSummary = (history: Message[]) => {
    const userMessages = history.filter(m => m.role === "user").slice(-3);
    if (userMessages.length === 0) return "We were just getting started.";
    
    const topics = userMessages.map(m => m.content.split(".")[0]).join(", ");
    return `We were discussing: ${topics}. Let's continue from there!`;
  };

  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const threshold = 100; // pixels from bottom
    const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    return isBottom;
  };

  // Handle scroll events
  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    setShowScrollIndicator(!atBottom && (isStreaming || messages.length > 0));
  };

  // Auto-scroll to bottom when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // Auto-scroll during streaming (if user is at bottom)
  useEffect(() => {
    if (isStreaming && isAtBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingMessage, isStreaming, isAtBottom]);

  // Scroll to bottom on initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0 && onChatHistoryUpdate && !isLoadingHistory && currentMindMapId) {
      // Only save if we have a mind map ID (session exists)
      onChatHistoryUpdate(messages);
    }
  }, [messages, onChatHistoryUpdate, isLoadingHistory, currentMindMapId]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const newMessages: Message[] = [...messages, { 
      role: "user", 
      content: messageText,
      id: `user-${Date.now()}`
    }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);  // Don't stream yet - show thinking indicator first
    setStreamingMessage("");

    try {
      // Create session if this is the first real message and no session exists
      const isFirstMessage = messages.filter(m => m.role === "user").length === 0;
      if (!currentMindMapId && onSessionCreate && isFirstMessage) {
        const session = await onSessionCreate(messageText);
        // Save the initial message immediately after session creation
        if (session && onChatHistoryUpdate) {
          onChatHistoryUpdate(newMessages);
        }
      }

      // Build context from current mind map
      const context = {
        template_id: template?.id || "blank",
        template_name: template?.name || "Blank Canvas",
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          label: edge.label,
        })),
        progress: progressMetrics,
      };

      // Send to AI suggestions endpoint
      const response = await fetch(`${API}/suggestions/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          context,
          history: messages.slice(1).map(m => ({role: m.role, content: m.content})), // Exclude initial greeting
          project_id: currentMindMapId,  // For cross-project pattern recognition
          project_title: currentProjectTitle,  // Current project name for context
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      const aiResponse = data.message;
      const suggestions = data.suggestions || [];
      const impact = data.impact || "minor";
      const needsApproval = data.needsApproval !== false; // Default to true

      // Now start streaming - this hides the thinking indicator
      setIsStreaming(true);
      
      // Simulate streaming by typing out character by character
      let currentText = "";
      for (let i = 0; i < aiResponse.length; i++) {
        currentText += aiResponse[i];
        setStreamingMessage(currentText);
        // Faster streaming speed for better UX
        await new Promise(resolve => setTimeout(resolve, aiResponse[i] === ' ' ? 5 : 15));
      }

      // Add final AI response
      setIsStreaming(false);
      setStreamingMessage("");
      const assistantMessageId = `assistant-${Date.now()}`;
      const updatedMessages: Message[] = [...newMessages, { 
        role: "assistant" as const, 
        content: aiResponse,
        id: assistantMessageId,
        suggestions,
        impact,
        needsApproval
      }];
      setMessages(updatedMessages);
      
      // Explicitly save after AI response
      if (currentMindMapId && onChatHistoryUpdate) {
        onChatHistoryUpdate(updatedMessages);
      }

      // Handle suggestions - ALWAYS require user approval for transparency
      if (suggestions.length > 0) {
        // Always show approval UI for all changes
        setPendingSuggestions({ suggestions, impact, messageId: assistantMessageId });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsStreaming(false);
      setStreamingMessage("");
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          id: `error-${Date.now()}`
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    await handleSendMessage(userMessage);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleResend = (content: string) => {
    setInput(content);
    inputRef.current?.focus();
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    console.log(`Feedback for ${messageId}: ${feedback}`);
    // TODO: Send feedback to backend
  };

  const applySuggestions = (suggestions: Suggestion[]) => {
    if (!onNodesChange && !onEdgesChange) {
      console.warn("Cannot apply suggestions: no handlers provided");
      return;
    }

    setIsApplyingSuggestions(true);
    let newNodes = [...nodes];
    let newEdges = [...edges];

    suggestions.forEach((suggestion) => {
      switch (suggestion.type) {
        case "add_node": {
          // Generate a unique ID
          const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Logical left-to-right positioning based on node type hierarchy
          // Left: User Stories (what/why) -> Middle-Left: Features (what to build)
          // Middle-Right: Technical (how to build) -> Right: Data Models (structure)
          // Bottom: To-Do lists (action items)
          const nodeTypeColumns = {
            'userstory': 100,      // Far left: User needs
            'feature': 400,        // Middle-left: Features
            'technical': 700,      // Middle-right: Implementation
            'datamodel': 1000,     // Far right: Data structure
            'todo': 100            // Bottom left: Task lists
          };
          
          const baseX = nodeTypeColumns[suggestion.nodeType as keyof typeof nodeTypeColumns] || 400;
          
          // Stack nodes of same type vertically, with spacing
          const sameTypeNodes = newNodes.filter(n => n.type === suggestion.nodeType);
          const baseY = suggestion.nodeType === 'todo'
            ? 400 + (sameTypeNodes.length * 180)  // Lower position for todos
            : 100 + (sameTypeNodes.length * 180); // Standard position

          const newNode: Node = {
            id: newNodeId,
            type: suggestion.nodeType,
            position: { x: baseX, y: baseY },
            data: {
              label: suggestion.label || "New Node",
              description: suggestion.description || "",
              category: suggestion.category || "Uncategorized",
              ...(suggestion.nodeType === 'todo' && suggestion.todos && {
                todos: suggestion.todos
              }),
            },
          };

          newNodes.push(newNode);
          break;
        }

        case "update_node": {
          const nodeIndex = newNodes.findIndex(n => n.id === suggestion.nodeId);
          if (nodeIndex !== -1 && suggestion.updates) {
            newNodes[nodeIndex] = {
              ...newNodes[nodeIndex],
              data: {
                ...newNodes[nodeIndex].data,
                ...suggestion.updates,
              },
            };
          }
          break;
        }

        case "add_edge": {
          if (suggestion.source && suggestion.target) {
            const newEdgeId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newEdge: Edge = {
              id: newEdgeId,
              source: suggestion.source,
              target: suggestion.target,
              type: "smoothstep",
            };
            newEdges.push(newEdge);
          }
          break;
        }

        case "rename_project": {
          if (suggestion.newTitle && onProjectRename) {
            onProjectRename(suggestion.newTitle);
          }
          break;
        }
      }
    });

    // Apply changes
    if (onNodesChange) onNodesChange(newNodes);
    if (onEdgesChange) onEdgesChange(newEdges);

    setTimeout(() => {
      setIsApplyingSuggestions(false);
      setPendingSuggestions(null);
    }, 500);
  };

  // Get icon for node type (monochromatic Unicode symbols)
  const getNodeTypeIcon = (nodeType: string): string => {
    switch (nodeType) {
      case "feature": return "◆"; // Diamond for features
      case "technical": return "⚙"; // Gear for technical (monochrome)
      case "datamodel": return "▣"; // Database/table symbol
      case "userstory": return "◉"; // User/story symbol
      case "todo": return "✓"; // Checkmark for to-do lists
      case "notes": return "📝"; // Notes emoji
      default: return "•";
    }
  };

  const handleApproveSuggestions = (suggestions: Suggestion[]) => {
    applySuggestions(suggestions);
    
    // Add a persistent message showing what was applied
    const appliedSummary = suggestions.map(s => {
      switch (s.type) {
        case "add_node":
          const icon = getNodeTypeIcon(s.nodeType || '');
          return `${icon} ${s.label}`;
        case "update_node":
          return `✎ Updated: ${s.label || 'node'}`;
        case "add_edge":
          // Use rationale for edge connections to show what was connected
          return `⎯ ${s.rationale || 'Connected nodes'}`;
        case "rename_project":
          return `✎ Project: "${s.newTitle}"`;
        default:
          return `• ${s.rationale || 'Applied change'}`;
      }
    }).join('\n');
    
    const confirmationMessage: Message = {
      id: `system-${Date.now()}`,
      role: "assistant",
      content: `✓ Applied ${suggestions.length} change${suggestions.length !== 1 ? 's' : ''}:\n\n${appliedSummary}`,
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleRejectSuggestions = () => {
    // Create a summary of what was rejected
    const rejectedSummary = pendingSuggestions?.suggestions.map(s => {
      switch (s.type) {
        case "add_node":
          return `${s.nodeType} node: "${s.label}"`;
        case "update_node":
          return `update to "${s.label || 'node'}"`;
        case "add_edge":
          return `connection suggestion`;
        case "rename_project":
          return `rename to "${s.newTitle}"`;
        default:
          return "change";
      }
    }).join(', ') || "suggestions";

    // Add acknowledgment message to chat
    const acknowledgmentMessage: Message = {
      id: `system-${Date.now()}`,
      role: "assistant",
      content: `Got it! I've discarded those suggestions (${rejectedSummary}). I'll refocus on what you have now and continue to help you build out your project based on your current direction. Feel free to guide me on what you'd like to work on next.`,
    };
    
    setMessages(prev => [...prev, acknowledgmentMessage]);
    setPendingSuggestions(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerClass = isFocusMode
    ? "flex flex-col h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative"
    : "flex flex-col h-full relative";

  return (
    <div className={containerClass}>
      {/* Wallpaper Background Layer - applies to entire ChatPanel */}
      {chatWallpaper && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${chatWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            filter: wallpaperBlur > 0 ? `blur(${wallpaperBlur}px)` : 'none'
          }}
        />
      )}
      
      {/* Content Layer - never blurred */}
      <div className="relative z-10 flex flex-col h-full">
      {/* Header - Only in focus mode */}
      {isFocusMode && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-gray-200">AI Chat</div>
          </div>
          <div className="flex items-center gap-3">
            {/* AI Model Selector */}
            <div className="min-w-[200px]">
              <CustomSelect
                value={selectedModel}
                onChange={onModelChange}
                options={getModelsWithStatus(modelOptions)}
                placeholder="Select a model"
                isDark={true}
                onSelectUnconfigured={handleUnconfiguredModel}
              />
            </div>
            {onOpenExport && (
              <button
                onClick={onOpenExport}
                disabled={nodes.length === 0}
                className={`p-2 rounded-lg transition-colors ${
                  nodes.length === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
                title="Export Specification"
              >
                <Download01Icon size={18} strokeWidth={2} />
              </button>
            )}
            {onToggleFocus && (
              <button
                onClick={onToggleFocus}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="View Mind Map"
              >
                <HierarchyIcon size={18} strokeWidth={2} />
              </button>
            )}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Settings"
              >
                <Settings02Icon size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages - Compact for sidebar, centered for focus mode */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto ${isFocusMode ? 'px-4 pb-4' : 'px-3 pb-3'} relative`}
      >
        {/* Content Layer */}
        <div className={`relative z-10 ${isFocusMode ? 'max-w-3xl mx-auto' : ''} space-y-4 ${isFocusMode ? 'py-4' : 'py-2'}`}>
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setHoveredMessageId(msg.id || null)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className={`${isFocusMode ? 'max-w-[80%]' : 'w-full'} ${msg.role === "user" ? "ml-auto" : ""}`}>
                {/* Message bubble - elegant dark theme matching Synapse AI */}
                <div
                  className={`relative rounded-2xl ${isFocusMode ? 'px-4 py-3' : 'px-3 py-2'} ${
                    msg.role === "user"
                      ? chatWallpaper 
                        ? "bg-zinc-800/90 backdrop-blur-lg text-white shadow-xl"
                        : "bg-zinc-800 text-white"
                      : isFocusMode 
                        ? chatWallpaper
                          ? "bg-zinc-800/85 backdrop-blur-lg text-white shadow-lg"
                          : "bg-zinc-800/50 text-gray-200"
                        : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <div className={`whitespace-pre-wrap ${isFocusMode ? 'text-[15px]' : 'text-xs'} leading-relaxed ${msg.role === "assistant" ? 'pr-8' : ''}`}>
                    {msg.content}
                  </div>

                  {/* Action buttons inside bubble - only for AI messages in focus mode */}
                  {isFocusMode && msg.role === "assistant" && hoveredMessageId === msg.id && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-zinc-200 p-0.5">
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors p-1.5 rounded"
                        title="Copy"
                      >
                        <Copy01Icon size={14} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleResend(msg.content)}
                        className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors p-1.5 rounded"
                        title="Resend"
                      >
                        <RepeatIcon size={14} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id || "", "up")}
                        className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors p-1.5 rounded"
                        title="Good response"
                      >
                        <ThumbsUpIcon size={14} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id || "", "down")}
                        className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors p-1.5 rounded"
                        title="Bad response"
                      >
                        <ThumbsDownIcon size={14} strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Streaming message */}
          {isStreaming && streamingMessage && (
            <div className="flex justify-start">
              <div className={`${isFocusMode ? 'max-w-[80%]' : 'w-full'}`}>
                <div className={`rounded-2xl ${isFocusMode ? 'px-4 py-3' : 'px-3 py-2'} ${
                  isFocusMode 
                    ? chatWallpaper
                      ? 'bg-zinc-800/85 backdrop-blur-lg text-white shadow-lg'
                      : 'bg-zinc-800/50 text-gray-200'
                    : 'bg-zinc-100 text-zinc-900'
                }`}>
                  <div className={`whitespace-pre-wrap ${isFocusMode ? 'text-[15px]' : 'text-xs'} leading-relaxed`}>
                    {streamingMessage}
                    <span className="inline-block w-1 h-4 ml-1 animate-pulse bg-white/60"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Thinking indicator - rotating logo */}
          {isLoading && !isStreaming && (
            <div className="flex justify-start">
              <div className={`flex items-start gap-2 ${isFocusMode ? 'px-1' : 'px-1'}`}>
                <ThinkingLogo />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom indicator */}
        {showScrollIndicator && (
          <button
            onClick={() => {
              setIsAtBottom(true);
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full shadow-lg transition-all z-10 border border-zinc-600"
            title="Scroll to bottom"
          >
            <ArrowDown01Icon size={20} strokeWidth={2} />
          </button>
        )}
        </div>

        {/* Pending Suggestions - show above input */}
        {pendingSuggestions && (
          <div className={`${isFocusMode ? 'max-w-3xl mx-auto' : ''} mt-4 px-4`}>
            <SuggestionCard
              suggestions={pendingSuggestions.suggestions}
              impact={pendingSuggestions.impact as "minor" | "moderate" | "major"}
              onApprove={handleApproveSuggestions}
              onReject={handleRejectSuggestions}
              autoApply={isApplyingSuggestions}
              nodes={nodes}
              isDark={isFocusMode}
              hasWallpaper={!!chatWallpaper}
            />
          </div>
        )}

      {/* Input Area - Consistent large message box */}
      <div className={`${isFocusMode ? 'px-4 py-4' : 'px-3 py-3'}`}>
        <div className={`${isFocusMode ? 'max-w-3xl mx-auto' : 'w-full'}`}>
          <div className={`relative rounded-2xl border transition-all ${
            isFocusMode 
              ? chatWallpaper
                ? 'bg-zinc-800/90 backdrop-blur-md border-white/20 hover:border-white/30 shadow-xl'
                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/50'
              : chatWallpaper
                ? 'bg-white border-zinc-200 hover:border-zinc-300 shadow-lg'
                : 'border-zinc-300 hover:border-zinc-400 bg-white'
          }`}>
            {/* Active model display */}
            <div className={`flex items-center gap-2 px-4 pt-3 pb-2 ${
              isFocusMode ? 'border-b border-zinc-700' : 'border-b border-zinc-200'
            }`}>
              <CheckmarkCircle02Icon size={16} className="text-green-500" strokeWidth={2} />
              <span className={`text-xs font-medium ${
                isFocusMode ? 'text-gray-400' : 'text-zinc-600'
              }`}>
                {selectedModel}
              </span>
              <div className="flex-1"></div>
            </div>
            
            {/* Text input area */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              placeholder="Message..."
              className={`w-full bg-transparent ${
                isFocusMode ? 'text-gray-200 placeholder-gray-500' : 'text-zinc-900 placeholder-zinc-400'
              } ${
                isFocusMode ? 'px-6 py-4 text-[15px]' : 'px-4 py-3 text-sm'
              } focus:outline-none resize-none leading-relaxed`}
              rows={1}
              style={{ minHeight: isFocusMode ? "60px" : "48px", maxHeight: "180px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
              }}
            />
            
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute ${isFocusMode ? 'right-4 bottom-4 w-9 h-9' : 'right-3 bottom-3 w-8 h-8'} ${
                input.trim() && !isLoading
                  ? isFocusMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  : isFocusMode
                    ? 'bg-transparent text-zinc-600 border border-transparent'
                    : 'bg-zinc-300 text-zinc-500 border border-transparent'
              } rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed`}
            >
              <ArrowUp01Icon size={isFocusMode ? 20 : 18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
      </div> {/* End Content Layer */}
    </div>
  );
}

