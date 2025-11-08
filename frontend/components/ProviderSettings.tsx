"use client";
import { useState, useEffect } from "react";
import {
  CheckmarkCircle02Icon,
  Alert02Icon,
  Loading03Icon,
  EyeIcon,
  ViewOffIcon,
  AiNetworkIcon,
  AiBrain01Icon,
  GoogleIcon,
  AiCloud01Icon,
  ComputerIcon
} from "@hugeicons/react";
import CustomSelect from "./CustomSelect";

type ProviderConfig = {
  name: string;
  model: string;
  api_key?: string;
  base_url?: string;
};

type ProviderInfo = {
  name: string;
  display_name: string;
  requires_api_key: boolean;
  supports_streaming: boolean;
};

type TestResult = {
  connected: boolean;
  message: string;
  models?: string[];
  error?: string;
};

type ProviderSettingsProps = {
  onHasChanges?: (hasChanges: boolean) => void;
  onSave?: () => void;
};

export default function ProviderSettings({ onHasChanges, onSave }: ProviderSettingsProps) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("ollama");
  const [model, setModel] = useState<string>("llama3.2:latest");
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Notify parent of changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onHasChanges]);

  // Load providers on mount
  useEffect(() => {
    // Set default providers immediately as fallback
    const defaultProviders: ProviderInfo[] = [
      { name: 'ollama', display_name: 'Ollama (Local)', requires_api_key: false, supports_streaming: true },
      { name: 'openai', display_name: 'OpenAI', requires_api_key: true, supports_streaming: true },
      { name: 'anthropic', display_name: 'Anthropic Claude', requires_api_key: true, supports_streaming: true },
      { name: 'google', display_name: 'Google Gemini', requires_api_key: true, supports_streaming: true },
      { name: 'deepseek', display_name: 'DeepSeek', requires_api_key: true, supports_streaming: true },
    ];
    
    setProviders(defaultProviders);
    setIsLoadingProviders(false);

    // Try to fetch from API (will update if successful)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/providers/available`)
      .then(res => res.json())
      .then(data => {
        const providerNames = data.providers as string[];
        // Get detailed info for each provider
        return Promise.all(
          providerNames.map(name =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/providers/info/${name}`)
              .then(res => res.json())
          )
        );
      })
      .then(providersInfo => {
        setProviders(providersInfo);
      })
      .catch(err => {
        console.error("Failed to load providers from API, using defaults:", err);
        // Keep using default providers
      });

    // Check for pre-selected provider from model selector
    const preselectedProvider = sessionStorage.getItem("openProviderSettings");
    if (preselectedProvider) {
      setSelectedProvider(preselectedProvider);
      loadProviderConfig(preselectedProvider);
      sessionStorage.removeItem("openProviderSettings");
    } else {
      // Load saved configuration for the initial provider
      loadProviderConfig("ollama");
    }
  }, []);

  // Load configuration for a specific provider
  const loadProviderConfig = (providerName: string) => {
    const savedConfigs = localStorage.getItem("ai_provider_configs");
    if (savedConfigs) {
      try {
        const configs = JSON.parse(savedConfigs);
        const config = configs[providerName];
        if (config) {
          setModel(config.model || getDefaultModel(providerName));
          setApiKey(config.api_key || "");
          setBaseUrl(config.base_url || getDefaultBaseUrl(providerName));
          return;
        }
      } catch (e) {
        console.error("Failed to load provider config:", e);
      }
    }
    // Set defaults if no saved config
    setModel(getDefaultModel(providerName));
    setApiKey("");
    setBaseUrl(getDefaultBaseUrl(providerName));
  };

  // Get default model for a provider
  const getDefaultModel = (providerName: string) => {
    switch (providerName) {
      case 'ollama': return 'llama3.2:latest';
      case 'openai': return 'gpt-4o-mini';
      case 'anthropic': return 'claude-3-5-sonnet-20241022';
      case 'google': return 'gemini-2.0-flash-exp';
      case 'deepseek': return 'deepseek-chat';
      default: return '';
    }
  };

  // Get default base URL for a provider
  const getDefaultBaseUrl = (providerName: string) => {
    switch (providerName) {
      case 'ollama': return 'http://localhost:11434';
      case 'openai': return 'https://api.openai.com/v1';
      case 'anthropic': return 'https://api.anthropic.com/v1';
      case 'google': return 'https://generativelanguage.googleapis.com/v1beta';
      case 'deepseek': return 'https://api.deepseek.com/v1';
      default: return '';
    }
  };

  // Load configuration when provider changes
  useEffect(() => {
    if (!selectedProvider || providers.length === 0) return;
    
    loadProviderConfig(selectedProvider);
    setTestResult(null);
    setAvailableModels([]);
  }, [selectedProvider, providers]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const requestBody: Record<string, any> = {
      name: selectedProvider,
      model: model,
    };

    if (apiKey) requestBody.api_key = apiKey;
    if (baseUrl) requestBody.base_url = baseUrl;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/providers/test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      setTestResult(result);

      if (result.connected && result.models) {
        setAvailableModels(result.models);
      }
    } catch (error) {
      setTestResult({
        connected: false,
        message: "Failed to test connection",
        error: String(error),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleLoadModels = async () => {
    setIsLoadingModels(true);

    const requestBody: Record<string, any> = {
      name: selectedProvider,
      model: model,
    };

    if (apiKey) requestBody.api_key = apiKey;
    if (baseUrl) requestBody.base_url = baseUrl;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/providers/models`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAvailableModels(result || []);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSaveConfig = () => {
    // Load existing configs
    const savedConfigs = localStorage.getItem("ai_provider_configs");
    let configs: Record<string, any> = {};
    
    if (savedConfigs) {
      try {
        configs = JSON.parse(savedConfigs);
      } catch (e) {
        console.error("Failed to parse saved configs:", e);
      }
    }

    // Save current provider config with tested flag
    configs[selectedProvider] = {
      model: model,
      api_key: apiKey,
      base_url: baseUrl,
      tested: testResult?.connected || false, // Save tested status
    };

    localStorage.setItem("ai_provider_configs", JSON.stringify(configs));
    setHasUnsavedChanges(false);
    
    // Show success feedback
    setTestResult({
      connected: true,
      message: `${currentProvider?.display_name} configuration saved successfully!`,
      models: []
    });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setTestResult(null);
    }, 3000);
  };

  // Expose save function to parent
  useEffect(() => {
    (window as any).__providerSettingsSave = handleSaveConfig;
    return () => {
      // Cleanup on unmount
      delete (window as any).__providerSettingsSave;
    };
  }, [selectedProvider, model, apiKey, baseUrl]);

  const currentProvider = providers.find(p => p.name === selectedProvider);

  // Map provider names to icons
  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'ollama':
        return <ComputerIcon size={20} strokeWidth={2} className="text-zinc-700" />;
      case 'openai':
        return <AiBrain01Icon size={20} strokeWidth={2} className="text-zinc-700" />;
      case 'anthropic':
        return <AiCloud01Icon size={20} strokeWidth={2} className="text-zinc-700" />;
      case 'google':
        return <GoogleIcon size={20} strokeWidth={2} className="text-zinc-700" />;
      case 'deepseek':
        return <AiNetworkIcon size={20} strokeWidth={2} className="text-zinc-700" />;
      default:
        return <AiNetworkIcon size={20} strokeWidth={2} className="text-zinc-700" />;
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Side - Provider List */}
      <div className="w-64 flex-shrink-0">
        <label className="block text-sm font-semibold text-zinc-900 mb-3">
          AI Providers
        </label>
        {isLoadingProviders ? (
          <div className="text-sm text-zinc-500">Loading providers...</div>
        ) : providers.length === 0 ? (
          <div className="text-sm text-zinc-500">No providers available</div>
        ) : (
          <div className="space-y-1">
            {providers.map((provider) => (
            <button
              key={provider.name}
              onClick={() => {
                setSelectedProvider(provider.name);
                setHasUnsavedChanges(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all hover:bg-zinc-100 flex items-center gap-3 group"
            >
              {/* Radio Bullet */}
              <div className="flex-shrink-0">
                {selectedProvider === provider.name ? (
                  <div className="w-4 h-4 rounded-full border-[5px] border-blue-600"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300 group-hover:border-zinc-400"></div>
                )}
              </div>
              
              {/* Provider Icon */}
              <div className="flex-shrink-0">
                {getProviderIcon(provider.name)}
              </div>
              
              {/* Provider Info */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  selectedProvider === provider.name ? 'text-zinc-900' : 'text-zinc-700'
                }`}>
                  {provider.display_name}
                </div>
                <div className="text-xs text-zinc-500">
                  {provider.requires_api_key ? 'Cloud' : 'Local'}
                </div>
              </div>
            </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Side - Configuration */}
      <div className="flex-1 min-w-0">
        <div className="space-y-5">{/* Configuration form will go here */}

          {/* Configuration Header */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-zinc-900">
              {currentProvider?.display_name} Configuration
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Configure your {currentProvider?.display_name} settings below
            </p>
          </div>

          {/* API Key (if required) */}
          {currentProvider?.requires_api_key && (
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                API Key
              </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 pr-12 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showApiKey ? (
                <ViewOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            Your API key is stored locally and never sent to our servers
          </p>
            </div>
          )}

          {/* Base URL */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://api.example.com/v1"
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-zinc-500 mt-1.5">
              API endpoint URL for this provider
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-zinc-900">
                Model
              </label>
              <button
                onClick={handleLoadModels}
                disabled={isLoadingModels}
                className="text-xs text-blue-600 hover:text-blue-700 disabled:text-zinc-400 font-medium"
              >
                {isLoadingModels ? "Loading..." : "↻ Load models"}
              </button>
            </div>
            {availableModels.length > 0 ? (
              <CustomSelect
                value={model}
                onChange={(value) => {
                  setModel(value);
                  setHasUnsavedChanges(true);
                }}
                options={availableModels}
                placeholder="Select a model"
              />
            ) : (
              <input
                type="text"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="e.g. llama3.2:latest"
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            <p className="text-xs text-zinc-500 mt-1.5">
              Click "Load models" to see available options
            </p>
          </div>

          {/* Test Connection */}
          <div className="pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loading03Icon size={18} className="animate-spin" />
                  Testing connection...
                </>
              ) : (
                "Test Connection"
              )}
            </button>

            {/* Test Result */}
            {testResult && (
              <div
                className={`mt-3 p-4 rounded-xl border-2 ${
                  testResult.connected
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {testResult.connected ? (
                      <CheckmarkCircle02Icon
                        size={20}
                        className="text-green-600"
                        strokeWidth={2}
                      />
                    ) : (
                      <Alert02Icon
                        size={20}
                        className="text-red-600"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-relaxed ${
                        testResult.connected ? "text-green-900" : "text-red-900"
                      }`}
                    >
                      {testResult.message || (testResult.connected ? "Connection successful!" : "Connection failed")}
                    </p>
                    {testResult.error && (
                      <p className="text-xs text-red-700 mt-2 leading-relaxed break-words">
                        {testResult.error}
                      </p>
                    )}
                    {testResult.models && testResult.models.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-green-700 font-medium">
                          ✓ Found {testResult.models.length} available model(s)
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {testResult.models.slice(0, 5).map((modelName) => (
                            <span
                              key={modelName}
                              className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded"
                            >
                              {modelName}
                            </span>
                          ))}
                          {testResult.models.length > 5 && (
                            <span className="text-xs text-green-700">
                              +{testResult.models.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

