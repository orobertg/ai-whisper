"""
DeepSeek Provider Implementation

Cloud AI provider using DeepSeek's models (OpenAI-compatible API).
"""

import openai
from typing import List, Dict, AsyncIterator
from .base import (
    AIProvider, 
    ProviderError, 
    ProviderConnectionError,
    ProviderAuthenticationError,
    ProviderRateLimitError
)


class DeepSeekProvider(AIProvider):
    """DeepSeek provider (OpenAI-compatible)."""
    
    def __init__(self, config: Dict):
        """
        Initialize DeepSeek provider.
        
        Args:
            config: Dict with 'api_key' and 'model'
        """
        super().__init__(config)
        self.name = "deepseek"
        self.api_key = config.get("api_key")
        self.model = config.get("model", "deepseek-chat")
        self.base_url = "https://api.deepseek.com"
        
        if not self.api_key:
            raise ProviderAuthenticationError(
                "API key is required",
                self.name,
                "Please provide your DeepSeek API key"
            )
        
        # Initialize OpenAI client with DeepSeek base URL
        self.client = openai.AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> str:
        """Send messages to DeepSeek and get response."""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 2048),
                top_p=kwargs.get("top_p", 1.0),
                stream=False
            )
            
            return response.choices[0].message.content or ""
            
        except openai.AuthenticationError as e:
            raise ProviderAuthenticationError(
                "Invalid API key",
                self.name,
                "Please check your DeepSeek API key"
            )
        except openai.RateLimitError as e:
            raise ProviderRateLimitError(
                "Rate limit exceeded",
                self.name,
                "Please wait before making more requests"
            )
        except openai.APIConnectionError as e:
            raise ProviderConnectionError(
                "Cannot connect to DeepSeek",
                self.name,
                "Check your internet connection"
            )
        except Exception as e:
            raise ProviderError(
                "Unexpected error",
                self.name,
                str(e)
            )
    
    async def stream_chat(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream response from DeepSeek."""
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 2048),
                top_p=kwargs.get("top_p", 1.0),
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except openai.AuthenticationError:
            raise ProviderAuthenticationError(
                "Invalid API key",
                self.name,
                "Please check your DeepSeek API key"
            )
        except Exception as e:
            raise ProviderError(
                "Streaming error",
                self.name,
                str(e)
            )
    
    async def list_models(self) -> List[str]:
        """Get list of available DeepSeek models."""
        try:
            # Return known DeepSeek models
            return [
                "deepseek-chat",
                "deepseek-coder"
            ]
            
        except Exception as e:
            raise ProviderError(
                "Failed to list models",
                self.name,
                str(e)
            )
    
    async def test_connection(self) -> Dict:
        """Test DeepSeek connection."""
        import time
        start_time = time.time()
        
        try:
            # Test with a minimal chat completion
            test_response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            models = await self.list_models()
            
            return {
                "connected": True,
                "message": f"Connected to DeepSeek (model: {self.model})",
                "latency_ms": latency_ms,
                "model_count": len(models),
                "models": models
            }
            
        except openai.AuthenticationError:
            return {
                "connected": False,
                "message": "Invalid API key",
                "error": "Please check your DeepSeek API key in settings"
            }
        except openai.APIConnectionError:
            return {
                "connected": False,
                "message": "Cannot connect to DeepSeek",
                "error": "Check your internet connection"
            }
        except Exception as e:
            return {
                "connected": False,
                "message": "Connection test failed",
                "error": str(e)
            }

