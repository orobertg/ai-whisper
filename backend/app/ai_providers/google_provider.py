"""
Google Gemini Provider Implementation

Cloud AI provider using Google's Gemini models.
"""

import google.generativeai as genai
from typing import List, Dict, AsyncIterator
from .base import (
    AIProvider, 
    ProviderError, 
    ProviderConnectionError,
    ProviderAuthenticationError,
    ProviderRateLimitError
)


class GoogleProvider(AIProvider):
    """Google Gemini provider."""
    
    def __init__(self, config: Dict):
        """
        Initialize Google provider.
        
        Args:
            config: Dict with 'api_key' and 'model'
        """
        super().__init__(config)
        self.name = "google"
        self.api_key = config.get("api_key")
        self.model_name = config.get("model", "gemini-1.5-pro")
        
        if not self.api_key:
            raise ProviderAuthenticationError(
                "API key is required",
                self.name,
                "Please provide your Google API key"
            )
        
        # Configure API
        genai.configure(api_key=self.api_key)
        
        # Initialize model
        self.model = genai.GenerativeModel(self.model_name)
    
    def _convert_messages(self, messages: List[Dict[str, str]]) -> List[Dict]:
        """Convert messages to Gemini format."""
        gemini_messages = []
        system_instruction = None
        
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                system_instruction = content
            elif role == "assistant":
                gemini_messages.append({
                    "role": "model",
                    "parts": [content]
                })
            else:  # user
                gemini_messages.append({
                    "role": "user",
                    "parts": [content]
                })
        
        return gemini_messages, system_instruction
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> str:
        """Send messages to Google Gemini and get response."""
        try:
            gemini_messages, system_instruction = self._convert_messages(messages)
            
            # Create generation config
            generation_config = {
                "temperature": kwargs.get("temperature", 0.7),
                "top_p": kwargs.get("top_p", 0.95),
                "max_output_tokens": kwargs.get("max_tokens", 2048),
            }
            
            # If there's a system instruction, create model with it
            if system_instruction:
                model = genai.GenerativeModel(
                    self.model_name,
                    system_instruction=system_instruction
                )
            else:
                model = self.model
            
            # Start chat with history
            chat = model.start_chat(history=gemini_messages[:-1] if len(gemini_messages) > 1 else [])
            
            # Send last message
            last_message = gemini_messages[-1]["parts"][0] if gemini_messages else "Hello"
            response = await chat.send_message_async(
                last_message,
                generation_config=generation_config
            )
            
            return response.text
            
        except Exception as e:
            error_str = str(e).lower()
            
            if "api_key" in error_str or "auth" in error_str:
                raise ProviderAuthenticationError(
                    "Invalid API key",
                    self.name,
                    "Please check your Google API key"
                )
            elif "quota" in error_str or "rate" in error_str:
                raise ProviderRateLimitError(
                    "Rate limit exceeded",
                    self.name,
                    "Please wait before making more requests"
                )
            else:
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
        """Stream response from Google Gemini."""
        try:
            gemini_messages, system_instruction = self._convert_messages(messages)
            
            # Create generation config
            generation_config = {
                "temperature": kwargs.get("temperature", 0.7),
                "top_p": kwargs.get("top_p", 0.95),
                "max_output_tokens": kwargs.get("max_tokens", 2048),
            }
            
            # If there's a system instruction, create model with it
            if system_instruction:
                model = genai.GenerativeModel(
                    self.model_name,
                    system_instruction=system_instruction
                )
            else:
                model = self.model
            
            # Start chat with history
            chat = model.start_chat(history=gemini_messages[:-1] if len(gemini_messages) > 1 else [])
            
            # Send last message with streaming
            last_message = gemini_messages[-1]["parts"][0] if gemini_messages else "Hello"
            response = await chat.send_message_async(
                last_message,
                generation_config=generation_config,
                stream=True
            )
            
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            raise ProviderError(
                "Streaming error",
                self.name,
                str(e)
            )
    
    async def list_models(self) -> List[str]:
        """Get list of available Google Gemini models."""
        try:
            # Get models from API
            models = []
            for model in genai.list_models():
                if "generateContent" in model.supported_generation_methods:
                    models.append(model.name.replace("models/", ""))
            
            return models if models else [
                "gemini-1.5-pro",
                "gemini-1.5-flash",
                "gemini-1.0-pro"
            ]
            
        except Exception as e:
            # Return default models if API call fails
            return [
                "gemini-1.5-pro",
                "gemini-1.5-flash",
                "gemini-1.0-pro"
            ]
    
    async def test_connection(self) -> Dict:
        """Test Google Gemini connection."""
        import time
        start_time = time.time()
        
        try:
            # Test with a minimal message
            test_response = await self.model.generate_content_async(
                "test",
                generation_config={"max_output_tokens": 10}
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            models = await self.list_models()
            
            return {
                "connected": True,
                "message": f"Connected to Google Gemini (model: {self.model_name})",
                "latency_ms": latency_ms,
                "model_count": len(models),
                "models": models
            }
            
        except Exception as e:
            error_str = str(e).lower()
            
            if "api_key" in error_str or "auth" in error_str:
                return {
                    "connected": False,
                    "message": "Invalid API key",
                    "error": "Please check your Google API key in settings"
                }
            else:
                return {
                    "connected": False,
                    "message": "Connection test failed",
                    "error": str(e)
                }

