"""
Google Gemini AI Provider

Implements the AIProvider interface for Google Gemini models.
"""

import aiohttp
import json
from typing import List, Dict, Optional, AsyncIterator
from .base import AIProvider


class GoogleProvider(AIProvider):
    """Google provider for Gemini models"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "gemini-2.0-flash-exp",
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
        **kwargs
    ):
        """
        Initialize Google Gemini provider.
        
        Args:
            api_key: Google API key
            model: Model to use (default: gemini-2.0-flash-exp)
            base_url: Base URL for Google AI API
        """
        super().__init__(api_key=api_key, model=model, base_url=base_url, **kwargs)
        self.api_key = api_key
        self.model = model
        self.base_url = base_url.rstrip('/')
    
    def _convert_messages(self, messages: List[Dict[str, str]]) -> tuple:
        """
        Convert OpenAI-style messages to Gemini format.
        Returns (system_instruction, converted_contents)
        """
        system_instruction = None
        contents = []
        
        for msg in messages:
            role = msg.get("role", "user")
            text = msg.get("content", "")
            
            if role == "system":
                system_instruction = text
            elif role == "assistant":
                contents.append({
                    "role": "model",
                    "parts": [{"text": text}]
                })
            else:  # user
                contents.append({
                    "role": "user",
                    "parts": [{"text": text}]
                })
        
        return system_instruction, contents
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """Send chat request to Google Gemini and get complete response"""
        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        
        system_instruction, contents = self._convert_messages(messages)
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
            }
        }
        
        if max_tokens:
            payload["generationConfig"]["maxOutputTokens"] = max_tokens
        
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 400:
                            # Try to parse error details
                            try:
                                error_data = json.loads(error_text)
                                error_msg = error_data.get("error", {}).get("message", error_text)
                                raise ConnectionError(f"Google API error: {error_msg}")
                            except json.JSONDecodeError:
                                raise ConnectionError(f"Invalid request to Google API: {error_text}")
                        elif response.status == 401 or response.status == 403:
                            raise ConnectionError("Invalid Google API key or insufficient permissions")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"Google returned status {response.status}: {error_text}"
                            )
                    
                    data = await response.json()
                    
                    # Extract text from Gemini response
                    candidates = data.get("candidates", [])
                    if not candidates:
                        return ""
                    
                    parts = candidates[0].get("content", {}).get("parts", [])
                    return "".join(part.get("text", "") for part in parts)
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Google AI: {str(e)}")
        except (KeyError, json.JSONDecodeError) as e:
            raise ValueError(f"Invalid response from Google AI: {str(e)}")
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream chat response from Google Gemini token by token"""
        url = f"{self.base_url}/models/{self.model}:streamGenerateContent?key={self.api_key}&alt=sse"
        
        system_instruction, contents = self._convert_messages(messages)
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
            }
        }
        
        if max_tokens:
            payload["generationConfig"]["maxOutputTokens"] = max_tokens
        
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        if response.status == 400:
                            try:
                                error_data = json.loads(error_text)
                                error_msg = error_data.get("error", {}).get("message", error_text)
                                raise ConnectionError(f"Google API error: {error_msg}")
                            except json.JSONDecodeError:
                                raise ConnectionError(f"Invalid request to Google API: {error_text}")
                        elif response.status == 401 or response.status == 403:
                            raise ConnectionError("Invalid Google API key or insufficient permissions")
                        elif response.status == 429:
                            raise ConnectionError("Rate limit exceeded")
                        else:
                            raise ConnectionError(
                                f"Google returned status {response.status}: {error_text}"
                            )
                    
                    async for line in response.content:
                        if line:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]  # Remove 'data: ' prefix
                                
                                try:
                                    data = json.loads(line_str)
                                    candidates = data.get("candidates", [])
                                    if candidates:
                                        parts = candidates[0].get("content", {}).get("parts", [])
                                        for part in parts:
                                            text = part.get("text", "")
                                            if text:
                                                yield text
                                except json.JSONDecodeError:
                                    continue
        
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Google AI: {str(e)}")
    
    async def list_models(self) -> List[str]:
        """Get list of available Google Gemini models"""
        url = f"{self.base_url}/models?key={self.api_key}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        # Return known models as fallback
                        return [
                            "gemini-2.0-flash-exp",
                            "gemini-1.5-pro",
                            "gemini-1.5-flash",
                            "gemini-1.5-flash-8b"
                        ]
                    
                    data = await response.json()
                    models = data.get("models", [])
                    
                    # Filter to only generativeAI models that support generateContent
                    chat_models = []
                    for model in models:
                        model_name = model.get("name", "")
                        if "models/" in model_name:
                            model_id = model_name.split("models/")[1]
                            # Only include generative models
                            supported_methods = model.get("supportedGenerationMethods", [])
                            if "generateContent" in supported_methods:
                                chat_models.append(model_id)
                    
                    return chat_models if chat_models else [
                        "gemini-2.0-flash-exp",
                        "gemini-1.5-pro",
                        "gemini-1.5-flash",
                        "gemini-1.5-flash-8b"
                    ]
        
        except Exception:
            # Return known models as fallback
            return [
                "gemini-2.0-flash-exp",
                "gemini-1.5-pro",
                "gemini-1.5-flash",
                "gemini-1.5-flash-8b"
            ]
    
    async def test_connection(self) -> Dict:
        """Test Google Gemini connection and API key validity"""
        try:
            # Make a minimal API call to test the connection
            url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "role": "user",
                    "parts": [{"text": "Hi"}]
                }],
                "generationConfig": {
                    "maxOutputTokens": 1
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url, 
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 400:
                        error_text = await response.text()
                        try:
                            error_data = json.loads(error_text)
                            error_msg = error_data.get("error", {}).get("message", "")
                            if "API key not valid" in error_msg:
                                return {
                                    "connected": False,
                                    "message": "Invalid API key. Please check your Google API key.",
                                    "models": []
                                }
                            elif "not found" in error_msg or "does not exist" in error_msg:
                                models = await self.list_models()
                                return {
                                    "connected": True,
                                    "message": f"Connected but model '{self.model}' not found. Try: gemini-2.0-flash-exp",
                                    "models": models
                                }
                        except json.JSONDecodeError:
                            pass
                        
                        return {
                            "connected": False,
                            "message": f"Google API error: {error_text}",
                            "models": []
                        }
                    
                    if response.status == 401 or response.status == 403:
                        return {
                            "connected": False,
                            "message": "Invalid API key or insufficient permissions",
                            "models": []
                        }
                    
                    if response.status != 200:
                        error_text = await response.text()
                        return {
                            "connected": False,
                            "message": f"Google API error (status {response.status}): {error_text}",
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
                "message": f"Cannot connect to Google AI API: {str(e)}",
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
        return "Google Gemini"

