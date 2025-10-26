"use client";
import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Add01Icon, Delete02Icon } from '@hugeicons/react';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoNodeData = {
  label: string;
  todos?: TodoItem[];
};

function TodoNode({ id, data, selected }: NodeProps<TodoNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [todos, setTodos] = useState<TodoItem[]>(data.todos || []);
  const [newTodoText, setNewTodoText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (label !== data.label) {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: label.trim() || data.label } }
            : node
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    updateNodeTodos(updatedTodos);
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
    updateNodeTodos(updatedTodos);
  };

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newTodoText.trim(),
        completed: false,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setNewTodoText('');
      updateNodeTodos(updatedTodos);
    }
  };

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const updateNodeTodos = (updatedTodos: TodoItem[]) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, todos: updatedTodos } }
          : node
      )
    );
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="shadow-lg rounded-lg bg-orange-500 border-2 border-orange-600 min-w-[250px] max-w-[400px] hover:shadow-xl transition-shadow overflow-hidden">
      <NodeResizer 
        isVisible={selected} 
        minWidth={250} 
        minHeight={150}
        maxWidth={600}
        maxHeight={800}
        color="#f97316"
        handleStyle={{ width: '8px', height: '8px', borderRadius: '2px' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 !bg-orange-300 !border-2 !border-orange-700 hover:!bg-orange-200 hover:scale-125 transition-transform"
        style={{ left: -8 }}
      />
      
      {/* Fixed header area */}
      <div className="px-4 py-3 border-b border-orange-600/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="text-white font-semibold text-sm mb-1 bg-orange-600 border border-orange-400 rounded px-1 w-full outline-none"
              />
            ) : (
              <div 
                className="text-white font-semibold text-sm mb-1 cursor-text hover:bg-orange-600 hover:bg-opacity-30 rounded px-1 -mx-1"
                onDoubleClick={handleDoubleClick}
                title="Double-click to edit"
              >
                ✓ {data.label}
              </div>
            )}
          </div>
          <span className="text-orange-200 text-xs flex-shrink-0">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="px-4 py-3 max-h-[300px] overflow-y-auto scrollbar-thin">
        {/* Todo List */}
        <div className="space-y-2 mb-3">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className="flex items-start gap-2 group hover:bg-orange-600 hover:bg-opacity-20 rounded px-1 py-1 -mx-1"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="mt-0.5 w-4 h-4 rounded accent-orange-700 cursor-pointer flex-shrink-0"
              />
              <div 
                className={`flex-1 text-xs text-white ${
                  todo.completed ? 'line-through opacity-60' : ''
                }`}
              >
                {todo.text}
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-200 hover:text-white flex-shrink-0"
                title="Delete todo"
              >
                <Delete02Icon size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Add new todo */}
        <div className="flex items-center gap-2 border-t border-orange-600/30 pt-2">
          <input
            ref={newTodoRef}
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleNewTodoKeyDown}
            placeholder="Add new task..."
            className="flex-1 text-xs bg-orange-600 text-white placeholder-orange-300 border border-orange-400 rounded px-2 py-1 outline-none"
          />
          <button
            onClick={handleAddTodo}
            disabled={!newTodoText.trim()}
            className="text-white hover:text-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Add todo"
          >
            <Add01Icon size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 !bg-orange-300 !border-2 !border-orange-700 hover:!bg-orange-200 hover:scale-125 transition-transform"
        style={{ right: -8 }}
      />
    </div>
  );
}

export default memo(TodoNode);

