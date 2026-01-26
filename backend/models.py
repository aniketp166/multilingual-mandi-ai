"""
Pydantic models for API requests and responses
Consistent response format for all endpoints
"""

from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, validator
from datetime import datetime


# Standard API Response Models
class ErrorDetail(BaseModel):
    """Error detail model"""
    message: str
    code: str
    field: Optional[str] = None


class APIResponse(BaseModel):
    """Standard API response format"""
    success: bool
    data: Optional[Any] = None
    error: Optional[ErrorDetail] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# Translation Models
class TranslationRequest(BaseModel):
    """Translation request model"""
    text: str = Field(..., min_length=1, max_length=1000)
    source_language: str = Field(..., min_length=2, max_length=5)
    target_language: str = Field(..., min_length=2, max_length=5)
    context: Optional[str] = Field(None, max_length=100)
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError("Text cannot be empty or whitespace only")
        return v.strip()
    
    @validator('source_language', 'target_language')
    def validate_language_codes(cls, v):
        # Basic language code validation
        valid_codes = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa']
        if v.lower() not in valid_codes:
            raise ValueError(f"Unsupported language code: {v}")
        return v.lower()


class TranslationResponse(BaseModel):
    """Translation response model"""
    translated_text: str
    original_text: str
    source_language: str
    target_language: str
    confidence: float = Field(ge=0.0, le=1.0)
    error_flag: bool = False


# Price Discovery Models
class PriceDiscoveryRequest(BaseModel):
    """Price discovery request model"""
    product_name: str = Field(..., min_length=1, max_length=100)
    current_price: Optional[float] = Field(None, gt=0)
    quantity: int = Field(..., gt=0, le=10000)
    location: Optional[str] = Field("India", max_length=100)
    
    @validator('product_name')
    def validate_product_name(cls, v):
        if not v.strip():
            raise ValueError("Product name cannot be empty")
        return v.strip().title()


class PriceDiscoveryResponse(BaseModel):
    """Price discovery response model"""
    min_price: float = Field(gt=0)
    max_price: float = Field(gt=0)
    recommended_price: float = Field(gt=0)
    reasoning: str
    market_trend: str = Field(pattern="^(rising|falling|stable)$")
    confidence: float = Field(ge=0.0, le=1.0)
    
    @validator('max_price')
    def validate_price_range(cls, v, values):
        if 'min_price' in values and v <= values['min_price']:
            raise ValueError("Max price must be greater than min price")
        return v
    
    @validator('recommended_price')
    def validate_recommended_price(cls, v, values):
        if 'min_price' in values and 'max_price' in values:
            if not (values['min_price'] <= v <= values['max_price']):
                raise ValueError("Recommended price must be within min-max range")
        return v


# Negotiation Models
class NegotiationMessage(BaseModel):
    """Single negotiation message"""
    sender: str = Field(pattern="^(vendor|buyer)$")
    text: str = Field(..., min_length=1, max_length=500)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class NegotiationRequest(BaseModel):
    """Negotiation assistance request model"""
    product_name: str = Field(..., min_length=1, max_length=100)
    vendor_price: float = Field(..., gt=0)
    buyer_message: str = Field(..., min_length=1, max_length=500)
    conversation_history: List[str] = Field(default=[], max_items=10)
    vendor_language: str = Field(default="en", min_length=2, max_length=5)
    
    @validator('conversation_history')
    def validate_history(cls, v):
        # Limit history length and validate each message
        return [msg[:200] for msg in v[-5:]]  # Keep last 5 messages, truncate each


class NegotiationResponse(BaseModel):
    """Negotiation assistance response model"""
    suggestions: List[str] = Field(..., min_items=1, max_items=3)
    tone: str = Field(pattern="^(friendly|professional|firm)$")
    context: str
    
    @validator('suggestions')
    def validate_suggestions(cls, v):
        # Ensure all suggestions are non-empty and reasonable length
        validated = []
        for suggestion in v:
            if suggestion and suggestion.strip():
                validated.append(suggestion.strip()[:200])
        if not validated:
            raise ValueError("At least one valid suggestion is required")
        return validated


# Health Check Models
class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = "healthy"
    service: str
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    features: Dict[str, bool] = {}
    uptime_seconds: Optional[float] = None


class VersionResponse(BaseModel):
    """Version information response"""
    app_name: str
    version: str
    environment: str
    build_time: Optional[str] = None
    git_commit: Optional[str] = None


# Utility functions for creating consistent responses
def create_success_response(data: Any) -> Dict[str, Any]:
    """Create a successful API response"""
    return APIResponse(
        success=True,
        data=data,
        error=None
    ).dict()


def create_error_response(
    message: str, 
    code: str = "GENERAL_ERROR", 
    field: Optional[str] = None
) -> Dict[str, Any]:
    """Create an error API response"""
    return APIResponse(
        success=False,
        data=None,
        error=ErrorDetail(
            message=message,
            code=code,
            field=field
        )
    ).dict()


def create_validation_error_response(errors: List[Dict]) -> Dict[str, Any]:
    """Create a validation error response from Pydantic errors"""
    error_messages = []
    for error in errors:
        field = ".".join(str(loc) for loc in error.get("loc", []))
        message = error.get("msg", "Validation error")
        error_messages.append(f"{field}: {message}" if field else message)
    
    return create_error_response(
        message="; ".join(error_messages),
        code="VALIDATION_ERROR"
    )


# Rate limiting models
class RateLimitInfo(BaseModel):
    """Rate limit information"""
    requests_remaining: int
    reset_time: datetime
    window_seconds: int