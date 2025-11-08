"""
Anthropic AI Provider

Implements the AIProvider interface for Anthropic Claude models.
"""

import aiohttp
import json
from typing import List, Dict, Optional, AsyncIterator
from .base import AIProvider


class AnthropicProvider(AIProvider):
    """Anthropic provider for Claude models"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "claude-3-5-sonnet-20241022",
        base_url: str = "https://api.anthropic.com/v1",
        **kwargs
    ):
        """
        Initialize Anthropic provider.
        
        Args:
            api_key: Anthropic API key
            model: Model to use (default: claude-3-5-sonnet-20241022)
            base_url: Base URL for Anthropic API
        """
        super().__init__(api_key=api_key, model=model, base_url=base_url, **kwargs)
        self.api_key = api_key
        self.model = model
        self.base_url = base_url.rstrip('/')
    
    def _convert_messages(self, messages: List[Dict[str, str]]) -> tuple:
        """
        Convert OpenAI-style messages to Anthropic format.
        Returns (system_prompt, converted_messages)
        """
        system_prompt = None
        converted = []
        
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            
            if role == "system":
                system_prompt = content
            elif role == "assistant":
                converted.append({"role": "assistant", "content": content})
            else:  # user or any other role
                converted.append({"role": "user", "content": content})
        
        return system_prompt, converted
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """Send chat request to Anthropic and get complete response"""
        url = f"{self.base_url}/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        system_prompt, converted_messages = self._convert_messages(messages)
        
        payload = {
            "model": self.model,
            "messages": converted_messages,
            "temperature": temperature,
            "max_tokens": max_tokens or 4096,
            "stream": False
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 401:
                            raise ConnectionError("Invalid Anthropic API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"Anthropic returned status {response.status}: {error_text}"
                            )
                    
                    data = await response.json()
                    # Anthropic returns content as an array of content blocks
                    content_blocks = data.get("content", [])
                    return "".join(block.get("text", "") for block in content_blocks if block.get("type") == "text")
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Anthropic: {str(e)}")
        except (KeyError, json.JSONDecodeError) as e:
            raise ValueError(f"Invalid response from Anthropic: {str(e)}")
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream chat response from Anthropic token by token"""
        url = f"{self.base_url}/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        system_prompt, converted_messages = self._convert_messages(messages)
        
        payload = {
            "model": self.model,
            "messages": converted_messages,
            "temperature": temperature,
            "max_tokens": max_tokens or 4096,
            "stream": True
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 401:
                            raise ConnectionError("Invalid Anthropic API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"Anthropic returned status {response.status}: {error_text}"
                            )
                    
                    async for line in response.content:
                        if line:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]  # Remove 'data: ' prefix
                                
                                try:
                                    data = json.loads(line_str)
                                    event_type = data.get("type")
                                    
                                    # Handle content_block_delta events
                                    if event_type == "content_block_delta":
                                        delta = data.get("delta", {})
                                        if delta.get("type") == "text_delta":
                                            text = delta.get("text", "")
                                            if text:
                                                yield text
                                except json.JSONDecodeError:
                                    continue
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Anthropic: {str(e)}")
    
    async def list_models(self) -> List[str]:
        """Get list of available Anthropic models"""
        # Anthropic doesn't provide a models endpoint, so we return known models
        return [
            "claude-3-5-sonnet-20241022",
            "claude-3-5-haiku-20241022",
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307"
        ]
    
    async def test_connection(self) -> Dict:
        """Test Anthropic connection and API key validity"""
        try:
            # Make a minimal API call to test the connection
            url = f"{self.base_url}/messages"
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": "Hi"}],
                "max_tokens": 1
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url, 
                    json=payload, 
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 401:
                        return {
                            "connected": False,
                            "message": "Invalid API key. Please check your Anthropic API key.",
                            "models": []
                        }
                    
                    if response.status == 404:
                        return {
                            "connected": True,
                            "message": f"Connected but model '{self.model}' not found. Try: claude-3-5-sonnet-20241022",
                            "models": await self.list_models()
                        }
                    
                    if response.status != 200:
                        error_text = await response.text()
                        return {
                            "connected": False,
                            "message": f"Anthropic API error (status {response.status}): {error_text}",
                            "models": []
                        }
                    
                    models = await self.list_models()
                    return {
                        "connected": True,
                        "message": f"Connected successfully. Using model: {self.model}",
                        "models": models
                    }
        
        except aiohttp.ClientError as e:
            return {
                "connected": False,
                "message": f"Cannot connect to Anthropic API: {str(e)}",
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
        return "Anthropic Claude"

