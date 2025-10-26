"use client";
import { useState } from "react";
import { Template, TEMPLATES } from "@/lib/templates";
import { 
  ArrowUp01Icon,
  Attachment02Icon,
  Globe02Icon,
  MessageAdd02Icon,
  AiNetworkIcon,
  CheckmarkCircle02Icon,
  Briefcase01Icon,
  Home01Icon,
  Archive01Icon,
  Folder01Icon,
  BubbleChatIcon,
  WorkflowSquare04Icon,
  Moon02Icon,
  Coffee01Icon,
  Sun03Icon,
  Settings02Icon
} from "@hugeicons/react";

type HomeContentProps = {
  onSelectAction: (actionId: string, folderId?: number | null) => void;
  onSelectTemplate?: (template: Template, folderId?: number | null) => void;
  onSelectProject?: (projectId: number, mode?: 'chat' | 'mindmap') => void;
  onStartChat?: (initialMessage: string) => void;
  onOpenSettings?: () => void;
  userName?: string;
  selectedFolderId: number | null;
  folders: Array<{ id: number; name: string; icon: string; color: string }>;
  recentChats: Array<{ 
    id: number; 
    title: string; 
    updated_at: string;
    nodes_json?: string;
    chat_history?: string;
  }>;
};

export default function HomeContent({ 
  onSelectAction, 
  onSelectTemplate, 
  onSelectProject,
  onStartChat,
  onOpenSettings,
  userName = "there",
  selectedFolderId,
  folders,
  recentChats
}: HomeContentProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const handleActionClick = (actionId: string) => {
    if (actionId === "create") {
      setExpandedAction(expandedAction === "create" ? null : "create");
    } else if (actionId === "open") {
      setExpandedAction(expandedAction === "open" ? null : "open");
    } else {
      onSelectAction(actionId);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setExpandedAction(null);
    if (onSelectTemplate) {
      onSelectTemplate(template, selectedFolderId);
    }
  };

  const handleProjectSelect = (projectId: number, mode?: 'chat' | 'mindmap') => {
    setExpandedAction(null);
    if (onSelectProject) {
      onSelectProject(projectId, mode);
    }
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 8) return "Good Early Morning";
    if (hour >= 8 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 8) return <Moon02Icon size={28} strokeWidth={2} className="text-blue-400" />;
    if (hour >= 8 && hour < 12) return <Coffee01Icon size={28} strokeWidth={2} className="text-amber-500" />;
    if (hour >= 12 && hour < 17) return <Sun03Icon size={28} strokeWidth={2} className="text-yellow-400" />;
    return <Moon02Icon size={28} strokeWidth={2} className="text-indigo-400" />;
  };

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

  const greeting = getGreeting();
  const greetingIcon = getGreetingIcon();

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header - model status and settings */}
      <header className="h-14 border-b border-zinc-800 px-6 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg text-xs">
            <span className="text-gray-300 font-medium">Ollama - Llama 3.2</span>
            <CheckmarkCircle02Icon size={14} className="text-green-400" strokeWidth={2} />
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings02Icon size={18} strokeWidth={2} className="text-gray-400 hover:text-gray-200" />
          </button>
        </div>
      </header>

      {/* Main Content - Centered Layout */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-2xl w-full">
          {/* Greeting */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">{greetingIcon}</div>
            <h1 className="text-4xl font-bold mb-2">
              {greeting}, {userName}
            </h1>
            <p className="text-gray-400 text-lg">What would you like to work on today?</p>
          </div>

          {/* Chat Input Box - Consistent with chat screen */}
          <div className="mb-6">
            <div className="relative bg-zinc-50 border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              {/* Model selector and icons row */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-zinc-200">
                <select className="text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer font-medium bg-zinc-50 border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50">
                  <option value="ollama-llama">Ollama - Llama 3.2</option>
                  <option value="openai-gpt4">OpenAI - GPT-4</option>
                  <option value="anthropic-claude">Anthropic - Claude 3.5</option>
                  <option value="deepseek-coder">DeepSeek - Coder V2</option>
                </select>
                <div className="flex-1"></div>
              </div>
              
              {/* Text input area */}
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && chatInput.trim() && onStartChat) {
                    e.preventDefault();
                    onStartChat(chatInput.trim());
                  }
                }}
                placeholder="Tell me about your project (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-6 py-4 bg-transparent text-zinc-900 placeholder-zinc-400 text-[15px] focus:outline-none resize-none leading-relaxed"
                rows={1}
                style={{ minHeight: "60px", maxHeight: "180px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
                }}
              />
              
              {/* Send button */}
              <button 
                onClick={() => {
                  if (chatInput.trim() && onStartChat) {
                    onStartChat(chatInput.trim());
                  }
                }}
                disabled={!chatInput.trim()}
                className={`absolute right-4 bottom-4 w-9 h-9 ${
                  chatInput.trim()
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    : 'bg-zinc-300 text-zinc-500'
                } rounded-xl flex items-center justify-center transition-colors disabled:cursor-not-allowed shadow-sm`}
              >
                <ArrowUp01Icon size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mb-8 space-y-3">
            <div className="flex gap-2 justify-start overflow-x-auto">
              <button
                onClick={() => handleActionClick("create")}
                className={`px-3 py-1.5 bg-transparent border rounded-md text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  expandedAction === "create"
                    ? "border-blue-600 bg-blue-600/10 text-blue-400"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 text-gray-400 hover:text-gray-200"
                }`}
              >
                Create project
              </button>
              <button
                onClick={() => handleActionClick("open")}
                className={`px-3 py-1.5 bg-transparent border rounded-md text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  expandedAction === "open"
                    ? "border-blue-600 bg-blue-600/10 text-blue-400"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 text-gray-400 hover:text-gray-200"
                }`}
              >
                Open project
              </button>
            </div>

            {/* Expanded Template Selection */}
            {expandedAction === "create" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">Choose a template</h3>
                  <button onClick={() => setExpandedAction(null)} className="text-gray-400 hover:text-white text-sm">
                    ✕
                  </button>
                </div>
                
                {/* Folder Selection */}
                {folders.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-2 block">Save to folder (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 bg-zinc-800/50 text-gray-300 border border-zinc-700 hover:border-zinc-600"
                        >
                          {getFolderIcon(folder.name)}
                          {folder.name}
                        </button>
                      ))}
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
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">Your projects</h3>
                  <button onClick={() => setExpandedAction(null)} className="text-gray-400 hover:text-white text-sm">
                    ✕
                  </button>
                </div>
                {recentChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No projects yet. Create your first one!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentChats.map((chat) => {
                      const isChatOnly = chat.title.startsWith("Chat -") || 
                                        (!chat.nodes_json || chat.nodes_json === "[]");
                      
                      return (
                        <div
                          key={chat.id}
                          className="w-full p-3 bg-zinc-800/50 border border-zinc-700 hover:border-blue-600 rounded-lg transition-all group cursor-pointer"
                          onClick={() => handleProjectSelect(chat.id, 'chat')}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProjectSelect(chat.id, 'chat');
                                  }}
                                  className="hover:bg-blue-600/20 rounded p-0.5 transition-colors"
                                  title="Open chat"
                                >
                                  <BubbleChatIcon size={14} className="text-gray-500 group-hover:text-blue-400" strokeWidth={2} />
                                </button>
                                {!isChatOnly && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProjectSelect(chat.id, 'mindmap');
                                    }}
                                    className="hover:bg-blue-600/20 rounded p-0.5 transition-colors"
                                    title="Open mind map"
                                  >
                                    <WorkflowSquare04Icon size={14} className="text-gray-500 group-hover:text-blue-400" strokeWidth={2} />
                                  </button>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-white group-hover:text-blue-400 truncate">
                                  {chat.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatTimeAgo(chat.updated_at)}
                                </div>
                              </div>
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-400">→</span>
                          </div>
                        </div>
                      );
                    })}
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
                {recentChats.slice(0, 3).map((chat) => {
                  const isChatOnly = chat.title.startsWith("Chat -") || 
                                    (!chat.nodes_json || chat.nodes_json === "[]");
                  
                  return (
                    <div
                      key={chat.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer relative group"
                      onClick={() => handleProjectSelect(chat.id, 'chat')}
                    >
                      <div className="mb-2 flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectSelect(chat.id, 'chat');
                          }}
                          className="hover:bg-blue-50 rounded p-1 transition-colors"
                          title="Open chat"
                        >
                          <BubbleChatIcon size={18} className="text-gray-400 group-hover:text-blue-500" strokeWidth={2} />
                        </button>
                        {!isChatOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectSelect(chat.id, 'mindmap');
                            }}
                            className="hover:bg-blue-50 rounded p-1 transition-colors"
                            title="Open mind map"
                          >
                            <WorkflowSquare04Icon size={18} className="text-gray-400 group-hover:text-blue-500" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-zinc-900 mb-1 line-clamp-1">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(chat.updated_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

