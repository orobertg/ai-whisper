"""
Anthropic Provider Implementation

Cloud AI provider using Anthropic's Claude models.
"""

import anthropic
from typing import List, Dict, AsyncIterator
from .base import (
    AIProvider, 
    ProviderError, 
    ProviderConnectionError,
    ProviderAuthenticationError,
    ProviderRateLimitError
)


class AnthropicProvider(AIProvider):
    """Anthropic Claude provider."""
    
    def __init__(self, config: Dict):
        """
        Initialize Anthropic provider.
        
        Args:
            config: Dict with 'api_key' and 'model'
        """
        super().__init__(config)
        self.name = "anthropic"
        self.api_key = config.get("api_key")
        self.model = config.get("model", "claude-3-5-sonnet-20241022")
        
        if not self.api_key:
            raise ProviderAuthenticationError(
                "API key is required",
                self.name,
                "Please provide your Anthropic API key"
            )
        
        # Initialize client
        self.client = anthropic.AsyncAnthropic(api_key=self.api_key)
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> str:
        """Send messages to Anthropic and get response."""
        try:
            # Anthropic requires system messages separately
            system_message = None
            chat_messages = []
            
            for msg in messages:
                if msg["role"] == "system":
                    system_message = msg["content"]
                else:
                    chat_messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=kwargs.get("max_tokens", 2048),
                temperature=kwargs.get("temperature", 0.7),
                top_p=kwargs.get("top_p", 1.0),
                messages=chat_messages,
                system=system_message if system_message else None
            )
            
            # Extract text from content blocks
            text_blocks = [
                block.text 
                for block in response.content 
                if hasattr(block, 'text')
            ]
            
            return "".join(text_blocks)
            
        except anthropic.AuthenticationError as e:
            raise ProviderAuthenticationError(
                "Invalid API key",
                self.name,
                "Please check your Anthropic API key"
            )
        except anthropic.RateLimitError as e:
            raise ProviderRateLimitError(
                "Rate limit exceeded",
                self.name,
                "Please wait before making more requests"
            )
        except anthropic.APIConnectionError as e:
            raise ProviderConnectionError(
                "Cannot connect to Anthropic",
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
        """Stream response from Anthropic."""
        try:
            # Separate system messages
            system_message = None
            chat_messages = []
            
            for msg in messages:
                if msg["role"] == "system":
                    system_message = msg["content"]
                else:
                    chat_messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            async with self.client.messages.stream(
                model=self.model,
                max_tokens=kwargs.get("max_tokens", 2048),
                temperature=kwargs.get("temperature", 0.7),
                top_p=kwargs.get("top_p", 1.0),
                messages=chat_messages,
                system=system_message if system_message else None
            ) as stream:
                async for text in stream.text_stream:
                    yield text
                    
        except anthropic.AuthenticationError:
            raise ProviderAuthenticationError(
                "Invalid API key",
                self.name,
                "Please check your Anthropic API key"
            )
        except Exception as e:
            raise ProviderError(
                "Streaming error",
                self.name,
                str(e)
            )
    
    async def list_models(self) -> List[str]:
        """Get list of available Anthropic models."""
        try:
            # Return known Claude models
            return [
                "claude-3-5-sonnet-20241022",
                "claude-3-5-haiku-20241022",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-haiku-20240307",
            ]
            
        except Exception as e:
            raise ProviderError(
                "Failed to list models",
                self.name,
                str(e)
            )
    
    async def test_connection(self) -> Dict:
        """Test Anthropic connection."""
        import time
        start_time = time.time()
        
        try:
            # Test with a minimal message
            test_response = await self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "test"}]
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            models = await self.list_models()
            
            return {
                "connected": True,
                "message": f"Connected to Anthropic (model: {self.model})",
                "latency_ms": latency_ms,
                "model_count": len(models),
                "models": models
            }
            
        except anthropic.AuthenticationError:
            return {
                "connected": False,
                "message": "Invalid API key",
                "error": "Please check your Anthropic API key in settings"
            }
        except anthropic.APIConnectionError:
            return {
                "connected": False,
                "message": "Cannot connect to Anthropic",
                "error": "Check your internet connection"
            }
        except Exception as e:
            return {
                "connected": False,
                "message": "Connection test failed",
                "error": str(e)
            }

