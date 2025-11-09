"""
AI Provider Configuration API Routes

Endpoints for managing AI provider configurations, testing connections,
and listing available models.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from app.ai_providers import ProviderFactory, create_provider

router = APIRouter(prefix="/providers", tags=["providers"])


# Request/Response Models
class ProviderConfigRequest(BaseModel):
    """Request to test a provider configuration."""
    provider: str
    config: Dict


class TestConnectionResponse(BaseModel):
    """Response from connection test."""
    connected: bool
    message: str
    latency_ms: Optional[int] = None
    model_count: Optional[int] = None
    models: Optional[List[str]] = None
    error: Optional[str] = None


class ListModelsResponse(BaseModel):
    """Response from list models request."""
    provider: str
    models: List[str]


class ProviderInfoResponse(BaseModel):
    """Information about a provider."""
    name: str
    description: str
    requires_api_key: bool
    config_fields: List[str]
    default_config: Dict


# Endpoints
@router.get("/available")
async def get_available_providers():
    """
    Get list of all available AI providers.
    
    Returns:
        List of provider names
    """
    return {
        "providers": ProviderFactory.get_provider_names()
    }


@router.get("/info")
async def get_providers_info():
    """
    Get detailed information about all available providers.
    
    Returns:
        Dictionary mapping provider names to their information
    """
    return ProviderFactory.get_provider_info()


@router.get("/info/{provider_name}")
async def get_single_provider_info(provider_name: str):
    """
    Get information about a specific provider.
    
    Args:
        provider_name: Name of the provider
    
    Returns:
        Provider information
    """
    info = ProviderFactory.get_provider_info()
    
    if provider_name.lower() not in info:
        raise HTTPException(
            status_code=404,
            detail=f"Provider '{provider_name}' not found"
        )
    
    return {
        "name": provider_name.lower(),
        **info[provider_name.lower()]
    }


@router.post("/test", response_model=TestConnectionResponse)
async def test_provider_connection(request: ProviderConfigRequest):
    """
    Test connection to an AI provider.
    
    Args:
        request: Provider configuration to test
    
    Returns:
        Connection test results
    """
    try:
        # Handle Docker networking for Ollama
        config = request.config.copy()
        if request.provider == "ollama" and "base_url" in config:
            base_url = config["base_url"]
            # Replace localhost/127.0.0.1 with host.docker.internal for Docker
            if "localhost" in base_url or "127.0.0.1" in base_url:
                config["base_url"] = base_url.replace("localhost", "host.docker.internal").replace("127.0.0.1", "host.docker.internal")
        
        # Create provider instance
        provider = create_provider(request.provider, **config)
        
        # Test connection
        result = await provider.test_connection()
        
        # Convert to response format
        return TestConnectionResponse(
            connected=result["connected"],
            message=result["message"],
            models=result.get("models", []),
            model_count=len(result.get("models", []))
        )
        
    except ValueError as e:
        return TestConnectionResponse(
            connected=False,
            message="Invalid provider configuration",
            error=str(e)
        )
    except ConnectionError as e:
        return TestConnectionResponse(
            connected=False,
            message="Connection failed",
            error=str(e)
        )
    except Exception as e:
        return TestConnectionResponse(
            connected=False,
            message="Unexpected error",
            error=str(e)
        )


@router.post("/models", response_model=ListModelsResponse)
async def list_provider_models(request: ProviderConfigRequest):
    """
    List available models for a provider.
    
    Args:
        request: Provider configuration
    
    Returns:
        List of available models
    """
    try:
        # Handle Docker networking for Ollama
        config = request.config.copy()
        if request.provider == "ollama" and "base_url" in config:
            base_url = config["base_url"]
            # Replace localhost/127.0.0.1 with host.docker.internal for Docker
            if "localhost" in base_url or "127.0.0.1" in base_url:
                config["base_url"] = base_url.replace("localhost", "host.docker.internal").replace("127.0.0.1", "host.docker.internal")
        
        # Create provider instance
        provider = create_provider(request.provider, **config)
        
        # Get models
        models = await provider.list_models()
        
        return ListModelsResponse(
            provider=request.provider,
            models=models
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid provider: {str(e)}"
        )
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to provider: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.post("/validate")
async def validate_provider_config(request: ProviderConfigRequest):
    """
    Validate a provider configuration without testing connection.
    
    Args:
        request: Provider configuration to validate
    
    Returns:
        Validation result
    """
    try:
        # Try to create provider instance
        provider = create_provider(request.provider, **request.config)
        
        return {
            "valid": True,
            "provider": request.provider,
            "message": f"Configuration is valid for {provider.get_display_name()}"
        }
        
    except ValueError as e:
        return {
            "valid": False,
            "provider": request.provider,
            "error": "configuration",
            "message": str(e)
        }
    except Exception as e:
        return {
            "valid": False,
            "provider": request.provider,
            "error": "unexpected",
            "message": str(e)
        }

