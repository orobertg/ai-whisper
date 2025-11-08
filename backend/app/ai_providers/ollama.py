"""
Ollama AI Provider

Implements the AIProvider interface for local Ollama models.
"""

import aiohttp
import json
from typing import List, Dict, Optional, AsyncIterator
from .base import AIProvider


class OllamaProvider(AIProvider):
    """Ollama provider for local LLM inference"""
    
    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "llama3.2:latest",
        **kwargs
    ):
        """
        Initialize Ollama provider.
        
        Args:
            base_url: URL of the Ollama server (default: http://localhost:11434)
            model: Model to use (default: llama3.2:latest)
        """
        super().__init__(base_url=base_url, model=model, **kwargs)
        self.base_url = base_url.rstrip('/')
        self.model = model
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """Send chat request to Ollama and get complete response"""
        url = f"{self.base_url}/api/chat"
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
            }
        }
        
        if max_tokens:
            payload["options"]["num_predict"] = max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ConnectionError(
                            f"Ollama returned status {response.status}: {error_text}"
                        )
                    
                    data = await response.json()
                    return data.get("message", {}).get("content", "")
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Ollama at {self.base_url}: {str(e)}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid response from Ollama: {str(e)}")
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream chat response from Ollama token by token"""
        url = f"{self.base_url}/api/chat"
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": temperature,
            }
        }
        
        if max_tokens:
            payload["options"]["num_predict"] = max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ConnectionError(
                            f"Ollama returned status {response.status}: {error_text}"
                        )
                    
                    async for line in response.content:
                        if line:
                            try:
                                data = json.loads(line.decode('utf-8'))
                                if "message" in data:
                                    content = data["message"].get("content", "")
                                    if content:
                                        yield content
                            except json.JSONDecodeError:
                                continue
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Ollama at {self.base_url}: {str(e)}")
    
    async def list_models(self) -> List[str]:
        """Get list of available models from Ollama"""
        url = f"{self.base_url}/api/tags"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise ConnectionError(f"Ollama returned status {response.status}")
                    
                    data = await response.json()
                    models = data.get("models", [])
                    return [model.get("name", "") for model in models if model.get("name")]
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Ollama at {self.base_url}: {str(e)}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid response from Ollama: {str(e)}")
    
    async def test_connection(self) -> Dict:
        """Test Ollama connection and return available models"""
        try:
            # First, check if Ollama is running
            url = f"{self.base_url}/api/tags"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status != 200:
                        return {
                            "connected": False,
                            "message": f"Ollama server returned status {response.status}",
                            "models": []
                        }
                    
                    data = await response.json()
                    models = [model.get("name", "") for model in data.get("models", []) if model.get("name")]
                    
                    if not models:
                        return {
                            "connected": True,
                            "message": "Connected but no models found. Run 'ollama pull llama3.2' to download a model.",
                            "models": []
                        }
                    
                    # Check if the configured model is available
                    if self.model not in models:
                        return {
                            "connected": True,
                            "message": f"Connected but model '{self.model}' not found. Available models: {', '.join(models[:3])}",
                            "models": models
                        }
                    
                    return {
                        "connected": True,
                        "message": f"Connected successfully. Using model: {self.model}",
                        "models": models
                    }
        
        except aiohttp.ClientError as e:
            return {
                "connected": False,
                "message": f"Cannot connect to Ollama at {self.base_url}. Is Ollama running?",
                "models": []
            }
        except Exception as e:
            return {
                "connected": False,
                "message": f"Error: {str(e)}",
                "models": []
            }
    
    def get_display_name(self) -> str:
        """Get user-friendly display name"""
        return "Ollama (Local)"
