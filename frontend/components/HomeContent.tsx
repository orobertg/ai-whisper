"use client";
import { useState, useEffect, useRef } from "react";
import { Template, TEMPLATES } from "@/lib/templates";
import CustomSelect from "./CustomSelect";
import { getModelsWithStatus, getProviderFromModel } from "@/lib/providerUtils";
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
  onOpenSettings?: (provider?: string) => void;
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
  hasWallpaper?: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
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
  recentChats,
  hasWallpaper = false,
  selectedModel,
  onModelChange
}: HomeContentProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Available model options
  const modelOptions = [
    "Ollama - Llama 3.2",
    "OpenAI - GPT-4",
    "Anthropic - Claude 3.5",
    "DeepSeek - Coder V2"
  ];
  
  // Handle unconfigured model selection - redirect to settings with provider
  const handleUnconfiguredModel = (modelName: string) => {
    const providerKey = getProviderFromModel(modelName);
    if (providerKey && onOpenSettings) {
      // Open settings directly to the provider's configuration page
      onOpenSettings(providerKey);
    }
  };

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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

  // Adaptive styling based on wallpaper theme OR system theme when no wallpaper
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    // Initialize theme from localStorage on first render
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      
      if (savedTheme === 'light') {
        return 'light';
      } else if (savedTheme === 'dark') {
        return 'dark';
      } else if (savedTheme === 'system' || !savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      }
    }
    return 'dark'; // fallback
  });
  
  // Check theme from localStorage and DOM on mount and when it changes
  useEffect(() => {
    const checkTheme = () => {
      // First, check localStorage for user's theme preference
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      
      console.log('🎨 HomeContent checking theme:', savedTheme);
      
      if (savedTheme === 'light') {
        console.log('🎨 Setting light theme');
        setSystemTheme('light');
      } else if (savedTheme === 'dark') {
        console.log('🎨 Setting dark theme');
        setSystemTheme('dark');
      } else if (savedTheme === 'system' || !savedTheme) {
        // If system theme or not set, check OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('🎨 Using system theme, prefers dark:', prefersDark);
        setSystemTheme(prefersDark ? 'dark' : 'light');
      }
    };
    
    checkTheme();
    
    // Watch for theme changes in DOM
    const observer = new MutationObserver(() => {
      console.log('🎨 DOM mutation detected, rechecking theme');
      checkTheme();
    });
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Listen for custom theme change event from Settings
    const handleThemeChange = () => {
      console.log('🎨 Theme change event received');
      checkTheme();
    };
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  
  // Use the user's chosen theme (light or dark) regardless of wallpaper
  // Wallpaper is just a background - user controls the theme
  const isLight = systemTheme === 'light';
  
  // Theme detection working correctly - debug logs removed
  
  const headerClass = "h-14 px-6 flex items-center justify-end";
  
  const textClass = isLight ? "text-zinc-900" : "text-white";
  const subtitleClass = isLight ? "text-zinc-700" : "text-white font-medium";
  
  // Button styles - different for wallpaper vs no wallpaper
  const buttonBaseClass = hasWallpaper
    ? isLight
      ? "bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 shadow-lg"
      : "bg-zinc-800/90 backdrop-blur-md shadow-xl border-2 border-white/30 hover:border-white/50 hover:bg-zinc-700/90 text-white font-semibold"
    : isLight
      ? "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900"
      : "bg-zinc-900 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-100 hover:text-white";
  
  const buttonActiveClass = hasWallpaper
    ? isLight
      ? "bg-blue-600 border-blue-600 text-white font-semibold shadow-lg"
      : "bg-blue-500/40 border-2 border-blue-400 text-white font-bold shadow-xl backdrop-blur-md"
    : isLight
      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
      : "bg-blue-500/20 border-blue-500 text-blue-400 font-semibold";
  
  // Panel and card styles
  const expandedPanelClass = hasWallpaper
    ? isLight
      ? "bg-white border border-zinc-200 rounded-xl p-4 shadow-xl"
      : "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl"
    : isLight
      ? "bg-white border border-zinc-200 rounded-xl p-4 shadow-lg"
      : "bg-zinc-900/50 border border-zinc-800 rounded-xl p-4";
  
  const cardClass = hasWallpaper
    ? isLight
      ? "bg-white border border-zinc-200 hover:border-blue-500 hover:shadow-md rounded-lg transition-all group cursor-pointer"
      : "bg-white/15 backdrop-blur-lg border-2 border-white/40 hover:border-white/70 hover:bg-white/25 rounded-lg transition-all group cursor-pointer shadow-2xl"
    : isLight
      ? "bg-white border border-zinc-200 hover:border-blue-500 hover:shadow-md rounded-lg transition-all group cursor-pointer"
      : "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70 rounded-lg transition-all group cursor-pointer";
  
  const inputClass = hasWallpaper
    ? isLight
      ? "bg-white border border-zinc-300 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
      : "bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-white"
    : isLight
      ? "bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
      : "bg-zinc-900 border border-zinc-700 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-white";
  
  const panelTextClass = hasWallpaper
    ? isLight ? "text-zinc-900" : "text-white font-semibold"
    : isLight ? "text-zinc-900" : "text-zinc-100";
    
  const panelSubtextClass = hasWallpaper
    ? isLight ? "text-zinc-700" : "text-white/90"
    : isLight ? "text-zinc-600" : "text-zinc-400";
    
  const iconHoverClass = hasWallpaper
    ? isLight ? "text-zinc-600 group-hover:text-blue-600" : "text-white/90 group-hover:text-white"
    : isLight ? "text-zinc-600 group-hover:text-blue-600" : "text-zinc-400 group-hover:text-zinc-200";

  return (
    <div className="flex-1 flex flex-col">
      {/* Header - floating buttons only */}
      <header className={headerClass}>
        <div className="flex items-center gap-3">
          {/* AI Model Selector */}
          <div className="min-w-[200px]">
            <CustomSelect
              value={selectedModel}
              onChange={onModelChange}
              options={getModelsWithStatus(modelOptions)}
              placeholder="Select a model"
              isDark={!isLight}
              onSelectUnconfigured={handleUnconfiguredModel}
            />
          </div>
          <button
            onClick={() => onOpenSettings && onOpenSettings()}
            className={`p-2 rounded-lg transition-colors ${
              hasWallpaper
                ? isLight
                  ? "bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 shadow-lg"
                  : "bg-zinc-900/90 backdrop-blur-md border border-white/30 hover:bg-zinc-800/90 text-zinc-100 hover:text-white shadow-lg"
                : isLight
                  ? "bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
                  : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-100 hover:text-white"
            }`}
            title="Settings"
          >
            <Settings02Icon size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Main Content - Centered Layout */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-2xl w-full">
          {/* Greeting */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">{greetingIcon}</div>
            <h1 className={`text-4xl font-bold mb-2 drop-shadow-lg ${textClass}`}>
              {greeting}, {userName}
            </h1>
            <p className={`text-lg drop-shadow-md ${subtitleClass}`}>What would you like to work on today?</p>
          </div>

          {/* Chat Input Box - Consistent with chat screen */}
          <div className="mb-6">
            <div className={`relative ${inputClass}`}>
              {/* Active model display */}
              <div className={`flex items-center gap-2 px-4 pt-3 pb-2 ${isLight ? 'border-b border-zinc-200' : 'border-b border-zinc-700'}`}>
                <CheckmarkCircle02Icon size={16} className="text-green-500" strokeWidth={2} />
                <span className={`text-xs font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {selectedModel}
                </span>
                <div className="flex-1"></div>
              </div>
              
              {/* Text input area */}
              <textarea
                ref={textareaRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && chatInput.trim() && onStartChat) {
                    e.preventDefault();
                    onStartChat(chatInput.trim());
                  }
                }}
                placeholder="Tell me about your project (Press Enter to send, Shift+Enter for new line)"
                className={`w-full px-6 py-4 bg-transparent ${isLight ? 'text-zinc-900' : 'text-white'} ${isLight ? 'placeholder-zinc-400' : 'placeholder-zinc-500'} text-[15px] focus:outline-none resize-none leading-relaxed`}
                rows={1}
                autoFocus
                style={{ 
                  minHeight: "60px", 
                  maxHeight: "180px",
                  color: isLight ? '#18181b' : '#ffffff',
                  caretColor: isLight ? '#18181b' : '#ffffff'
                }}
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
                    ? isLight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    : isLight
                      ? 'bg-zinc-200 text-zinc-400'
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
                  expandedAction === "create" ? buttonActiveClass : buttonBaseClass
                }`}
              >
                Create project
              </button>
              <button
                onClick={() => handleActionClick("open")}
                className={`px-3 py-1.5 bg-transparent border rounded-md text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  expandedAction === "open" ? buttonActiveClass : buttonBaseClass
                }`}
              >
                Open project
              </button>
            </div>

            {/* Expanded Template Selection */}
            {expandedAction === "create" && (
              <div className={expandedPanelClass}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${panelTextClass}`}>Choose a template</h3>
                  <button onClick={() => setExpandedAction(null)} className={`${panelSubtextClass} hover:${panelTextClass} text-sm`}>
                    ✕
                  </button>
                </div>
                
                {/* Folder Selection */}
                {folders.length > 0 && (
                  <div className="mb-4">
                    <label className={`text-xs mb-2 block ${panelSubtextClass}`}>Save to folder (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            hasWallpaper
                              ? "bg-zinc-800/50 text-zinc-100 border border-zinc-700 hover:border-zinc-600"
                              : isLight
                                ? "bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300"
                                : "bg-zinc-900 text-zinc-100 border border-zinc-700 hover:border-zinc-600"
                          }`}
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
                      className={`text-left p-3 ${cardClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${panelTextClass} group-hover:text-blue-600`}>
                            {template.name}
                          </div>
                          <div className={`text-xs ${panelSubtextClass} mt-1 line-clamp-2`}>
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
              <div className={expandedPanelClass}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${panelTextClass}`}>Your projects</h3>
                  <button onClick={() => setExpandedAction(null)} className={`${panelSubtextClass} hover:${panelTextClass} text-sm`}>
                    ✕
                  </button>
                </div>
                {recentChats.length === 0 ? (
                  <div className={`text-center py-8 text-sm ${panelSubtextClass}`}>
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
                          className={`w-full p-3 ${cardClass}`}
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
                                  <BubbleChatIcon size={14} className={iconHoverClass} strokeWidth={2} />
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
                                    <WorkflowSquare04Icon size={14} className={iconHoverClass} strokeWidth={2} />
                                  </button>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm ${panelTextClass} group-hover:text-blue-600 truncate`}>
                                  {chat.title}
                                </div>
                                <div className={`text-xs ${panelSubtextClass} mt-1`}>
                                  {formatTimeAgo(chat.updated_at)}
                                </div>
                              </div>
                            </div>
                            <span className={panelSubtextClass}>→</span>
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
            <div className={
              hasWallpaper 
                ? isLight 
                  ? "bg-white rounded-xl p-4 shadow-lg" 
                  : "bg-zinc-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl"
                : isLight
                  ? ""
                  : ""
            }>
              <div className="flex items-center gap-2 mb-4">
                <MessageAdd02Icon size={16} className={panelSubtextClass} strokeWidth={2} />
                <h3 className={`text-sm font-medium ${panelTextClass}`}>Your recent chats</h3>
                <span className={panelSubtextClass}>›</span>
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
                            className={`rounded p-1 transition-colors ${isLight ? 'hover:bg-blue-50' : 'hover:bg-zinc-700'}`}
                          title="Open chat"
                        >
                          <BubbleChatIcon size={18} className={`${isLight ? 'text-zinc-500' : 'text-gray-400'} group-hover:text-blue-500`} strokeWidth={2} />
                        </button>
                        {!isChatOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectSelect(chat.id, 'mindmap');
                            }}
                            className={`rounded p-1 transition-colors ${isLight ? 'hover:bg-blue-50' : 'hover:bg-zinc-700'}`}
                            title="Open mind map"
                          >
                            <WorkflowSquare04Icon size={18} className={`${isLight ? 'text-zinc-500' : 'text-gray-400'} group-hover:text-blue-500`} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                      <h4 className={`text-sm font-medium mb-1 line-clamp-1 ${panelTextClass}`}>
                        {chat.title}
                      </h4>
                      <p className={`text-xs ${panelSubtextClass}`}>
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

