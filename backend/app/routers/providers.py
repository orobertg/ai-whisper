"""
AI Providers API Router

Endpoints for managing and testing AI provider configurations.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from sqlmodel import Session

from ..ai_providers import ProviderFactory, create_provider
from ..database import get_session


router = APIRouter(prefix="/providers", tags=["providers"])


# Request/Response Models
class ProviderConfig(BaseModel):
    """Configuration for an AI provider"""
    name: str = Field(..., description="Provider name (ollama, openai, anthropic, google, deepseek)")
    model: str = Field(default="", description="Model to use (can be empty for testing)")
    api_key: Optional[str] = Field(None, description="API key (not required for Ollama)")
    base_url: Optional[str] = Field(None, description="Custom base URL")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "ollama",
                "model": "llama3.2:latest",
                "base_url": "http://localhost:11434"
            }
        }


class ProviderTestResponse(BaseModel):
    """Response from provider connection test"""
    provider: str
    connected: bool
    message: str
    models: List[str] = []


class ProviderInfo(BaseModel):
    """Information about a provider"""
    name: str
    display_name: str
    requires_api_key: bool
    supports_streaming: bool


@router.get("/list", response_model=List[ProviderInfo])
async def list_providers():
    """
    Get list of all available AI providers.
    
    Returns information about each provider including whether it requires an API key.
    """
    provider_info = ProviderFactory.get_provider_info()
    
    return [
        ProviderInfo(
            name=name,
            display_name=info["display_name"],
            requires_api_key=info["requires_api_key"],
            supports_streaming=info["supports_streaming"]
        )
        for name, info in provider_info.items()
    ]


@router.post("/test", response_model=ProviderTestResponse)
async def test_provider(config: ProviderConfig):
    """
    Test connection to an AI provider.
    
    This endpoint creates a provider instance with the given configuration
    and attempts to connect to verify the settings are correct.
    
    Args:
        config: Provider configuration including name, model, and credentials
        
    Returns:
        Test results including connection status and available models
        
    Example:
        POST /api/providers/test
        {
            "name": "ollama",
            "model": "llama3.2:latest",
            "base_url": "http://localhost:11434"
        }
    """
    print(f"🔍 Received test request for provider: {config.name}")
    print(f"📝 Model: {config.model}")
    print(f"🔑 API Key provided: {bool(config.api_key)}")
    print(f"🌐 Base URL: {config.base_url}")
    
    try:
        # Use a default model if none provided (for testing API key)
        model_to_use = config.model if config.model else {
            "openai": "gpt-4o-mini",
            "anthropic": "claude-3-5-sonnet-20241022",
            "google": "gemini-2.0-flash-exp",
            "deepseek": "deepseek-chat",
            "ollama": "llama3.2:latest"
        }.get(config.name, "")
        
        # Build provider config
        provider_config = {"model": model_to_use}
        
        if config.api_key:
            provider_config["api_key"] = config.api_key
        
        if config.base_url:
            provider_config["base_url"] = config.base_url
        
        print(f"✅ Using model: {model_to_use}")
        
        # Create provider instance
        try:
            provider = create_provider(config.name, **provider_config)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Test connection
        result = await provider.test_connection()
        
        return ProviderTestResponse(
            provider=config.name,
            connected=result["connected"],
            message=result["message"],
            models=result.get("models", [])
        )
    
    except Exception as e:
        return ProviderTestResponse(
            provider=config.name,
            connected=False,
            message=f"Error testing provider: {str(e)}",
            models=[]
        )


@router.post("/models", response_model=List[str])
async def list_provider_models(config: ProviderConfig):
    """
    Get list of available models for a provider.
    
    Args:
        config: Provider configuration
        
    Returns:
        List of available model identifiers
        
    Example:
        POST /api/providers/models
        {
            "name": "ollama",
            "base_url": "http://localhost:11434"
        }
    """
    try:
        # Build provider config
        provider_config = {}
        
        if config.model:
            provider_config["model"] = config.model
        
        if config.api_key:
            provider_config["api_key"] = config.api_key
        
        if config.base_url:
            provider_config["base_url"] = config.base_url
        
        # Create provider instance
        try:
            provider = create_provider(config.name, **provider_config)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # List models
        models = await provider.list_models()
        return models
    
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing models: {str(e)}")


@router.get("/info/{provider_name}")
async def get_provider_info(provider_name: str):
    """
    Get detailed information about a specific provider.
    
    Args:
        provider_name: Name of the provider (ollama, openai, etc.)
        
    Returns:
        Provider information
    """
    provider_info = ProviderFactory.get_provider_info()
    
    if provider_name.lower() not in provider_info:
        raise HTTPException(
            status_code=404,
            detail=f"Provider '{provider_name}' not found. Available: {', '.join(provider_info.keys())}"
        )
    
    info = provider_info[provider_name.lower()]
    return {
        "name": provider_name.lower(),
        **info
    }

