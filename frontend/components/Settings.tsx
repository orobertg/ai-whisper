"use client";
import { useState, useEffect } from "react";
import { Settings02Icon } from "@hugeicons/react";

type Theme = "light" | "dark" | "system";

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [customBackground, setCustomBackground] = useState(false);
  const [chatColor, setChatColor] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedBackground = localStorage.getItem("customBackground") === "true";
    const savedChatColor = localStorage.getItem("chatColor") === "true";
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
    
    setCustomBackground(savedBackground);
    setChatColor(savedChatColor);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("customBackground", String(customBackground));
    localStorage.setItem("chatColor", String(chatColor));
    applyTheme(theme);
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    // Reset to saved values
    const savedTheme = localStorage.getItem("theme") as Theme || "system";
    const savedBackground = localStorage.getItem("customBackground") === "true";
    const savedChatColor = localStorage.getItem("chatColor") === "true";
    
    setTheme(savedTheme);
    setCustomBackground(savedBackground);
    setChatColor(savedChatColor);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={handleCancel}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900">
            <Settings02Icon size={20} strokeWidth={2} />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-8">
          {/* Interface Theme Section */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-zinc-900">Interface Theme</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Select or customize your UI theme</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* System Preference */}
              <button
                onClick={() => handleThemeChange("system")}
                className={`group relative rounded-2xl border-2 transition-all overflow-hidden ${
                  theme === "system"
                    ? "border-blue-500 shadow-md"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200 p-3">
                  {/* Preview mockup */}
                  <div className="h-full bg-white/80 backdrop-blur-sm rounded-lg p-2 space-y-1.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-zinc-200 rounded w-3/4"></div>
                      <div className="h-1.5 bg-zinc-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-zinc-800 rounded p-1.5 space-y-0.5">
                      <div className="h-1 bg-zinc-600 rounded w-full"></div>
                      <div className="h-1 bg-zinc-600 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-700">System preference</span>
                  </div>
                </div>
              </button>

              {/* Light Mode */}
              <button
                onClick={() => handleThemeChange("light")}
                className={`group relative rounded-2xl border-2 transition-all overflow-hidden ${
                  theme === "light"
                    ? "border-blue-500 shadow-md"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="aspect-[4/3] bg-white p-3">
                  {/* Preview mockup - light */}
                  <div className="h-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 space-y-1.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-zinc-200 rounded w-3/4"></div>
                      <div className="h-1.5 bg-zinc-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-zinc-100 border border-zinc-200 rounded p-1.5 space-y-0.5">
                      <div className="h-1 bg-zinc-300 rounded w-full"></div>
                      <div className="h-1 bg-zinc-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-700">Light mode</span>
                  </div>
                </div>
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => handleThemeChange("dark")}
                className={`group relative rounded-2xl border-2 transition-all overflow-hidden ${
                  theme === "dark"
                    ? "border-blue-500 shadow-md"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="aspect-[4/3] bg-zinc-900 p-3">
                  {/* Preview mockup - dark */}
                  <div className="h-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 space-y-1.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-zinc-600 rounded w-3/4"></div>
                      <div className="h-1.5 bg-zinc-600 rounded w-1/2"></div>
                    </div>
                    <div className="bg-zinc-700 border border-zinc-600 rounded p-1.5 space-y-0.5">
                      <div className="h-1 bg-zinc-500 rounded w-full"></div>
                      <div className="h-1 bg-zinc-500 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-700">Dark</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Background Option */}
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-medium text-zinc-900">Background</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Customize your background</p>
            </div>
            <button
              onClick={() => {
                setCustomBackground(!customBackground);
                setHasChanges(true);
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                customBackground ? "bg-blue-500" : "bg-zinc-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  customBackground ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Chat Color Option */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="text-sm font-medium text-zinc-900">Chat Color</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Customize your chat</p>
            </div>
            <button
              onClick={() => {
                setChatColor(!chatColor);
                setHasChanges(true);
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                chatColor ? "bg-blue-500" : "bg-zinc-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  chatColor ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-5 py-2 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
