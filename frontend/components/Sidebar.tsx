"use client";
import { useState, useEffect } from "react";
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
  Search01Icon
} from "@hugeicons/react";
import ChatPanel from "./ChatPanel";
import { Node, Edge } from "reactflow";
import { Template } from "@/lib/templates";
import { ProgressMetrics } from "@/lib/progress";

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
  onChatHistoryUpdate
}: SidebarProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [recentsExpanded, setRecentsExpanded] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

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
    <aside className="w-64 h-screen bg-zinc-900/50 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <AiNetworkIcon size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-base font-semibold text-white flex-1">AI Whisper</h1>
          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
              title="Hide sidebar"
            >
              <SidebarLeft01Icon size={16} strokeWidth={2} />
            </button>
          )}
        </div>
        
        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className="w-full px-3 py-2 bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 rounded-md text-xs text-gray-400 hover:text-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <MessageAdd02Icon size={14} strokeWidth={2} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation Section - NEW */}
      <div className="border-b border-zinc-800 flex-shrink-0">
        <div className="px-4 py-2.5">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Navigate
          </h3>
          <div className="space-y-1">
            {/* Home Button */}
            {onGoHome && (
              <button 
                onClick={onGoHome}
                className="w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors text-gray-300 hover:bg-zinc-800"
              >
                <Home01Icon size={14} strokeWidth={2} /> Home
              </button>
            )}
            
            {/* Explore Button - Placeholder for future feature */}
            <button 
              onClick={() => {
                // Placeholder for future explore functionality
                alert("Explore feature coming soon! This will house community templates and shared projects.");
              }}
              className="w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors text-gray-300 hover:bg-zinc-800"
            >
              <Search01Icon size={14} strokeWidth={2} /> Explore
            </button>
          </div>
        </div>
      </div>

      {/* Folders Section - Collapsible */}
      <div className="border-b border-zinc-800 flex-shrink-0">
        <button
          onClick={() => setFoldersExpanded(!foldersExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-gray-500 hover:bg-zinc-800/50 transition-colors"
        >
          <span>FOLDERS</span>
          <ArrowDown01Icon 
            size={14} 
            strokeWidth={2}
            className={`transition-transform ${foldersExpanded ? '' : '-rotate-90'}`}
          />
        </button>
        {foldersExpanded && (
          <div className="px-4 pb-3 space-y-1">
            <button 
              onClick={() => onSelectFolder(null)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                selectedFolderId === null 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-gray-300 hover:bg-zinc-800"
              }`}
            >
              <FolderLibraryIcon size={14} strokeWidth={2} /> All
            </button>
            
            {folders.map((folder) => (
              <button 
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                  selectedFolderId === folder.id 
                    ? "bg-blue-600/20 text-blue-400" 
                    : "text-gray-300 hover:bg-zinc-800"
                }`}
              >
                {getFolderIcon(folder.name)} {folder.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Conversations - Collapsible */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
        {recentsExpanded && (
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
                // Check if this is a chat-only session or has mind map content
                const isChatOnly = chat.title.startsWith("Chat -") || 
                                  (!chat.nodes_json || chat.nodes_json === "[]");
                
                // Shorten title intelligently to 3-4 words
                const getShortenedTitle = (title: string) => {
                  // Remove common prefixes
                  let shortened = title
                    .replace(/^Chat - /, '')
                    .replace(/^\d+\/\d+\/\d+/, '')
                    .replace(/^\d+:\d+\s+(AM|PM)/, '')
                    .trim();
                  
                  // Get first 3-4 words (max 40 chars)
                  const words = shortened.split(/\s+/);
                  if (words.length > 4) {
                    shortened = words.slice(0, 4).join(' ') + '...';
                  } else if (shortened.length > 40) {
                    shortened = shortened.substring(0, 37) + '...';
                  }
                  
                  return shortened || 'Untitled chat';
                };
                
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectProject(chat.id, 'chat')}
                    className={`w-full px-3 py-2 rounded-md text-sm transition-all group flex items-center gap-2 ${
                      currentProjectId === chat.id
                        ? "bg-zinc-800 text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <BubbleChatIcon 
                        size={16} 
                        strokeWidth={2} 
                        className={currentProjectId === chat.id ? "text-white" : "text-gray-500"}
                      />
                      {!isChatOnly && (
                        <WorkflowSquare04Icon 
                          size={12} 
                          strokeWidth={2} 
                          className="text-gray-600"
                        />
                      )}
                    </div>
                    <span className="truncate flex-1 text-left">
                      {getShortenedTitle(chat.title)}
                    </span>
                  </button>
                );
              })
            )}
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
            />
          </div>
        </div>
      )}
    </aside>
  );
}

