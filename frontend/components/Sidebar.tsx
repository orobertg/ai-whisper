"use client";
import { useState, useEffect, useRef } from "react";
import { 
  FolderLibraryIcon,
  MessageAdd02Icon,
  Folder01Icon,
  Briefcase01Icon,
  Home01Icon,
  Archive01Icon,
  AiNetworkIcon,
  ArrowDown01Icon,
  BubbleChatIcon,
  WorkflowSquare04Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  Search01Icon,
  Add01Icon,
  Edit02Icon,
  Delete02Icon,
  MoreVerticalIcon,
  TaskDaily02Icon
} from "@hugeicons/react";
import ChatPanel from "./ChatPanel";
import { Node, Edge } from "reactflow";
import { Template } from "@/lib/templates";
import { ProgressMetrics } from "@/lib/progress";
import { useTheme } from "@/contexts/ThemeContext";

type Folder = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type RecentChat = {
  id: number;
  title: string;
  template_id: string;
  updated_at: string;
  folder_id?: number;
  nodes_json?: string;
  chat_history?: string;
  // Enhanced metadata
  last_message_preview?: string;
  ai_model?: string;
  message_count?: number;
};

type SidebarProps = {
  onNewChat: () => void;
  onSelectFolder: (folderId: number | null) => void;
  onSelectProject: (projectId: number, mode?: 'chat' | 'mindmap') => void;
  selectedFolderId: number | null;
  currentProjectId?: number;
  recentChats?: RecentChat[];  // Pass recent chats from parent
  onReloadChats?: () => void;  // Callback to reload chats
  onToggleSidebar?: () => void;  // New: toggle sidebar visibility
  onGoHome?: () => void;  // Navigate to home screen
  onNavigateToKanban?: () => void;  // Navigate to Kanban board
  // Chat panel props (only when in editor mode)
  showChat?: boolean;
  nodes?: Node[];
  edges?: Edge[];
  template?: Template | null;
  progressMetrics?: ProgressMetrics;
  onToggleChatFocus?: () => void;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  currentMindMapId?: number;
  currentProjectTitle?: string;
  onProjectRename?: (newTitle: string) => void;
  onChatHistoryUpdate?: (history: any[]) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
};

export default function Sidebar({ 
  onNewChat, 
  onSelectFolder, 
  onSelectProject, 
  selectedFolderId,
  currentProjectId,
  recentChats = [],  // Receive from parent
  onReloadChats,
  onToggleSidebar,  // New prop
  onGoHome,  // New prop
  onNavigateToKanban,  // New prop
  showChat = false,
  nodes = [],
  edges = [],
  template = null,
  progressMetrics,
  onToggleChatFocus,
  onNodesChange,
  onEdgesChange,
  currentMindMapId,
  currentProjectTitle,
  onProjectRename,
  onChatHistoryUpdate,
  selectedModel = "Ollama - Llama 3.2",
  onModelChange
}: SidebarProps) {
  const { isLight } = useTheme();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [recentsExpanded, setRecentsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState<number | null>(null);
  const [hoveredChat, setHoveredChat] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  
  // Folder management state
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderIcon, setFolderIcon] = useState("📁");
  const [folderColor, setFolderColor] = useState("#6b7280");
  const [folderMenuOpen, setFolderMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    loadFolders();
    // Load collapsed state from localStorage
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", String(newCollapsed));
  };

  async function loadFolders() {
    try {
      const response = await fetch("http://localhost:8000/folders/");
      if (!response.ok) throw new Error("Failed to load folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  }

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setFolderName("");
    setFolderIcon("📁");
    setFolderColor("#6b7280");
    setShowFolderModal(true);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderIcon(folder.icon);
    setFolderColor(folder.color);
    setShowFolderModal(true);
    setFolderMenuOpen(null);
  };

  const handleSaveFolder = async () => {
    try {
      const payload = {
        name: folderName,
        icon: folderIcon,
        color: folderColor
      };

      if (editingFolder) {
        // Update existing folder
        const response = await fetch(`http://localhost:8000/folders/${editingFolder.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update folder");
      } else {
        // Create new folder
        const response = await fetch("http://localhost:8000/folders/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to create folder");
      }

      await loadFolders();
      setShowFolderModal(false);
    } catch (error) {
      console.error("Error saving folder:", error);
      alert("Failed to save folder");
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    if (!confirm("Are you sure you want to delete this folder? Projects in this folder will not be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/folders/${folderId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete folder");
      
      await loadFolders();
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
      setFolderMenuOpen(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder");
    }
  };

  const getFolderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "work":
        return <Briefcase01Icon size={16} strokeWidth={2} />;
      case "personal":
        return <Home01Icon size={16} strokeWidth={2} />;
      case "archive":
        return <Archive01Icon size={16} strokeWidth={2} />;
      default:
        return <Folder01Icon size={16} strokeWidth={2} />;
    }
  };

  return (
    <aside 
      className={`h-screen ${
        isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'
      } border-r flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`border-b ${isLight ? 'border-zinc-200' : 'border-zinc-800'} flex-shrink-0 ${isCollapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
        <div className={`flex items-center mb-3 ${isCollapsed ? 'flex-col gap-2' : 'gap-3'}`}>
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <img 
              src={isLight ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="AI Whisper Logo" 
              className="w-9 h-9 object-contain"
            />
          </div>
          {!isCollapsed && (
            <h1 className={`text-base font-semibold flex-1 ${
              isLight 
                ? 'bg-gradient-to-r from-zinc-700 to-zinc-900 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent'
            }`}>
              AI Whisper
            </h1>
          )}
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <SidebarRight01Icon size={16} strokeWidth={2} />
            ) : (
              <SidebarLeft01Icon size={16} strokeWidth={2} />
            )}
          </button>
        </div>
        
        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className={`w-full bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 rounded-md text-xs text-gray-400 hover:text-gray-200 transition-all flex items-center justify-center ${
            isCollapsed ? 'px-2 py-2 gap-0' : 'px-3 py-2 gap-2'
          }`}
          title={isCollapsed ? "New Chat" : undefined}
        >
          <MessageAdd02Icon size={14} strokeWidth={2} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Navigation Section */}
      <div className="border-b border-zinc-800 flex-shrink-0">
        <div className={isCollapsed ? 'px-2 py-2.5' : 'px-4 py-2.5'}>
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Navigate
            </h3>
          )}
          <div className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
            {/* Home Button */}
            {onGoHome && (
              <button 
                onClick={onGoHome}
                className={`w-full text-left rounded text-xs flex items-center transition-colors text-gray-300 hover:bg-zinc-800 ${
                  isCollapsed ? 'px-2 py-2 justify-center' : 'px-2 py-1.5 gap-2'
                }`}
                title={isCollapsed ? "Home" : undefined}
              >
                <Home01Icon size={14} strokeWidth={2} />
                {!isCollapsed && <span>Home</span>}
              </button>
            )}
            
            {/* Kanban Board Button */}
            {onNavigateToKanban && (
              <button 
                onClick={onNavigateToKanban}
                className={`w-full text-left rounded text-xs flex items-center transition-colors text-gray-300 hover:bg-zinc-800 ${
                  isCollapsed ? 'px-2 py-2 justify-center' : 'px-2 py-1.5 gap-2'
                }`}
                title={isCollapsed ? "Kanban Board" : undefined}
              >
                <TaskDaily02Icon size={14} strokeWidth={2} />
                {!isCollapsed && <span>Kanban Board</span>}
              </button>
            )}
            
            {/* Explore Button */}
            <button 
              onClick={() => {
                alert("Explore feature coming soon! This will house community templates and shared projects.");
              }}
              className={`w-full text-left rounded text-xs flex items-center transition-colors text-gray-300 hover:bg-zinc-800 ${
                isCollapsed ? 'px-2 py-2 justify-center' : 'px-2 py-1.5 gap-2'
              }`}
              title={isCollapsed ? "Explore" : undefined}
            >
              <Search01Icon size={14} strokeWidth={2} />
              {!isCollapsed && <span>Explore</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Folders Section */}
      <div className="border-b border-zinc-800 flex-shrink-0">
        {!isCollapsed && (
          <div className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-gray-500">
            <button
              onClick={() => setFoldersExpanded(!foldersExpanded)}
              className="flex items-center gap-2 hover:text-gray-400 transition-colors"
            >
              <span>FOLDERS</span>
              <ArrowDown01Icon 
                size={14} 
                strokeWidth={2}
                className={`transition-transform ${foldersExpanded ? '' : '-rotate-90'}`}
              />
            </button>
            <button
              onClick={handleCreateFolder}
              className="text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-zinc-800/50 transition-colors"
              title="Create new folder"
            >
              <Add01Icon size={14} strokeWidth={2} />
            </button>
          </div>
        )}
        {(!isCollapsed && foldersExpanded) && (
          <div className="px-4 pb-3 space-y-1">
            <button 
              onClick={() => onSelectFolder(null)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                selectedFolderId === null 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-gray-300 hover:bg-zinc-800"
              }`}
            >
              <FolderLibraryIcon size={14} strokeWidth={2} /> All
            </button>
            
            {folders.map((folder) => (
              <div 
                key={folder.id}
                className="group relative flex items-center gap-1"
              >
                <button 
                  onClick={() => onSelectFolder(folder.id)}
                  className={`flex-1 text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                    selectedFolderId === folder.id 
                      ? "bg-zinc-100 text-zinc-900 font-medium" 
                      : "text-gray-300 hover:bg-zinc-800"
                  }`}
                >
                  {getFolderIcon(folder.name)} {folder.name}
                </button>
                <button
                  onClick={() => setFolderMenuOpen(folderMenuOpen === folder.id ? null : folder.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-200 hover:bg-zinc-800 rounded transition-all"
                  title="Folder options"
                >
                  <MoreVerticalIcon size={12} strokeWidth={2} />
                </button>
                {folderMenuOpen === folder.id && (
                  <div className="absolute right-0 top-8 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-50 min-w-[140px]">
                    <button
                      onClick={() => handleEditFolder(folder)}
                      className="w-full px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                    >
                      <Edit02Icon size={12} strokeWidth={2} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Delete02Icon size={12} strokeWidth={2} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Collapsed Folders - Icon Only with Popup */}
        {isCollapsed && (
          <div 
            className="px-2 py-2 relative"
            onMouseLeave={() => {
              // Only close when mouse leaves both icon and popup area
              setTimeout(() => setHoveredFolder(null), 100);
            }}
          >
            <button 
              className={`w-full px-2 py-2 rounded text-xs flex items-center justify-center transition-colors ${
                selectedFolderId !== null 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "text-gray-300 hover:bg-zinc-800"
              }`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPopupPosition({ top: rect.top, left: rect.right + 8 });
                setHoveredFolder(-1); // -1 indicates folders popup
              }}
            >
              <Folder01Icon size={16} strokeWidth={2} />
            </button>
            
            {/* Popup Menu */}
            {hoveredFolder === -1 && (
              <div 
                className="fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 min-w-[180px]"
                style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
                onMouseEnter={() => setHoveredFolder(-1)}
                onMouseLeave={() => setHoveredFolder(null)}
              >
                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
                  Folders
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFolder(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    selectedFolderId === null 
                      ? "bg-zinc-100 text-zinc-900 font-medium" 
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <FolderLibraryIcon size={14} strokeWidth={2} /> All
                </button>
                {folders.map((folder) => (
                  <button 
                    key={folder.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFolder(folder.id);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                      selectedFolderId === folder.id 
                        ? "bg-zinc-100 text-zinc-900 font-medium" 
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {getFolderIcon(folder.name)} {folder.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isCollapsed && (
          <button
            onClick={() => setRecentsExpanded(!recentsExpanded)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-gray-500 hover:bg-zinc-800/50 transition-colors flex-shrink-0"
          >
            <span>HISTORY</span>
            <ArrowDown01Icon 
              size={14} 
              strokeWidth={2}
              className={`transition-transform ${recentsExpanded ? '' : '-rotate-90'}`}
            />
          </button>
        )}
        
        {/* Expanded View */}
        {!isCollapsed && recentsExpanded && (
          <div className="px-2 pb-2 space-y-0.5 overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                Loading...
              </div>
            ) : recentChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No chats yet
              </div>
            ) : (
              recentChats.slice(0, 10).map((chat) => {
                const isChatOnly = chat.title.startsWith("Chat -") || 
                                  (!chat.nodes_json || chat.nodes_json === "[]");
                
                const getShortenedTitle = (title: string) => {
                  let shortened = title
                    .replace(/^Chat - /, '')
                    .replace(/^\d+\/\d+\/\d+/, '')
                    .replace(/^\d+:\d+\s+(AM|PM)/, '')
                    .trim();
                  
                  const words = shortened.split(/\s+/);
                  if (words.length > 4) {
                    shortened = words.slice(0, 4).join(' ') + '...';
                  } else if (shortened.length > 40) {
                    shortened = shortened.substring(0, 37) + '...';
                  }
                  
                  return shortened || 'Untitled chat';
                };
                
                // Format timestamp as "X hours ago", "X days ago", etc.
                const getTimeAgo = (dateString: string) => {
                  const now = new Date();
                  const date = new Date(dateString);
                  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
                  
                  if (seconds < 60) return 'just now';
                  const minutes = Math.floor(seconds / 60);
                  if (minutes < 60) return `${minutes}m ago`;
                  const hours = Math.floor(minutes / 60);
                  if (hours < 24) return `${hours}h ago`;
                  const days = Math.floor(hours / 24);
                  if (days < 7) return `${days}d ago`;
                  const weeks = Math.floor(days / 7);
                  if (weeks < 4) return `${weeks}w ago`;
                  const months = Math.floor(days / 30);
                  return `${months}mo ago`;
                };
                
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectProject(chat.id, 'chat')}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm transition-all group flex flex-col gap-1.5 ${
                      currentProjectId === chat.id
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                    }`}
                  >
                    {/* Top Row: Icon + Title */}
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <BubbleChatIcon 
                          size={16} 
                          strokeWidth={2} 
                          className={currentProjectId === chat.id ? "text-zinc-900" : "text-gray-500"}
                        />
                        {!isChatOnly && (
                          <WorkflowSquare04Icon 
                            size={11} 
                            strokeWidth={2} 
                            className={currentProjectId === chat.id ? "text-zinc-600" : "text-gray-600"}
                          />
                        )}
                      </div>
                      <span className={`truncate flex-1 text-left font-medium ${
                        currentProjectId === chat.id ? "text-zinc-900" : "text-zinc-100"
                      }`}>
                        {getShortenedTitle(chat.title)}
                      </span>
                    </div>
                    
                    {/* Bottom Row: Preview or Metadata */}
                    {chat.last_message_preview && (
                      <div className={`text-xs truncate text-left w-full pl-6 ${
                        currentProjectId === chat.id ? "text-zinc-600" : "text-zinc-500"
                      }`}>
                        {chat.last_message_preview}
                      </div>
                    )}
                    
                    {/* Metadata Row: Model + Count + Time */}
                    <div className={`flex items-center gap-2 text-xs pl-6 ${
                      currentProjectId === chat.id ? "text-zinc-500" : "text-zinc-600"
                    }`}>
                      {chat.ai_model && (
                        <span className="truncate">{chat.ai_model}</span>
                      )}
                      {chat.message_count !== undefined && chat.message_count > 0 && (
                        <>
                          {chat.ai_model && <span>•</span>}
                          <span>{chat.message_count} msg{chat.message_count > 1 ? 's' : ''}</span>
                        </>
                      )}
                      <span className="ml-auto flex-shrink-0">{getTimeAgo(chat.updated_at)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
        
        {/* Collapsed View - Icons Only */}
        {isCollapsed && (
          <div className="px-2 py-2 space-y-1 overflow-y-auto flex-1">
            {recentChats.slice(0, 10).map((chat) => (
              <div
                key={chat.id}
                className="relative"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPopupPosition({ top: rect.top, left: rect.right + 8 });
                  setHoveredChat(chat.id);
                }}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <button
                  onClick={() => onSelectProject(chat.id, 'chat')}
                  className={`w-full px-2 py-2 rounded text-xs flex items-center justify-center transition-colors ${
                    currentProjectId === chat.id
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <BubbleChatIcon size={16} strokeWidth={2} />
                </button>
                
                {/* Popup on Hover */}
                {hoveredChat === chat.id && (
                  <div 
                    className="fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-xl px-4 py-3 min-w-[200px] max-w-[300px]"
                    style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    <p className="text-sm text-zinc-900 font-medium mb-2">{chat.title}</p>
                    
                    {chat.last_message_preview && (
                      <p className="text-xs text-zinc-600 mb-2 line-clamp-2">
                        {chat.last_message_preview}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      {chat.ai_model && (
                        <span className="truncate">{chat.ai_model}</span>
                      )}
                      {chat.message_count !== undefined && chat.message_count > 0 && (
                        <>
                          {chat.ai_model && <span>•</span>}
                          <span>{chat.message_count} msg{chat.message_count > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(chat.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Panel - Only shown in editor mode */}
      {showChat && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              AI Assistant
            </h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              nodes={nodes}
              edges={edges}
              template={template}
              progressMetrics={progressMetrics || { completeness: 0, successProbability: 0, missingItems: [], nodeTypeCounts: {} }}
              isFocusMode={false}
              onToggleFocus={onToggleChatFocus}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              currentMindMapId={currentMindMapId}
              currentProjectTitle={currentProjectTitle}
              onProjectRename={onProjectRename}
              onChatHistoryUpdate={onChatHistoryUpdate}
              selectedModel={selectedModel}
              onModelChange={onModelChange || (() => {})}
            />
          </div>
        </div>
      )}

      {/* Folder Create/Edit Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              {editingFolder ? "Edit Folder" : "Create New Folder"}
            </h2>
            
            <div className="space-y-4">
              {/* Folder Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {/* Folder Icon */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={folderIcon}
                  onChange={(e) => setFolderIcon(e.target.value)}
                  placeholder="📁"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={2}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Use any emoji (e.g., 💼 🏠 📦 🎨)
                </p>
              </div>

              {/* Folder Color */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={folderColor}
                    onChange={(e) => setFolderColor(e.target.value)}
                    className="w-16 h-10 border border-zinc-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={folderColor}
                    onChange={(e) => setFolderColor(e.target.value)}
                    placeholder="#6b7280"
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowFolderModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFolder}
                disabled={!folderName.trim()}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingFolder ? "Save Changes" : "Create Folder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

