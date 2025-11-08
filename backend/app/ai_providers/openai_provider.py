"""
OpenAI AI Provider

Implements the AIProvider interface for OpenAI models.
"""

import aiohttp
import asyncio
import json
from typing import List, Dict, Optional, AsyncIterator
from .base import AIProvider


class OpenAIProvider(AIProvider):
    """OpenAI provider for GPT models"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-4o-mini",
        base_url: str = "https://api.openai.com/v1",
        **kwargs
    ):
        """
        Initialize OpenAI provider.
        
        Args:
            api_key: OpenAI API key
            model: Model to use (default: gpt-4o-mini)
            base_url: Base URL for OpenAI API (default: https://api.openai.com/v1)
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
        """Send chat request to OpenAI and get complete response"""
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
                            raise ConnectionError("Invalid OpenAI API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"OpenAI returned status {response.status}: {error_text}"
                            )
                    
                    data = await response.json()
                    return data["choices"][0]["message"]["content"]
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to OpenAI: {str(e)}")
        except (KeyError, json.JSONDecodeError) as e:
            raise ValueError(f"Invalid response from OpenAI: {str(e)}")
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream chat response from OpenAI token by token"""
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
                            raise ConnectionError("Invalid OpenAI API key")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"OpenAI returned status {response.status}: {error_text}"
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
            raise ConnectionError(f"Failed to connect to OpenAI: {str(e)}")
    
    async def list_models(self) -> List[str]:
        """Get list of available models from OpenAI"""
        url = f"{self.base_url}/models"
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 401:
                        raise ConnectionError("Invalid API key")
                    
                    if response.status != 200:
                        error_text = await response.text()
                        raise ConnectionError(f"OpenAI returned status {response.status}: {error_text[:200]}")
                    
                    data = await response.json()
                    models = data.get("data", [])
                    
                    # Filter to only chat-capable models
                    chat_models = [
                        model["id"] for model in models 
                        if "gpt" in model["id"].lower()
                    ]
                    
                    # Sort by common models first
                    priority_models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]
                    sorted_models = []
                    for pm in priority_models:
                        if pm in chat_models:
                            sorted_models.append(pm)
                    
                    # Add remaining models
                    for model in chat_models:
                        if model not in sorted_models:
                            sorted_models.append(model)
                    
                    return sorted_models
        
        except aiohttp.ClientConnectorError as e:
            raise ConnectionError(f"Cannot reach OpenAI servers: {str(e)}")
        except asyncio.TimeoutError:
            raise ConnectionError("Connection timeout while fetching models")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid response from OpenAI: {str(e)}")
    
    async def test_connection(self) -> Dict:
        """
        Test OpenAI connection and API key validity.
        
        Standard OpenAI API test: GET https://api.openai.com/v1/models
        with Authorization: Bearer {api_key}
        
        Tests in order:
        1. Network connectivity to OpenAI
        2. API key validity  
        3. List available models
        4. Verify configured model exists (if applicable)
        """
        try:
            # Validate API key format first
            if not self.api_key or not self.api_key.strip():
                return {
                    "connected": False,
                    "message": "❌ API key is empty. Please provide a valid OpenAI API key.",
                    "models": []
                }
            
            if not self.api_key.startswith("sk-"):
                return {
                    "connected": False,
                    "message": "❌ Invalid API key format. OpenAI API keys should start with 'sk-'.",
                    "models": []
                }
            
            # Step 1 & 2: Test connectivity and API key by listing models
            # Standard OpenAI endpoint for testing
            models_url = f"{self.base_url}/models"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            print(f"🔍 Testing OpenAI connection to: {models_url}")
            print(f"🔑 API Key (first 10 chars): {self.api_key[:10]}...")
            
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.get(
                        models_url, 
                        headers=headers, 
                        timeout=aiohttp.ClientTimeout(total=15)
                    ) as response:
                        print(f"📡 OpenAI Response Status: {response.status}")
                        
                        # Get response body for all cases
                        response_text = await response.text()
                        
                        # Check for authentication errors
                        if response.status == 401:
                            print(f"❌ 401 Unauthorized Response: {response_text[:200]}")
                            return {
                                "connected": False,
                                "message": "❌ Invalid API key. Please verify your OpenAI API key is correct.",
                                "models": [],
                                "error": f"HTTP 401: {response_text[:200]}"
                            }
                        
                        # Check for other errors
                        if response.status == 403:
                            print(f"❌ 403 Forbidden Response: {response_text[:200]}")
                            return {
                                "connected": False,
                                "message": "❌ Access forbidden. Your API key may not have the required permissions.",
                                "models": [],
                                "error": f"HTTP 403: {response_text[:200]}"
                            }
                        
                        if response.status == 429:
                            print(f"⚠️ 429 Rate Limit Response: {response_text[:200]}")
                            return {
                                "connected": False,
                                "message": "⚠️ Rate limit exceeded. Your API key is valid but you've reached the rate limit.",
                                "models": [],
                                "error": f"HTTP 429: {response_text[:200]}"
                            }
                        
                        if response.status != 200:
                            print(f"❌ HTTP {response.status} Response: {response_text[:200]}")
                            return {
                                "connected": False,
                                "message": f"❌ OpenAI API error (HTTP {response.status})",
                                "models": [],
                                "error": response_text[:300]
                            }
                        
                        # Success! Parse the models list
                        print(f"✅ Successfully connected to OpenAI")
                        data = json.loads(response_text)
                        all_models = data.get("data", [])
                        print(f"📊 Found {len(all_models)} total models")
                        
                        # Filter for chat models (GPT models)
                        chat_models = [
                            model["id"] for model in all_models 
                            if "gpt" in model["id"].lower()
                        ]
                        
                        # Sort by common models first
                        priority_models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]
                        sorted_models = []
                        for pm in priority_models:
                            if pm in chat_models:
                                sorted_models.append(pm)
                        
                        # Add remaining models
                        for model in chat_models:
                            if model not in sorted_models:
                                sorted_models.append(model)
                        
                        if not sorted_models:
                            return {
                                "connected": True,
                                "message": "⚠️ Connected successfully, but no GPT models found in your account.",
                                "models": []
                            }
                        
                        # Step 3: Verify the configured model exists (if one is set)
                        if self.model and self.model not in sorted_models:
                            return {
                                "connected": True,
                                "message": f"⚠️ Connected! But model '{self.model}' not found. Found {len(sorted_models)} available models.",
                                "models": sorted_models
                            }
                        
                        # All checks passed!
                        return {
                            "connected": True,
                            "message": f"✅ Connected successfully! Found {len(sorted_models)} available models.",
                            "models": sorted_models
                        }
                
                except aiohttp.ClientConnectorError as e:
                    print(f"❌ Network Error: {str(e)}")
                    return {
                        "connected": False,
                        "message": f"❌ Cannot reach OpenAI servers. Check your internet connection.",
                        "models": [],
                        "error": str(e)
                    }
                except asyncio.TimeoutError as e:
                    print(f"⏱️ Timeout Error: {str(e)}")
                    return {
                        "connected": False,
                        "message": "❌ Connection timeout. OpenAI servers may be slow or unreachable.",
                        "models": [],
                        "error": "Request timed out after 15 seconds"
                    }
        
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {str(e)}")
            return {
                "connected": False,
                "message": f"❌ Invalid response format from OpenAI",
                "models": [],
                "error": f"JSON decode error: {str(e)}"
            }
        except Exception as e:
            print(f"❌ Unexpected Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "connected": False,
                "message": f"❌ Unexpected error: {str(e)}",
                "models": [],
                "error": str(e)
            }
    
    def get_display_name(self) -> str:
        """Get user-friendly display name"""
        return "OpenAI"
