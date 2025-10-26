"use client";
import { useState, useEffect, useCallback } from "react";
import MindMap from "@/components/MindMap";
import ChatPanel from "@/components/ChatPanel";
import Sidebar from "@/components/Sidebar";
import HomeContent from "@/components/HomeContent";
import Settings from "@/components/Settings";
import { Template, TEMPLATES } from "@/lib/templates";
import { calculateProgress } from "@/lib/progress";
import { Node, Edge } from "reactflow";
import { AiNetworkIcon, Settings02Icon, Home01Icon, FloppyDiskIcon, Menu01Icon, Cancel01Icon, MessageMultiple01Icon, HierarchyIcon, SidebarRight01Icon } from "@hugeicons/react";

type ViewMode = "home" | "editor";

type MindMapData = {
  id?: number;
  title: string;
  template_id: string;
  nodes_json: string;
  edges_json: string;
};

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
};

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [currentMindMap, setCurrentMindMap] = useState<MindMapData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatFocusMode, setChatFocusMode] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null);
  const [currentChatHistory, setCurrentChatHistory] = useState<any[]>([]);

  // Calculate progress metrics
  const progressMetrics = selectedTemplate 
    ? calculateProgress(nodes, selectedTemplate)
    : { completeness: 0, successProbability: 0, missingItems: [], nodeTypeCounts: {} };

  // Load folders and chats
  useEffect(() => {
    loadFolders();
    loadRecentChats();
  }, []);

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
      const url = selectedFolderId 
        ? `http://localhost:8000/mindmaps/?folder_id=${selectedFolderId}`
        : "http://localhost:8000/mindmaps/";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load projects");
      const data = await response.json();
      setRecentChats(data);
    } catch (error) {
      console.error("Error loading recent chats:", error);
    }
  }

  // Save function - defined early so it can be used in useEffect
  const handleSave = useCallback(async () => {
    if (!currentMindMap?.id) return;

    try {
      setIsSaving(true);
      const response = await fetch(`http://localhost:8000/mindmaps/${currentMindMap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: nodes,
          edges: edges,
        }),
      });

      if (!response.ok) throw new Error("Failed to save mind map");
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving mind map:", error);
      alert("Failed to save mind map. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [currentMindMap, nodes, edges]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentMindMap?.id || !hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, handleSave, currentMindMap]);

  const handleSelectTemplate = async (template: Template) => {
    setSelectedTemplate(template);
    setNodes(template.nodes);
    setEdges(template.edges);

    // Create new mind map in database
    try {
      const response = await fetch("http://localhost:8000/mindmaps/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${template.name} Project`,
          template_id: template.id,
          nodes: template.nodes,
          edges: template.edges,
        }),
      });

      if (!response.ok) throw new Error("Failed to create mind map");
      
      const newMindMap = await response.json();
      setCurrentMindMap(newMindMap);
      setLastSaved(new Date());
      setViewMode("editor");
    } catch (error) {
      console.error("Error creating mind map:", error);
      alert("Failed to create mind map. Please try again.");
    }
  };

  const handleSelectProject = (mindmap: MindMapData) => {
    setCurrentMindMap(mindmap);
    setNodes(JSON.parse(mindmap.nodes_json));
    setEdges(JSON.parse(mindmap.edges_json));
    
    // Find and set the template
    const template = TEMPLATES.find(t => t.id === mindmap.template_id);
    setSelectedTemplate(template || null);
    
    setViewMode("editor");
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleUpdateTitle = async (newTitle: string) => {
    if (!currentMindMap?.id || !newTitle.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/mindmaps/${currentMindMap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error("Failed to update title");
      
      setCurrentMindMap({ ...currentMindMap, title: newTitle });
    } catch (error) {
      console.error("Error updating title:", error);
      alert("Failed to update title. Please try again.");
    }
  };

  const handleBackToProjects = () => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Do you want to leave?")) return;
    }
    setViewMode("home"); // Changed from "list" to "home"
    setChatFocusMode(false); // Exit chat focus mode
    setCurrentMindMap(null);
    setSelectedTemplate(null);
    setNodes([]);
    setEdges([]);
    setCurrentChatHistory([]); // Clear chat history
    setHasUnsavedChanges(false);
  };

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
    setHasUnsavedChanges(true);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
    setHasUnsavedChanges(true);
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const diffMs = Date.now() - lastSaved.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 5) return "Saved just now";
    if (diffSecs < 60) return `Saved ${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `Saved ${diffMins}m ago`;
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  // Handle quick actions from home screen
  const handleQuickAction = async (actionId: string, folderId?: number | null) => {
    switch (actionId) {
      case "brainstorm":
        // Start a new blank project and go directly to chat focus mode (without creating session yet)
        const blankTemplate = TEMPLATES.find(t => t.id === "blank");
        if (!blankTemplate) {
          alert("Blank template not found");
          return;
        }
        
        setSelectedTemplate(blankTemplate);
        setNodes([]);
        setEdges([]);
        setViewMode("editor");
        setChatFocusMode(true);
        break;
      default:
        break;
    }
  };

  // Handler for template selection from home screen
  const handleHomeTemplateSelect = async (template: Template, folderId?: number | null) => {
    setSelectedTemplate(template);
    setNodes(template.nodes);
    setEdges(template.edges);

    // Create new mind map in database
    try {
      const response = await fetch("http://localhost:8000/mindmaps/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${template.name} Project`,
          template_id: template.id,
          nodes: template.nodes,
          edges: template.edges,
          folder_id: folderId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create mind map");
      
      const newMindMap = await response.json();
      setCurrentMindMap(newMindMap);
      setLastSaved(new Date());
      setViewMode("editor");
    } catch (error) {
      console.error("Error creating mind map:", error);
      alert("Failed to create mind map. Please try again.");
    }
  };

  // Handler for project selection from home screen
  const handleHomeProjectSelect = async (projectId: number, mode: 'chat' | 'mindmap' = 'chat') => {
    try {
      const response = await fetch(`http://localhost:8000/mindmaps/${projectId}`);
      if (!response.ok) throw new Error("Failed to load mind map");

      const mindMapData = await response.json();
      setCurrentMindMap(mindMapData);

      const template = TEMPLATES.find(t => t.id === mindMapData.template_id);
      setSelectedTemplate(template || null);

      const loadedNodes = JSON.parse(mindMapData.nodes_json || "[]");
      const loadedEdges = JSON.parse(mindMapData.edges_json || "[]");
      setNodes(loadedNodes);
      setEdges(loadedEdges);

      // Parse chat history and store it
      const chatHistory = JSON.parse(mindMapData.chat_history || "[]");
      console.log("Loading project with chat history:", chatHistory);
      setCurrentChatHistory(chatHistory); // Store chat history for view switching
      
      // Determine if we should enter chat mode
      const hasMindMapContent = loadedNodes.length > 0 || loadedEdges.length > 0;
      const hasChatHistory = chatHistory.length > 0;
      
      // Always go to editor view
      setViewMode("editor");
      
      // Determine mode based on user selection
      if (mode === 'chat') {
        // User clicked chat icon - always show chat
        setChatFocusMode(true);
        if (hasChatHistory) {
          // Pass the project ID in the resume message so ChatPanel can load from it
          setInitialChatMessage(`__RESUME__:${projectId}:${hasMindMapContent ? 'with_mindmap' : 'chat_only'}`);
        } else {
          // No chat history yet, start fresh chat
          setInitialChatMessage(null);
        }
      } else if (mode === 'mindmap' && hasMindMapContent) {
        // User explicitly clicked mind map icon - show mind map
        setChatFocusMode(false);
        setInitialChatMessage(null);
      } else {
        // Default: show chat if history exists, otherwise show mind map
        if (hasChatHistory) {
          setChatFocusMode(true);
          setInitialChatMessage(`__RESUME__:${projectId}:${hasMindMapContent ? 'with_mindmap' : 'chat_only'}`);
        } else {
          setChatFocusMode(false);
          setInitialChatMessage(null);
        }
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error loading project:", error);
      alert("Failed to load project. Please try again.");
    }
  };

  // Handler for new chat from sidebar
  const handleNewChat = () => {
    // Reset all state for a fresh start
    setCurrentMindMap(null);
    setCurrentChatHistory([]);
    setInitialChatMessage(null);
    
    // Set blank template
    const blankTemplate = TEMPLATES.find(t => t.id === "blank");
    if (blankTemplate) {
      setSelectedTemplate(blankTemplate);
      setNodes([]);
      setEdges([]);
    }
    
    // Go to chat focus mode
    setViewMode("editor");
    setChatFocusMode(true);
    setHasUnsavedChanges(false);
  };

  // Handler for starting chat from home screen
  const handleStartChat = async (message: string) => {
    // Don't create session yet - wait for first message
    const blankTemplate = TEMPLATES.find(t => t.id === "blank");
    if (!blankTemplate) {
      alert("Blank template not found");
      return;
    }
    
    setSelectedTemplate(blankTemplate);
    setNodes([]);
    setEdges([]);
    setInitialChatMessage(message);
    setViewMode("editor");
    setChatFocusMode(true);
  };

  // Handler for creating session after first message
  const handleCreateSession = async (firstMessage: string) => {
    try {
      // Generate title from first message (first 50 chars or until punctuation)
      let title = firstMessage.slice(0, 50).trim();
      const punctuationIndex = title.search(/[.!?]/);
      if (punctuationIndex > 0) {
        title = title.slice(0, punctuationIndex);
      }
      
      // If title is too short, add timestamp
      if (title.length < 10) {
        const now = new Date();
        title = `Chat - ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      const response = await fetch("http://localhost:8000/mindmaps/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          template_id: "blank",
          nodes: [],
          edges: [],
          folder_id: selectedFolderId,
          chat_history: [],  // Initialize with empty chat history
        }),
      });

      if (!response.ok) throw new Error("Failed to create mind map");
      
      const newMindMap = await response.json();
      setCurrentMindMap(newMindMap);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Reload recent chats to show the new session immediately
      loadRecentChats();
      
      return newMindMap;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  };

  // Handler for folder selection from sidebar
  const handleSelectFolder = (folderId: number | null) => {
    setSelectedFolderId(folderId);
  };

  // Editor View with chat focus mode support
  if (chatFocusMode) {
    return (
      <div className="h-screen flex bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
        {/* Sidebar with slide animation */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            showSidebar ? 'translate-x-0 w-64' : '-translate-x-full w-0'
          } flex-shrink-0 overflow-hidden`}
        >
        <Sidebar
          onNewChat={handleNewChat}
          onSelectFolder={handleSelectFolder}
          onSelectProject={handleHomeProjectSelect}
          selectedFolderId={selectedFolderId}
          currentProjectId={currentMindMap?.id}
          recentChats={recentChats}
          onReloadChats={loadRecentChats}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onGoHome={handleBackToProjects}
          showChat={false}
          nodes={nodes}
          edges={edges}
          template={selectedTemplate}
          progressMetrics={progressMetrics}
          onToggleChatFocus={() => setChatFocusMode(true)}
          onNodesChange={(newNodes) => {
            setNodes(newNodes);
            setHasUnsavedChanges(true);
          }}
          onEdgesChange={(newEdges) => {
            setEdges(newEdges);
            setHasUnsavedChanges(true);
          }}
          currentMindMapId={currentMindMap?.id}
          currentProjectTitle={currentMindMap?.title}
          onProjectRename={handleUpdateTitle}
          onChatHistoryUpdate={(history) => {
            if (currentMindMap?.id) {
              fetch(`http://localhost:8000/mindmaps/${currentMindMap.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_history: history }),
              }).catch(err => console.error("Failed to save chat history:", err));
            }
          }}
        />
        </div>
        
        {/* Floating sidebar toggle button when hidden */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed left-4 top-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-gray-300 hover:text-white transition-colors shadow-lg"
            title="Show sidebar"
          >
            <SidebarRight01Icon size={18} strokeWidth={2} />
          </button>
        )}
        
        <div className="flex-1">
          <ChatPanel
            nodes={nodes}
            edges={edges}
            template={selectedTemplate}
            progressMetrics={progressMetrics}
            isFocusMode={true}
            onToggleFocus={() => {
              setChatFocusMode(false);
              setInitialChatMessage(null); // Clear initial message when toggling
            }}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            onGoHome={() => {
              setChatFocusMode(false);
              setViewMode("home");
              setInitialChatMessage(null);
              setCurrentMindMap(null);
              setCurrentChatHistory([]); // Clear chat history when going home
            }}
            onOpenSettings={() => setShowSettings(true)}
            initialMessage={initialChatMessage}
            savedChatHistory={currentChatHistory}
            onMessageSent={() => setInitialChatMessage(null)}
            onSessionCreate={handleCreateSession}
            currentMindMapId={currentMindMap?.id}
            currentProjectTitle={currentMindMap?.title}
            onProjectRename={handleUpdateTitle}
            onChatHistoryUpdate={(history) => {
              // Store chat history locally for view switching
              setCurrentChatHistory(history);
              // Also save to backend
              if (currentMindMap?.id) {
                fetch(`http://localhost:8000/mindmaps/${currentMindMap.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chat_history: history }),
                }).catch(err => console.error("Failed to save chat history:", err));
              }
            }}
            onNodesChange={(newNodes) => {
              setNodes(newNodes);
              setHasUnsavedChanges(true);
            }}
            onEdgesChange={(newEdges) => {
              setEdges(newEdges);
              setHasUnsavedChanges(true);
            }}
          />
        </div>
        
        <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  // Main layout with persistent sidebar
  return (
    <div className="h-screen flex bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Persistent Sidebar with slide animation */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } flex-shrink-0 overflow-hidden`}
      >
        <Sidebar
          onNewChat={handleNewChat}
          onSelectFolder={handleSelectFolder}
          onSelectProject={handleHomeProjectSelect}
          selectedFolderId={selectedFolderId}
          currentProjectId={currentMindMap?.id}
          recentChats={recentChats}
          onReloadChats={loadRecentChats}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onGoHome={handleBackToProjects}
          showChat={false}
          nodes={nodes}
          edges={edges}
          template={selectedTemplate}
          progressMetrics={progressMetrics}
          onToggleChatFocus={() => setChatFocusMode(true)}
          onNodesChange={(newNodes) => {
            setNodes(newNodes);
            setHasUnsavedChanges(true);
          }}
          onEdgesChange={(newEdges) => {
            setEdges(newEdges);
            setHasUnsavedChanges(true);
          }}
          currentMindMapId={currentMindMap?.id}
          currentProjectTitle={currentMindMap?.title}
          onProjectRename={handleUpdateTitle}
          onChatHistoryUpdate={(history) => {
            if (currentMindMap?.id) {
              fetch(`http://localhost:8000/mindmaps/${currentMindMap.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_history: history }),
              }).catch(err => console.error("Failed to save chat history:", err));
            }
          }}
        />
      </div>

      {/* Floating sidebar toggle button when hidden - available on all views */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed left-4 top-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-gray-300 hover:text-white transition-colors shadow-lg"
          title="Show sidebar"
        >
          <SidebarRight01Icon size={18} strokeWidth={2} />
        </button>
      )}

      {/* Main Content Area */}
      {viewMode === "home" ? (
        <HomeContent
          onSelectAction={handleQuickAction}
          onSelectTemplate={handleHomeTemplateSelect}
          onSelectProject={handleHomeProjectSelect}
          onStartChat={handleStartChat}
          onOpenSettings={() => setShowSettings(true)}
          selectedFolderId={selectedFolderId}
          folders={folders}
          recentChats={recentChats.slice(0, 3)}
        />
      ) : (
        <main className="flex-1 flex flex-col">
          {/* Editor Header */}
      <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
              {/* Project Title */}
              <input
                type="text"
                value={currentMindMap?.title || ""}
                onChange={(e) => setCurrentMindMap({ ...currentMindMap!, title: e.target.value })}
                onBlur={(e) => handleUpdateTitle(e.target.value)}
                className="text-base font-medium bg-transparent border-none outline-none focus:bg-zinc-900 px-2 py-1 rounded text-gray-200"
              />
        </div>
            
            <div className="flex items-center gap-2">
              {/* Save Icon - subtle diskette */}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className={`p-2 rounded-lg transition-all ${
                  isSaving || !hasUnsavedChanges 
                    ? 'text-gray-600 cursor-default' 
                    : 'text-blue-400 hover:text-blue-300 hover:bg-zinc-800'
                }`}
                title={isSaving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}
              >
                <FloppyDiskIcon size={16} strokeWidth={2} />
              </button>
              
              {/* Toggle to Chat Mode */}
              <button
                onClick={() => setChatFocusMode(true)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Open AI Assistant"
              >
                <MessageMultiple01Icon size={18} strokeWidth={2} />
              </button>
              
              {/* Settings Icon */}
              <button
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Settings"
              >
                <Settings02Icon size={18} strokeWidth={2} />
              </button>
        </div>
      </div>

      {/* Main Content - Full Width for Mind Map */}
      <div className="flex-1 p-6 overflow-hidden">
        {/* Mind Map - Full space */}
        <div className="card overflow-hidden h-full">
            <MindMap
              initialNodes={nodes}
              initialEdges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            />
          </div>
      </div>
    </main>
      )}

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
