"use client";
import { useState, useEffect } from "react";
import { Settings02Icon, AiNetworkIcon, CheckmarkCircle02Icon } from "@hugeicons/react";
import ProviderSettings from "./ProviderSettings";
import { analyzeImageBrightness } from "@/lib/imageAnalyzer";

type Theme = "light" | "dark" | "system";

type SettingsTab = "appearance" | "providers";

type Wallpaper = {
  id: string;
  name: string;
  image: string;
  brightness?: number;
  isLight?: boolean;
  blur?: number;
};

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
  initialProvider?: string;
};

export default function Settings({ isOpen, onClose, initialTab, initialProvider }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab || "appearance");
  const [theme, setTheme] = useState<Theme>("system");
  const [customBackground, setCustomBackground] = useState(false);
  const [chatColor, setChatColor] = useState(false);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [selectedWallpaperId, setSelectedWallpaperId] = useState<string | null>(null);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [providerHasChanges, setProviderHasChanges] = useState(false);

  // Handle initial tab and provider selection
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      if (initialProvider) {
        setActiveTab("providers");
      }
    }
  }, [isOpen, initialTab, initialProvider]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedBackground = localStorage.getItem("customBackground") === "true";
    const savedChatColor = localStorage.getItem("chatColor") === "true";
    const savedWallpapers = localStorage.getItem("chatWallpapers");
    const savedSelectedId = localStorage.getItem("selectedWallpaperId");
    const savedBlur = localStorage.getItem("wallpaperBlur");
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
    
    setCustomBackground(savedBackground);
    setChatColor(savedChatColor);
    
    if (savedWallpapers) {
      try {
        setWallpapers(JSON.parse(savedWallpapers));
      } catch (e) {
        console.error("Failed to parse wallpapers:", e);
      }
    }
    
    setSelectedWallpaperId(savedSelectedId);
    
    if (savedBlur) {
      setWallpaperBlur(Number(savedBlur));
    }
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
    applyTheme(newTheme); // Apply immediately for preview
    setHasChanges(true);
    
    // Dispatch event to notify other components of theme change
    window.dispatchEvent(new Event('themeChanged'));
  };

  const handleSaveChanges = () => {
    if (activeTab === "appearance") {
    localStorage.setItem("theme", theme);
    localStorage.setItem("customBackground", String(customBackground));
    localStorage.setItem("chatColor", String(chatColor));
      localStorage.setItem("chatWallpapers", JSON.stringify(wallpapers));
      localStorage.setItem("wallpaperBlur", String(wallpaperBlur));
      
      if (selectedWallpaperId && selectedWallpaperId !== 'null') {
        localStorage.setItem("selectedWallpaperId", selectedWallpaperId);
        const selectedWallpaper = wallpapers.find(w => w.id === selectedWallpaperId);
        console.log("🎨 Saving wallpaper:", selectedWallpaper?.name, "ID:", selectedWallpaperId);
        // Dispatch event with full wallpaper data including brightness
        window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { 
          detail: selectedWallpaper || null 
        }));
      } else {
        console.log("🎨 Removing wallpaper - clearing localStorage");
        localStorage.removeItem("selectedWallpaperId");
        window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { detail: null }));
      }
      
    applyTheme(theme);
    setHasChanges(false);
      
      // Dispatch event to notify other components of theme change
      window.dispatchEvent(new Event('themeChanged'));
    } else if (activeTab === "providers") {
      // Call the provider settings save function
      if ((window as any).__providerSettingsSave) {
        (window as any).__providerSettingsSave();
        setProviderHasChanges(false);
      }
    }
    // Don't close - let user continue configuring or manually close
  };

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      // Generate a default name from filename
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const name = fileName.length > 30 ? fileName.substring(0, 30) + "..." : fileName;
      
      try {
        // Analyze image brightness
        const analysis = await analyzeImageBrightness(base64);
        
        // Add to wallpapers array with brightness data
        const newWallpaper: Wallpaper = {
          id: Date.now().toString(),
          name: name,
          image: base64,
          brightness: analysis.brightness,
          isLight: analysis.isLight
        };
        
        console.log(`✅ Wallpaper "${name}" uploaded - ${analysis.isLight ? 'Light' : 'Dark'} theme (brightness: ${analysis.brightness})`);
        
        const updatedWallpapers = [...wallpapers, newWallpaper];
        setWallpapers(updatedWallpapers);
        setSelectedWallpaperId(newWallpaper.id);
        setHasChanges(true);
      } catch (error) {
        console.error('Failed to analyze wallpaper:', error);
        // Fallback: add without analysis (assume dark)
        const newWallpaper: Wallpaper = {
          id: Date.now().toString(),
          name: name,
          image: base64,
          brightness: 100,
          isLight: false
        };
        
        const updatedWallpapers = [...wallpapers, newWallpaper];
        setWallpapers(updatedWallpapers);
        setSelectedWallpaperId(newWallpaper.id);
        setHasChanges(true);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleRemoveWallpaper = (id: string) => {
    const updatedWallpapers = wallpapers.filter(w => w.id !== id);
    setWallpapers(updatedWallpapers);
    
    if (selectedWallpaperId === id) {
      setSelectedWallpaperId(null);
    }
    
    setHasChanges(true);
  };

  const handleSelectWallpaper = (id: string | null) => {
    setSelectedWallpaperId(id);
    setHasChanges(true);
  };

  const handleClose = () => {
    // Just close without resetting - settings are already saved or user doesn't care
    setHasChanges(false);
    setProviderHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={handleClose}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full mx-4 ${
        activeTab === "providers" ? "max-w-4xl" : "max-w-xl"
      }`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900">
            <Settings02Icon size={20} strokeWidth={2} />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-zinc-200">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "appearance"
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Appearance
            {activeTab === "appearance" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === "providers"
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <AiNetworkIcon size={16} strokeWidth={2} />
            AI Providers
            {activeTab === "providers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
            )}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className={`px-6 py-6 ${activeTab === "providers" ? "" : "space-y-8"}`}>
          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <>
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
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
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

          {/* Chat Wallpaper Section - Only show when Background is enabled */}
          {customBackground && (
            <div className="py-3">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-zinc-900">Chat Wallpapers</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Select or upload custom backgrounds for the chat area</p>
              </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* None Option */}
              <button
                onClick={() => handleSelectWallpaper(null)}
                className={`group relative rounded-2xl border-2 transition-all overflow-hidden ${
                  selectedWallpaperId === null
                    ? "border-blue-500 shadow-md"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center relative">
                  <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {/* Checkmark for selected */}
                  {selectedWallpaperId === null && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckmarkCircle02Icon size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                  <p className="text-xs font-medium text-zinc-700 text-center truncate">
                    None
                  </p>
                </div>
              </button>

              {/* Existing Wallpapers */}
              {wallpapers.map((wallpaper) => (
                <div
                  key={wallpaper.id}
                  className={`group relative rounded-2xl border-2 transition-all overflow-hidden ${
                    selectedWallpaperId === wallpaper.id
                      ? "border-blue-500 shadow-md"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <button
                    onClick={() => handleSelectWallpaper(wallpaper.id)}
                    className="w-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={wallpaper.image} 
                        alt={wallpaper.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkmark for selected wallpaper */}
                      {selectedWallpaperId === wallpaper.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckmarkCircle02Icon size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                      <p className="text-xs font-medium text-zinc-700 text-center truncate">
                        {wallpaper.name}
                      </p>
                    </div>
                  </button>
                  
                  {/* Remove button - only shows on hover when NOT selected */}
                  {selectedWallpaperId !== wallpaper.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWallpaper(wallpaper.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                      title="Remove wallpaper"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {/* Upload New Wallpaper */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
                <div className="group relative rounded-2xl border-2 border-dashed border-zinc-300 hover:border-zinc-400 transition-all overflow-hidden cursor-pointer">
                  <div className="aspect-[4/3] bg-zinc-50 flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-zinc-400 group-hover:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <p className="text-xs font-medium text-zinc-500 group-hover:text-zinc-600">Add New</p>
                  </div>
                  <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                    <p className="text-xs font-medium text-zinc-500 text-center">
                      Upload
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Blur Control - Only show when a wallpaper is selected */}
            {selectedWallpaperId && selectedWallpaperId !== 'null' && (
              <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">Wallpaper Blur</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Add blur effect to wallpaper</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{wallpaperBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={wallpaperBlur}
                  onChange={(e) => {
                    setWallpaperBlur(Number(e.target.value));
                    setHasChanges(true);
                  }}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>No blur</span>
                  <span>Maximum</span>
                </div>
              </div>
            )}
          </div>
          )}
            </>
          )}

          {/* AI Providers Tab */}
          {activeTab === "providers" && (
            <ProviderSettings 
              onHasChanges={setProviderHasChanges}
              initialProvider={initialProvider}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 flex justify-end items-center gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={activeTab === "appearance" ? !hasChanges : !providerHasChanges}
            className={`px-6 py-2 text-sm font-medium rounded-xl transition-colors ${
              (activeTab === "appearance" ? hasChanges : providerHasChanges)
                ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
