"""
AI Provider Factory

Centralized factory for creating and managing AI provider instances.
"""

from typing import Dict, Optional, Type
from .base import AIProvider
from .ollama import OllamaProvider
from .openai_provider import OpenAIProvider
from .anthropic import AnthropicProvider
from .google import GoogleProvider
from .deepseek import DeepSeekProvider


class ProviderFactory:
    """Factory for creating AI provider instances"""
    
    _providers: Dict[str, Type[AIProvider]] = {
        "ollama": OllamaProvider,
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
        "google": GoogleProvider,
        "deepseek": DeepSeekProvider,
    }
    
    @classmethod
    def get_provider_names(cls) -> list[str]:
        """Get list of all available provider names"""
        return list(cls._providers.keys())
    
    @classmethod
    def create_provider(cls, provider_name: str, **config) -> AIProvider:
        """
        Create an AI provider instance.
        
        Args:
            provider_name: Name of the provider (ollama, openai, anthropic, google, deepseek)
            **config: Provider-specific configuration
            
        Returns:
            Instance of the requested provider
            
        Raises:
            ValueError: If provider_name is not supported
            
        Examples:
            # Create Ollama provider
            ollama = ProviderFactory.create_provider(
                "ollama",
                base_url="http://localhost:11434",
                model="llama3.2:latest"
            )
            
            # Create OpenAI provider
            openai = ProviderFactory.create_provider(
                "openai",
                api_key="sk-...",
                model="gpt-4o-mini"
            )
        """
        provider_name_lower = provider_name.lower()
        
        if provider_name_lower not in cls._providers:
            available = ", ".join(cls._providers.keys())
            raise ValueError(
                f"Unknown provider '{provider_name}'. "
                f"Available providers: {available}"
            )
        
        provider_class = cls._providers[provider_name_lower]
        return provider_class(**config)
    
    @classmethod
    def register_provider(cls, name: str, provider_class: Type[AIProvider]):
        """
        Register a new provider type.
        
        Args:
            name: Name to register the provider under
            provider_class: Provider class (must inherit from AIProvider)
        """
        if not issubclass(provider_class, AIProvider):
            raise ValueError(f"{provider_class} must inherit from AIProvider")
        
        cls._providers[name.lower()] = provider_class
    
    @classmethod
    def get_provider_info(cls) -> Dict[str, Dict]:
        """
        Get information about all available providers.
        
        Returns:
            Dict mapping provider names to their info
        """
        info = {}
        for name, provider_class in cls._providers.items():
            # Create a temporary instance to get display name
            # Use minimal dummy config
            try:
                if name == "ollama":
                    instance = provider_class()
                else:
                    instance = provider_class(api_key="dummy")
                
                info[name] = {
                    "display_name": instance.get_display_name(),
                    "requires_api_key": name != "ollama",
                    "supports_streaming": True,
                    "class_name": provider_class.__name__
                }
            except Exception:
                # Fallback info if instantiation fails
                info[name] = {
                    "display_name": name.title(),
                    "requires_api_key": name != "ollama",
                    "supports_streaming": True,
                    "class_name": provider_class.__name__
                }
        
        return info


# Convenience function
def create_provider(provider_name: str, **config) -> AIProvider:
    """
    Convenience wrapper for ProviderFactory.create_provider
    
    Args:
        provider_name: Name of the provider
        **config: Provider-specific configuration
        
    Returns:
        Instance of the requested provider
    """
    return ProviderFactory.create_provider(provider_name, **config)
