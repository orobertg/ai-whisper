"""
DeepSeek AI Provider

Implements the AIProvider interface for DeepSeek models.
DeepSeek API is OpenAI-compatible.
"""

import aiohttp
import json
from typing import List, Dict, Optional, AsyncIterator
from .base import AIProvider


class DeepSeekProvider(AIProvider):
    """DeepSeek provider - OpenAI-compatible API"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "deepseek-chat",
        base_url: str = "https://api.deepseek.com/v1",
        **kwargs
    ):
        """
        Initialize DeepSeek provider.
        
        Args:
            api_key: DeepSeek API key
            model: Model to use (default: deepseek-chat)
            base_url: Base URL for DeepSeek API
        """
        super().__init__(api_key=api_key, model=model, base_url=base_url, **kwargs)
        self.api_key = api_key
        self.model = model
        self.base_url = base_url.rstrip('/')
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """Send chat request to DeepSeek and get complete response"""
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "stream": False
        }
        
        if max_tokens:
            payload["max_tokens"] = max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 401:
                            raise ConnectionError("Invalid DeepSeek API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"DeepSeek returned status {response.status}: {error_text}"
                            )
                    
                    data = await response.json()
                    return data["choices"][0]["message"]["content"]
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to DeepSeek: {str(e)}")
        except (KeyError, json.JSONDecodeError) as e:
            raise ValueError(f"Invalid response from DeepSeek: {str(e)}")
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream chat response from DeepSeek token by token"""
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "stream": True
        }
        
        if max_tokens:
            payload["max_tokens"] = max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 401:
                            raise ConnectionError("Invalid DeepSeek API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"DeepSeek returned status {response.status}: {error_text}"
                            )
                    
                    async for line in response.content:
                        if line:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]  # Remove 'data: ' prefix
                                
                                if line_str == '[DONE]':
                                    break
                                
                                try:
                                    data = json.loads(line_str)
                                    if "choices" in data and len(data["choices"]) > 0:
                                        delta = data["choices"][0].get("delta", {})
                                        content = delta.get("content", "")
                                        if content:
                                            yield content
                                except json.JSONDecodeError:
                                    continue
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to DeepSeek: {str(e)}")
    
    async def list_models(self) -> List[str]:
        """Get list of available DeepSeek models"""
        # DeepSeek has a limited set of known models
        return [
            "deepseek-chat",
            "deepseek-coder"
        ]
    
    async def test_connection(self) -> Dict:
        """Test DeepSeek connection and API key validity"""
        try:
            # Make a minimal API call to test the connection
            url = f"{self.base_url}/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
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
                            "message": "Invalid API key. Please check your DeepSeek API key.",
                            "models": []
                        }
                    
                    if response.status == 404:
                        return {
                            "connected": True,
                            "message": f"Connected but model '{self.model}' not found. Try: deepseek-chat",
                            "models": await self.list_models()
                        }
                    
                    if response.status != 200:
                        error_text = await response.text()
                        return {
                            "connected": False,
                            "message": f"DeepSeek API error (status {response.status}): {error_text}",
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
                "message": f"Cannot connect to DeepSeek API: {str(e)}",
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
        return "DeepSeek"

