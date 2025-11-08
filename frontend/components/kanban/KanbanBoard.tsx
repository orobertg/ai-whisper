"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { TaskDaily02Icon, Add01Icon } from "@hugeicons/react";

export default function KanbanBoard({ 
  projectId 
}: { 
  projectId?: number 
}) {
  const { getCardClass, getTextClass, isLight } = useTheme();
  
  return (
    <div className={`flex-1 flex flex-col h-full ${isLight ? 'bg-zinc-50' : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'}`}>
      {/* Header */}
      <div className={`border-b ${isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <TaskDaily02Icon size={24} strokeWidth={2} className={getTextClass('primary')} />
          <div>
            <h1 className={`${getTextClass('primary')} text-2xl font-bold`}>
              Kanban Board
            </h1>
            <p className={`${getTextClass('muted')} text-sm mt-0.5`}>
              Visual project management (Coming in Phase 2)
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 flex items-center justify-center p-6 ${isLight ? 'bg-zinc-50' : ''}`}>
        <div className={`${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'} border rounded-2xl p-12 max-w-2xl text-center shadow-lg`}>
          <div className="mb-6">
            <TaskDaily02Icon 
              size={64} 
              strokeWidth={1.5} 
              className={`${getTextClass('muted')} mx-auto`} 
            />
          </div>
          
          <h2 className={`${getTextClass('primary')} text-2xl font-bold mb-3`}>
            Kanban Board Coming Soon!
          </h2>
          
          <p className={`${getTextClass('secondary')} mb-6 max-w-md mx-auto`}>
            We're building a powerful Kanban board with drag-and-drop task management,
            AI-powered task generation from mind maps, and full integration with your
            projects and folders.
          </p>
          
          <div className={`${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-800/50 border-zinc-700'} border rounded-xl p-6 text-left`}>
            <h3 className={`${getTextClass('primary')} font-semibold mb-3`}>
              Planned Features:
            </h3>
            <ul className={`${getTextClass('secondary')} text-sm space-y-2`}>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Drag-and-drop task cards between columns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Priority badges, tags, and progress tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Convert mind maps into actionable tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Comments and file attachments on tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Full theme support (light/dark/wallpapers)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Per-project custom columns and workflows</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8">
            <p className={`${getTextClass('muted')} text-sm`}>
              Implementation Timeline: 3-4 weeks
            </p>
            <p className={`${getTextClass('muted')} text-xs mt-1`}>
              Phase 1: Theme System ✅ | Phase 2: Backend & UI 🚧 | Phase 3: AI Integration 📋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

