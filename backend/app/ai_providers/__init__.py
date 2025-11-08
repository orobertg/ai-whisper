"""
AI Providers Module

This module provides a unified interface for multiple AI providers:
- Ollama (local)
- OpenAI
- Anthropic
- Google Gemini
- DeepSeek

Usage:
    from app.ai_providers import create_provider
    
    # Create an Ollama provider
    ollama = create_provider("ollama", model="llama3.2:latest")
    
    # Create an OpenAI provider
    openai = create_provider("openai", api_key="sk-...", model="gpt-4o-mini")
    
    # Send a chat message
    response = await ollama.chat([
        {"role": "user", "content": "Hello!"}
    ])
"""

from .base import AIProvider
from .ollama import OllamaProvider
from .openai_provider import OpenAIProvider
from .anthropic import AnthropicProvider
from .google import GoogleProvider
from .deepseek import DeepSeekProvider
from .factory import ProviderFactory, create_provider

__all__ = [
    "AIProvider",
    "OllamaProvider",
    "OpenAIProvider",
    "AnthropicProvider",
    "GoogleProvider",
    "DeepSeekProvider",
    "ProviderFactory",
    "create_provider",
]

