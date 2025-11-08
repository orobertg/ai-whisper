/**
 * Utility functions for AI provider management
 */

// Map model names to provider keys
export const MODEL_TO_PROVIDER: Record<string, string> = {
  "Ollama - Llama 3.2": "ollama",
  "OpenAI - GPT-4": "openai",
  "Anthropic - Claude 3.5": "anthropic",
  "DeepSeek - Coder V2": "deepseek",
};

// Get provider configurations from localStorage
export function getProviderConfigs(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  
  const savedConfigs = localStorage.getItem("ai_provider_configs");
  if (!savedConfigs) return {};
  
  try {
    return JSON.parse(savedConfigs);
  } catch (e) {
    console.error("Failed to parse provider configs:", e);
    return {};
  }
}

// Check if a model is configured and tested
export function isModelTested(modelName: string): boolean {
  const providerKey = MODEL_TO_PROVIDER[modelName];
  if (!providerKey) return false;
  
  const configs = getProviderConfigs();
  const config = configs[providerKey];
  
  return config?.tested === true;
}

// Get all models with their tested status
export function getModelsWithStatus(modelNames: string[]): Array<{ value: string; isTested: boolean }> {
  return modelNames.map(name => ({
    value: name,
    isTested: isModelTested(name),
  }));
}

// Get provider key from model name
export function getProviderFromModel(modelName: string): string | null {
  return MODEL_TO_PROVIDER[modelName] || null;
}

