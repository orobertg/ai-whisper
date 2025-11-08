"""
Base AI Provider Interface

This module defines the abstract base class that all AI providers must implement.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional, AsyncIterator


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    def __init__(self, **config):
        """
        Initialize the provider with configuration.
        
        Args:
            **config: Provider-specific configuration parameters
        """
        self.config = config
    
    @abstractmethod
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """
        Send messages to the AI and get a complete response.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens in response
            **kwargs: Additional provider-specific parameters
            
        Returns:
            The AI's response as a string
            
        Raises:
            ConnectionError: If unable to connect to provider
            ValueError: If invalid parameters
        """
        pass
    
    @abstractmethod
    async def stream_chat(
        self, 
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """
        Stream the AI response token by token.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens in response
            **kwargs: Additional provider-specific parameters
            
        Yields:
            Response tokens as they arrive
            
        Raises:
            ConnectionError: If unable to connect to provider
            ValueError: If invalid parameters
        """
        pass
    
    @abstractmethod
    async def list_models(self) -> List[str]:
        """
        Get list of available models from this provider.
        
        Returns:
            List of model identifiers
            
        Raises:
            ConnectionError: If unable to connect to provider
        """
        pass
    
    @abstractmethod
    async def test_connection(self) -> Dict[str, any]:
        """
        Test if the provider is accessible and configured correctly.
        
        Returns:
            Dict with keys:
                - 'connected': bool, True if connection successful
                - 'message': str, Status message
                - 'models': List[str], Available models (if connected)
                
        Example:
            {
                'connected': True,
                'message': 'Connected successfully',
                'models': ['llama3.2:latest', 'mistral:latest']
            }
        """
        pass
    
    @property
    def provider_name(self) -> str:
        """Get the name of this provider"""
        return self.__class__.__name__.replace('Provider', '')
    
    def get_display_name(self) -> str:
        """Get user-friendly display name"""
        return self.provider_name
