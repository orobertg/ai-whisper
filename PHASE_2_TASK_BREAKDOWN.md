# Phase 2 - Detailed Task Breakdown

**Purpose:** Actionable development tasks for Phase 2 features  
**Format:** Each task includes acceptance criteria and file changes  
**Estimated Total:** 6-8 weeks

---

## 🎯 Sprint 1: AI Provider Configuration (Week 1-2)

### Priority: HIGH | Estimated: 10-12 days

---

### Backend Tasks (5-6 days)

#### E1: Create AI Provider Interface
**File:** `backend/app/ai_providers/base.py` (NEW)

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Optional

class AIProvider(ABC):
    @abstractmethod
    async def chat(self, messages: List[Dict], **kwargs) -> str:
        """Send messages and get response"""
        pass
    
    @abstractmethod
    async def stream_chat(self, messages: List[Dict], **kwargs):
        """Stream response"""
        pass
    
    @abstractmethod
    async def list_models(self) -> List[str]:
        """Get available models"""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test if provider is accessible"""
        pass
```

**Acceptance Criteria:**
- [ ] Base class defines all required methods
- [ ] Type hints are complete
- [ ] Docstrings explain each method

---

#### E2: Implement Ollama Provider
**File:** `backend/app/ai_providers/ollama.py` (NEW)

```python
class OllamaProvider(AIProvider):
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model
    
    async def chat(self, messages, **kwargs):
        # Implementation
        pass
    
    async def list_models(self):
        # Call Ollama /api/tags endpoint
        pass
```

**Acceptance Criteria:**
- [ ] Implements all AIProvider methods
- [ ] Handles connection errors gracefully
- [ ] Returns list of available models
- [ ] Test connection works

**Files to modify:**
- `backend/app/ai.py` - Update to use new provider

---

#### E3-E6: Implement Other Providers
**Files:** 
- `backend/app/ai_providers/openai.py` (NEW)
- `backend/app/ai_providers/anthropic.py` (NEW)
- `backend/app/ai_providers/google.py` (NEW)
- `backend/app/ai_providers/deepseek.py` (NEW)

**Pattern for each:**
```python
class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str, model: str, org_id: Optional[str] = None):
        self.api_key = api_key
        self.model = model
        self.org_id = org_id
        self.client = OpenAI(api_key=api_key)
```

**Acceptance Criteria per provider:**
- [ ] API client initialized correctly
- [ ] Error handling for invalid keys
- [ ] Model listing works
- [ ] Chat method returns string response

---

#### E7: Create Provider Factory
**File:** `backend/app/ai_providers/factory.py` (NEW)

```python
def get_provider(config: Dict) -> AIProvider:
    provider_type = config.get("provider")
    
    if provider_type == "ollama":
        return OllamaProvider(
            base_url=config["ollama_base_url"],
            model=config["ollama_model"]
        )
    elif provider_type == "openai":
        return OpenAIProvider(
            api_key=config["api_key"],
            model=config["model"],
            org_id=config.get("organization_id")
        )
    # ... etc
```

**Acceptance Criteria:**
- [ ] Factory returns correct provider instance
- [ ] Validates required config fields
- [ ] Raises clear errors for invalid config

---

#### E8: Provider Validation API
**File:** `backend/app/routes/providers.py` (NEW)

```python
from fastapi import APIRouter, Depends
from ..ai_providers.factory import get_provider

router = APIRouter(prefix="/providers", tags=["providers"])

@router.post("/validate")
async def validate_provider(config: Dict):
    """Test provider connection"""
    try:
        provider = get_provider(config)
        is_valid = await provider.test_connection()
        models = await provider.list_models() if is_valid else []
        return {
            "valid": is_valid,
            "models": models
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }

@router.get("/models")
async def list_models(provider_type: str, config: Dict):
    """List available models for provider"""
    provider = get_provider({"provider": provider_type, **config})
    return await provider.list_models()
```

**Files to modify:**
- `backend/app/main.py` - Register providers router

**Acceptance Criteria:**
- [ ] `/providers/validate` endpoint works
- [ ] Returns connection status
- [ ] Returns available models
- [ ] Error messages are user-friendly

---

### Frontend Tasks (5-6 days)

#### F1: Add AI Providers Tab to Settings
**File:** `frontend/components/Settings.tsx`

**Changes:**
```typescript
// Add tab state
const [activeTab, setActiveTab] = useState<'appearance' | 'providers'>('appearance');

// Add tab navigation
<div className="flex border-b border-zinc-200">
  <button 
    onClick={() => setActiveTab('appearance')}
    className={activeTab === 'appearance' ? 'active' : ''}
  >
    Appearance
  </button>
  <button 
    onClick={() => setActiveTab('providers')}
    className={activeTab === 'providers' ? 'active' : ''}
  >
    AI Providers
  </button>
</div>

// Conditional rendering
{activeTab === 'appearance' && <AppearanceSettings />}
{activeTab === 'providers' && <ProviderSettings />}
```

**Acceptance Criteria:**
- [ ] Two tabs visible in settings
- [ ] Clicking switches content
- [ ] Tab state persists while modal open

---

#### F2-F6: Provider Configuration Components
**File:** `frontend/components/ProviderSettings.tsx` (NEW)

```typescript
type ProviderConfig = {
  provider: 'ollama' | 'openai' | 'anthropic' | 'google' | 'deepseek'
  enabled: boolean
  ollama_base_url?: string
  ollama_model?: string
  api_key?: string
  model?: string
  organization_id?: string
  temperature?: number
  max_tokens?: number
}

export default function ProviderSettings() {
  const [activeProvider, setActiveProvider] = useState<string>('ollama')
  const [config, setConfig] = useState<ProviderConfig>({
    provider: 'ollama',
    enabled: true,
    ollama_base_url: 'http://localhost:11434',
    ollama_model: 'llama3.2:latest'
  })
  
  return (
    <div className="space-y-4">
      {/* Provider selector */}
      <select 
        value={activeProvider} 
        onChange={(e) => setActiveProvider(e.target.value)}
      >
        <option value="ollama">Ollama (Local)</option>
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic Claude</option>
        <option value="google">Google Gemini</option>
        <option value="deepseek">DeepSeek</option>
      </select>
      
      {/* Provider-specific config */}
      {activeProvider === 'ollama' && <OllamaConfig config={config} onChange={setConfig} />}
      {activeProvider === 'openai' && <OpenAIConfig config={config} onChange={setConfig} />}
      {/* ... etc */}
    </div>
  )
}
```

**Component structure:**
- `ProviderSettings.tsx` - Main container
- `OllamaConfig.tsx` - Ollama configuration form
- `OpenAIConfig.tsx` - OpenAI configuration form
- `AnthropicConfig.tsx` - Anthropic configuration form
- `GoogleConfig.tsx` - Google configuration form
- `DeepSeekConfig.tsx` - DeepSeek configuration form

**Acceptance Criteria per component:**
- [ ] Form fields for all required settings
- [ ] Advanced settings collapsible section
- [ ] Input validation (URL format, API key format)
- [ ] Save button enabled only when valid

---

#### F7: Test Connection Functionality
**File:** `frontend/components/ProviderSettings.tsx`

```typescript
const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
const [availableModels, setAvailableModels] = useState<string[]>([])

const testConnection = async () => {
  setConnectionStatus('testing')
  try {
    const response = await fetch('http://localhost:8000/providers/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    const data = await response.json()
    
    if (data.valid) {
      setConnectionStatus('success')
      setAvailableModels(data.models)
    } else {
      setConnectionStatus('error')
      alert(data.error)
    }
  } catch (error) {
    setConnectionStatus('error')
  }
}
```

**Acceptance Criteria:**
- [ ] "Test Connection" button works
- [ ] Shows loading state while testing
- [ ] Success shows green checkmark
- [ ] Error shows red X with message
- [ ] Available models populate dropdown

---

#### F9: Save Provider Config
**File:** `frontend/components/ProviderSettings.tsx`

```typescript
const saveConfig = () => {
  // Save to localStorage
  localStorage.setItem('ai_provider_config', JSON.stringify(config))
  
  // Optionally save to database
  if (currentUserId) {
    fetch(`/api/users/${currentUserId}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ ai_provider: config })
    })
  }
  
  // Show success message
  setShowSaveConfirmation(true)
}
```

**Acceptance Criteria:**
- [ ] Config saves to localStorage
- [ ] Config persists across page reloads
- [ ] "Saved!" confirmation appears
- [ ] Chat uses new provider immediately

---

#### F10: Show Active Provider in Chat
**File:** `frontend/components/ChatPanel.tsx`

```typescript
// In chat header
<div className="flex items-center gap-2 text-xs text-gray-500">
  <AiNetworkIcon size={14} />
  <span>{providerName}</span>
  {isConnected ? (
    <CheckmarkCircle02Icon size={14} className="text-green-500" />
  ) : (
    <CancelCircle02Icon size={14} className="text-red-500" />
  )}
</div>
```

**Acceptance Criteria:**
- [ ] Provider name shows in chat
- [ ] Connection status indicator visible
- [ ] Updates when provider changes
- [ ] Tooltip shows more details on hover

---

### Security Tasks (1 day)

#### G1: API Key Encryption
**File:** `frontend/lib/encryption.ts` (NEW)

```typescript
import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key'

export function encryptApiKey(apiKey: string): string {
  return CryptoJS.AES.encrypt(apiKey, SECRET_KEY).toString()
}

export function decryptApiKey(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
```

**Acceptance Criteria:**
- [ ] API keys encrypted before localStorage
- [ ] Decryption works correctly
- [ ] Keys never logged or exposed

---

#### G2: API Key Masking in UI
**File:** `frontend/components/OpenAIConfig.tsx`

```typescript
<input
  type="password"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
  placeholder="sk-..."
  className="font-mono"
/>
{apiKey && (
  <div className="text-xs text-gray-500 mt-1">
    Key: ****{apiKey.slice(-4)}
  </div>
)}
```

**Acceptance Criteria:**
- [ ] API key input is type="password"
- [ ] Shows last 4 characters when saved
- [ ] "Show/Hide" toggle works

---

## 🧪 Sprint 1 Testing Checklist

### Unit Tests
- [ ] Each provider class has tests
- [ ] Provider factory handles all types
- [ ] Encryption/decryption is bidirectional
- [ ] UI components render correctly

### Integration Tests
- [ ] Ollama provider connects successfully
- [ ] OpenAI provider validates API key
- [ ] Provider switching works in chat
- [ ] Config persists across sessions

### Manual Testing
- [ ] User can add Ollama config
- [ ] User can add OpenAI config
- [ ] Connection test provides clear feedback
- [ ] Chat uses selected provider
- [ ] Error messages are helpful

---

## 📝 Sprint 1 Deliverables

**Backend:**
- ✅ 6 new provider classes
- ✅ Provider factory
- ✅ Validation API endpoint
- ✅ Model listing endpoint

**Frontend:**
- ✅ Settings modal with 2 tabs
- ✅ 5 provider configuration components
- ✅ Test connection UI
- ✅ Active provider indicator in chat

**Documentation:**
- ✅ Provider setup guide
- ✅ API key security documentation
- ✅ Troubleshooting guide

---

## 🎯 Sprint 2-4 Overview (Brief)

### Sprint 2: Project Hierarchy (Week 3-4)
**Focus:** Database changes, Project/Chat models, UI restructure

**Key Deliverables:**
- New Project/Chat models
- Updated HomeScreen with project view
- Breadcrumb navigation
- Project creation/management

### Sprint 3: Multi-Chat & Delete (Week 5-6)
**Focus:** Multiple chats per project, delete functionality

**Key Deliverables:**
- Chat list within projects
- Delete confirmation dialogs
- Cascade delete logic
- Cross-project AI search

### Sprint 4: UX Polish (Week 7-8)
**Focus:** Mind map improvements, wallpapers

**Key Deliverables:**
- Hover icons on nodes
- Enhanced connection handles
- Undo/Redo system
- Wallpaper selector
- Automatic contrast adjustment

---

## 📊 Definition of Done (DoD)

A task is **done** when:
- [ ] Code is written and committed
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No linter errors
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Merged to main branch
- [ ] Feature tested in Docker environment

---

## 🚀 Getting Started

### To begin Sprint 1:

1. **Create feature branch:**
   ```bash
   git checkout -b feature/ai-provider-configuration
   ```

2. **Set up backend structure:**
   ```bash
   mkdir backend/app/ai_providers
   touch backend/app/ai_providers/__init__.py
   touch backend/app/ai_providers/base.py
   ```

3. **Install dependencies:**
   ```bash
   cd backend
   pip install openai anthropic google-generativeai
   pip freeze > requirements.txt
   ```

4. **Start with Task E1** (Base provider interface)

5. **Test frequently** - Don't wait until the end

---

**Next:** Begin Sprint 1 - Task E1  
**Status:** 📋 Ready to start  
**Estimated Completion:** 2 weeks from start date

