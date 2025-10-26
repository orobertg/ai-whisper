"use client";
import { useState, useEffect } from "react";
import { Template, TEMPLATES } from "@/lib/templates";
import { 
  FolderLibraryIcon,
  Add01Icon,
  ArrowUp01Icon,
  Attachment02Icon,
  Globe02Icon,
  MessageAdd02Icon,
  Folder01Icon,
  Briefcase01Icon,
  Home01Icon,
  Archive01Icon,
  CloudIcon,
  AiNetworkIcon,
  CheckmarkCircle02Icon
} from "@hugeicons/react";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const quickActions: QuickAction[] = [
  {
    id: "create",
    title: "Create project",
    description: "Start fresh with a guided AI conversation",
    icon: "🖼️",
    color: "from-blue-500 to-purple-500"
  },
  {
    id: "open",
    title: "Open project",
    description: "Continue working on a saved project",
    icon: "📄",
    color: "from-green-500 to-teal-500"
  },
  {
    id: "brainstorm",
    title: "Quick Chat",
    description: "Start chatting without a template",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500"
  }
];

type RecentChat = {
  id: number;
  title: string;
  template_id: string;
  updated_at: string;
  folder_id?: number;
};

type Folder = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type HomeScreenProps = {
  onSelectAction: (actionId: string, folderId?: number | null) => void;
  onSelectTemplate?: (template: Template, folderId?: number | null) => void;
  onSelectProject?: (projectId: number) => void;
  userName?: string;
};

export default function HomeScreen({ onSelectAction, onSelectTemplate, onSelectProject, userName = "there" }: HomeScreenProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Load folders and recent chats
  useEffect(() => {
    loadFolders();
    loadRecentChats();
  }, []);

  // Reload chats when folder selection changes
  useEffect(() => {
    loadRecentChats();
  }, [selectedFolderId]);

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

  async function loadRecentChats() {
    try {
      setLoading(true);
      const url = selectedFolderId 
        ? `http://localhost:8000/mindmaps/?folder_id=${selectedFolderId}`
        : "http://localhost:8000/mindmaps/";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load projects");
      const data = await response.json();
      // Get most recent 3
      setRecentChats(data.slice(0, 3));
    } catch (error) {
      console.error("Error loading recent chats:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleActionClick = (actionId: string) => {
    if (actionId === "create") {
      // Toggle expanded state for template selection
      setExpandedAction(expandedAction === "create" ? null : "create");
    } else if (actionId === "open") {
      // Toggle recent projects view
      setExpandedAction(expandedAction === "open" ? null : "open");
    } else {
      // Other actions go through the normal flow
      onSelectAction(actionId);
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    setExpandedAction(null);
    if (onSelectTemplate) {
      // Pass the template with the currently selected folder
      onSelectTemplate(template, selectedFolderId);
    }
  };

  const handleProjectSelect = (projectId: number) => {
    setExpandedAction(null);
    if (onSelectProject) {
      onSelectProject(projectId);
    }
  };

  const handleFolderClick = (folderId: number) => {
    setSelectedFolderId(selectedFolderId === folderId ? null : folderId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <AiNetworkIcon size={24} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold">AI Whisper</h1>
              <p className="text-xs text-gray-500">Spec Assistant</p>
            </div>
          </div>
          
          {/* New Chat Button - Compact Style */}
          <button 
            onClick={() => onSelectAction('brainstorm', selectedFolderId)}
            className="w-full px-3 py-1.5 bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 rounded-md text-xs text-gray-400 hover:text-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageAdd02Icon size={14} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Folders Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Folders
              </h3>
            </div>
            <div className="space-y-1">
              {/* All Projects option */}
              <button 
                onClick={() => setSelectedFolderId(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  selectedFolderId === null 
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/50" 
                    : "text-gray-300 hover:bg-zinc-800"
                }`}
              >
                <FolderLibraryIcon size={16} /> All Projects
              </button>
              
              {/* Folder list */}
              {folders.map((folder) => {
                // Map folder names to appropriate icons
                const getFolderIcon = (name: string) => {
                  switch (name.toLowerCase()) {
                    case "work":
                      return <Briefcase01Icon size={16} />;
                    case "personal":
                      return <Home01Icon size={16} />;
                    case "archive":
                      return <Archive01Icon size={16} />;
                    default:
                      return <Folder01Icon size={16} />;
                  }
                };

                return (
                  <button 
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      selectedFolderId === folder.id 
                        ? "bg-blue-600/20 text-blue-400 border border-blue-600/50" 
                        : "text-gray-300 hover:bg-zinc-800"
                    }`}
                    style={{
                      borderLeft: selectedFolderId === folder.id ? `3px solid ${folder.color}` : "none"
                    }}
                  >
                    {getFolderIcon(folder.name)} {folder.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Conversations in selected folder */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Recent {selectedFolderId ? `in ${folders.find(f => f.id === selectedFolderId)?.name}` : ""}
            </h3>
            <div className="space-y-1">
              {loading ? (
                <div className="text-center py-4 text-gray-500 text-xs">
                  Loading...
                </div>
              ) : recentChats.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-xs">
                  No projects yet
                </div>
              ) : (
                recentChats.slice(0, 5).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleProjectSelect(chat.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-xs text-gray-300 transition-colors line-clamp-1"
                  >
                    {chat.title}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header - weather and model status */}
        <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Weather widget */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CloudIcon size={18} strokeWidth={2} />
              <span className="hidden sm:inline">Loading weather...</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Model status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-xs">
              <AiNetworkIcon size={14} className="text-blue-400" strokeWidth={2} />
              <span className="text-gray-300">Ollama</span>
              <CheckmarkCircle02Icon size={14} className="text-green-400" strokeWidth={2} />
            </div>
          </div>
        </header>

        {/* Main Content - Centered Layout */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-2xl w-full">
            {/* Greeting */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                {greeting}, {userName}
              </h1>
              <p className="text-gray-400">
                How can I help you?
              </p>
            </div>

            {/* Chat Input Box */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hey, can you help me with something?"
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                  onFocus={() => onSelectAction('brainstorm', selectedFolderId)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors">
                    <Attachment02Icon size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors">
                    <Globe02Icon size={18} />
                  </button>
                  <button className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center">
                    <ArrowUp01Icon size={18} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Model Selector - Below input */}
              <div className="mt-2 text-xs flex items-center gap-2 px-2">
                <select className="bg-transparent border-none text-gray-400 hover:text-gray-300 focus:outline-none cursor-pointer focus:ring-0">
                  <option value="ollama" className="bg-zinc-900">Ollama (Local)</option>
                  <option value="gpt-4" className="bg-zinc-900">GPT-4</option>
                  <option value="claude" className="bg-zinc-900">Claude</option>
                </select>
              </div>
            </div>

            {/* Quick Action Buttons - Small and Compact */}
            <div className="mb-8 space-y-3">
              <div className="flex gap-2 justify-start overflow-x-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className={`px-3 py-1.5 bg-transparent border rounded-md text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                      expandedAction === action.id
                        ? "border-blue-600 bg-blue-600/10 text-blue-400"
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {action.title}
                  </button>
                ))}
              </div>

              {/* Expanded Template Selection */}
              {expandedAction === "create" && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">Choose a template</h3>
                    <button
                      onClick={() => setExpandedAction(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Folder Selection */}
                  {folders.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 mb-2 block">Save to folder (optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {folders.map((folder) => {
                          const getFolderIcon = (name: string) => {
                            switch (name.toLowerCase()) {
                              case "work":
                                return <Briefcase01Icon size={14} strokeWidth={2} />;
                              case "personal":
                                return <Home01Icon size={14} strokeWidth={2} />;
                              case "archive":
                                return <Archive01Icon size={14} strokeWidth={2} />;
                              default:
                                return <Folder01Icon size={14} strokeWidth={2} />;
                            }
                          };

                          return (
                            <button
                              key={folder.id}
                              onClick={() => setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all ${
                                selectedFolderId === folder.id
                                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/50"
                                  : "bg-zinc-800/50 text-gray-300 border border-zinc-700 hover:border-zinc-600"
                              }`}
                              style={{
                                backgroundColor: selectedFolderId === folder.id ? `${folder.color}20` : undefined
                              }}
                            >
                              {getFolderIcon(folder.name)}
                              {folder.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="text-left p-3 bg-zinc-800/50 border border-zinc-700 hover:border-blue-600 rounded-lg transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white group-hover:text-blue-400">
                              {template.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {template.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Recent Projects */}
              {expandedAction === "open" && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">Your projects</h3>
                    <button
                      onClick={() => setExpandedAction(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Loading projects...
                    </div>
                  ) : recentChats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No projects yet. Create your first one!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentChats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => handleProjectSelect(chat.id)}
                          className="w-full text-left p-3 bg-zinc-800/50 border border-zinc-700 hover:border-blue-600 rounded-lg transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-white group-hover:text-blue-400">
                                {chat.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTimeAgo(chat.updated_at)}
                              </div>
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-400">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Chats - Horizontal Cards */}
            {recentChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageAdd02Icon size={16} className="text-gray-400" strokeWidth={2} />
                  <h3 className="text-sm font-medium text-gray-400">Your recent chats</h3>
                  <span className="text-gray-600">›</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recentChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleProjectSelect(chat.id)}
                      className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer text-left"
                    >
                      <div className="mb-2">
                        <MessageAdd02Icon size={18} className="text-gray-500" strokeWidth={2} />
                      </div>
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-1">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(chat.updated_at)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

