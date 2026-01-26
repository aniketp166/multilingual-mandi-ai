"""
Pydantic Settings for Multilingual Mandi Backend
Following FastAPI best practices with BaseSettings
"""

from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings using Pydantic BaseSettings
    All configuration comes from environment variables
    """
    
    # App Information
    app_name: str = Field(default="Multilingual Mandi API")
    app_version: str = Field(default="1.0.0")
    
    # Server Configuration
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)
    debug: bool = Field(default=False)
    environment: str = Field(default="development")
    
    # CORS Configuration - MUST come from env
    cors_origins: str = Field(default="http://localhost:3000")
    cors_allow_credentials: bool = Field(default=True)
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100)
    rate_limit_window: int = Field(default=60)
    enable_rate_limiting: bool = Field(default=True)
    
    # Input Validation
    max_input_length: int = Field(default=1000)
    max_translation_length: int = Field(default=500)
    max_negotiation_history: int = Field(default=10)
    
    # AI Services Configuration
    gemini_api_key: str = Field(default="demo-key")
    gemini_model: str = Field(default="gemini-pro")
    gemini_temperature: float = Field(default=0.7)
    gemini_max_tokens: int = Field(default=1000)
    
    # Service Configuration
    translation_service: str = Field(default="gemini")
    translation_cache_ttl: int = Field(default=3600)
    
    price_discovery_service: str = Field(default="gemini")
    price_cache_ttl: int = Field(default=1800)
    
    negotiation_service: str = Field(default="gemini")
    negotiation_max_suggestions: int = Field(default=3)
    
    # Logging Configuration
    log_level: str = Field(default="INFO")
    log_format: str = Field(default="json")
    
    # Security Configuration
    secret_key: str = Field(default="demo-secret-key-change-in-production")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expiration: int = Field(default=86400)
    
    # Database Configuration
    database_url: str = Field(default="sqlite:///./multilingual_mandi.db")
    
    # Redis Configuration (optional)
    redis_url: Optional[str] = Field(default=None)
    
    # Feature Flags
    enable_caching: bool = Field(default=True)
    enable_metrics: bool = Field(default=False)
    enable_swagger_ui: bool = Field(default=True)
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }
    
    @field_validator('port')
    @classmethod
    def validate_port(cls, v: int) -> int:
        """Validate port range"""
        if not (1 <= v <= 65535):
            raise ValueError("PORT must be between 1 and 65535")
        return v
    
    @field_validator('gemini_temperature')
    @classmethod
    def validate_temperature(cls, v: float) -> float:
        """Validate Gemini temperature range"""
        if not (0.0 <= v <= 1.0):
            raise ValueError("GEMINI_TEMPERATURE must be between 0.0 and 1.0")
        return v
    
    @field_validator('log_level')
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level"""
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of: {', '.join(valid_levels)}")
        return v.upper()
    
    @field_validator('environment')
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment"""
        valid_envs = ['development', 'staging', 'production', 'testing']
        if v.lower() not in valid_envs:
            raise ValueError(f"ENVIRONMENT must be one of: {', '.join(valid_envs)}")
        return v.lower()
    
    # Computed properties
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.environment == 'development'
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.environment == 'production'
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Get CORS origins as list"""
        if isinstance(self.cors_origins, list):
            return self.cors_origins
        if not self.cors_origins:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


class APIEndpoints:
    """API endpoint paths - centralized configuration"""
    
    # Health check
    HEALTH = "/health"
    
    # API prefix
    API_PREFIX = "/api"
    
    # Translation endpoints
    TRANSLATE = f"{API_PREFIX}/translate"
    
    # Price discovery endpoints
    PRICE_SUGGEST = f"{API_PREFIX}/price-suggest"
    
    # Negotiation endpoints
    NEGOTIATE = f"{API_PREFIX}/negotiate"
    
    # WebSocket endpoints
    WEBSOCKET = "/ws/{client_id}"


class AIServiceConfig:
    """AI service configuration injected into services"""
    
    def __init__(self, settings: Settings):
        self._settings = settings
    
    @property
    def gemini_config(self) -> dict:
        """Get Gemini API configuration"""
        return {
            "api_key": self._settings.gemini_api_key,
            "model": self._settings.gemini_model,
            "temperature": self._settings.gemini_temperature,
            "max_tokens": self._settings.gemini_max_tokens,
        }
    
    @property
    def translation_config(self) -> dict:
        """Get translation service configuration"""
        return {
            "service": self._settings.translation_service,
            "cache_ttl": self._settings.translation_cache_ttl,
            "max_length": self._settings.max_translation_length,
        }
    
    @property
    def price_discovery_config(self) -> dict:
        """Get price discovery configuration"""
        return {
            "service": self._settings.price_discovery_service,
            "cache_ttl": self._settings.price_cache_ttl,
        }
    
    @property
    def negotiation_config(self) -> dict:
        """Get negotiation assistant configuration"""
        return {
            "service": self._settings.negotiation_service,
            "max_suggestions": self._settings.negotiation_max_suggestions,
        }


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


def get_ai_config(settings: Settings) -> AIServiceConfig:
    """Get AI service configuration"""
    return AIServiceConfig(settings)


def validate_settings(settings: Settings) -> None:
    """Validate settings and raise errors for critical issues"""
    errors = []
    
    # Check CORS origins
    if not settings.cors_origins_list:
        errors.append("At least one CORS origin must be specified")
    
    if errors:
        error_msg = "Configuration validation failed:\n" + "\n".join(f"  - {error}" for error in errors)
        raise ValueError(error_msg)


def log_settings(settings: Settings) -> None:
    """Log configuration for development (excluding sensitive data)"""
    if settings.is_development:
        print("🔧 Multilingual Mandi Backend Configuration")
        print(f"Host: {settings.host}:{settings.port}")
        print(f"Environment: {settings.environment}")
        print(f"Debug: {settings.debug}")
        print(f"CORS Origins: {settings.cors_origins_list}")
        print(f"Features: Caching={settings.enable_caching}, Rate Limiting={settings.enable_rate_limiting}")
        print("-" * 50)


# Export commonly used instances
api_endpoints = APIEndpoints()