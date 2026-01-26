from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
import logging
import time
from datetime import datetime
from collections import defaultdict
from typing import Dict

from settings import get_settings, get_ai_config, api_endpoints, validate_settings, log_settings
from models import (
    APIResponse, 
    create_success_response, 
    create_error_response, 
    create_validation_error_response,
    HealthResponse,
    VersionResponse,
    TranslationRequest,
    TranslationResponse,
    PriceDiscoveryRequest,
    PriceDiscoveryResponse,
    NegotiationRequest,
    NegotiationResponse
)
from prompts import PromptTemplates, get_fallback_price, get_fallback_negotiation

# Get settings instance
settings = get_settings()

# Validate settings at startup
try:
    validate_settings(settings)
except ValueError as e:
    print(f"❌ Configuration Error: {e}")
    exit(1)

# Configure structured logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s' if settings.log_format != 'json' 
           else '{"timestamp": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s"}'
)
logger = logging.getLogger(__name__)

# Log configuration in development (never log secrets)
if settings.is_development:
    log_settings(settings)

# Get AI configuration
ai_config = get_ai_config(settings)

# Rate limiting storage (in production, use Redis)
rate_limit_storage: Dict[str, Dict] = defaultdict(lambda: {"requests": 0, "reset_time": time.time()})
app_start_time = time.time()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Real-time linguistic bridge for local trade with AI-driven features",
    docs_url="/docs" if settings.enable_swagger_ui else None,
    redoc_url="/redoc" if settings.enable_swagger_ui else None,
)

# CORS middleware using settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware
async def rate_limit_middleware(request: Request, call_next):
    """Simple rate limiting middleware"""
    if not settings.enable_rate_limiting:
        return await call_next(request)
    
    client_ip = request.client.host
    current_time = time.time()
    
    # Reset window if needed
    if current_time > rate_limit_storage[client_ip]["reset_time"]:
        rate_limit_storage[client_ip] = {
            "requests": 0,
            "reset_time": current_time + settings.rate_limit_window
        }
    
    # Check rate limit
    if rate_limit_storage[client_ip]["requests"] >= settings.rate_limit_requests:
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        return JSONResponse(
            status_code=429,
            content=create_error_response(
                "Rate limit exceeded. Please try again later.",
                "RATE_LIMIT_EXCEEDED"
            )
        )
    
    # Increment request count
    rate_limit_storage[client_ip]["requests"] += 1
    
    response = await call_next(request)
    
    # Add rate limit headers
    response.headers["X-RateLimit-Limit"] = str(settings.rate_limit_requests)
    response.headers["X-RateLimit-Remaining"] = str(
        settings.rate_limit_requests - rate_limit_storage[client_ip]["requests"]
    )
    response.headers["X-RateLimit-Reset"] = str(int(rate_limit_storage[client_ip]["reset_time"]))
    
    return response

app.middleware("http")(rate_limit_middleware)

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with consistent format"""
    logger.warning(f"Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content=create_validation_error_response(exc.errors())
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format"""
    logger.error(f"HTTP error {exc.status_code} on {request.url}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            str(exc.detail),
            f"HTTP_{exc.status_code}"
        )
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unexpected error on {request.url}: {exc}", exc_info=True)
    
    if settings.is_development:
        return JSONResponse(
            status_code=500,
            content=create_error_response(
                str(exc),
                "INTERNAL_ERROR"
            )
        )
    else:
        return JSONResponse(
            status_code=500,
            content=create_error_response(
                "Internal server error",
                "INTERNAL_ERROR"
            )
        )

# Health and version endpoints
@app.get("/health", response_model=Dict)
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    
    health_data = HealthResponse(
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        features={
            "caching": settings.enable_caching,
            "rate_limiting": settings.enable_rate_limiting,
            "metrics": settings.enable_metrics,
        },
        uptime_seconds=time.time() - app_start_time
    )
    
    return create_success_response(health_data.dict())

@app.get("/version", response_model=Dict)
async def version_info():
    """Version information endpoint"""
    version_data = VersionResponse(
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment
    )
    
    return create_success_response(version_data.dict())

@app.get("/", response_model=Dict)
async def root():
    """Root endpoint"""
    logger.info("Root endpoint accessed")
    
    root_data = {
        "message": "Multilingual Mandi API - Empowering Local Trade with AI",
        "status": "running",
        "challenge": "26 Jan Prompt Challenge - Viksit Bharat",
        "version": settings.app_version,
        "environment": settings.environment,
        "docs_url": "/docs" if settings.enable_swagger_ui else None,
        "endpoints": {
            "health": "/health",
            "version": "/version",
            "translate": api_endpoints.TRANSLATE,
            "price_suggest": api_endpoints.PRICE_SUGGEST,
            "negotiate": api_endpoints.NEGOTIATE,
        }
    }
    
    return create_success_response(root_data)

# AI Service endpoints with fallbacks
@app.post(api_endpoints.TRANSLATE, response_model=Dict)
async def translate_text(request: TranslationRequest):
    """Translation endpoint with AI fallback"""
    logger.info(f"Translation request: {request.source_language} -> {request.target_language}")
    
    # Validate input
    is_valid, error_msg = PromptTemplates.validate_input(request.text, settings.max_translation_length)
    if not is_valid:
        logger.warning(f"Invalid translation input: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        # TODO: Implement actual AI translation
        # For now, return fallback response
        logger.warning("AI translation not implemented, using fallback")
        
        fallback_response = TranslationResponse(
            translated_text=request.text,  # Return original text as fallback
            original_text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
            confidence=0.0,
            error_flag=True
        )
        
        return create_success_response(fallback_response.dict())
        
    except Exception as e:
        logger.error(f"Translation service error: {e}")
        
        # Return safe fallback
        fallback_response = TranslationResponse(
            translated_text=request.text,
            original_text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
            confidence=0.0,
            error_flag=True
        )
        
        return create_success_response(fallback_response.dict())

@app.post(api_endpoints.PRICE_SUGGEST, response_model=Dict)
async def suggest_price(request: PriceDiscoveryRequest):
    """Price suggestion endpoint with fallback"""
    logger.info(f"Price discovery request for: {request.product_name}")
    
    try:
        # TODO: Implement actual AI price discovery
        # For now, return fallback response
        logger.warning("AI price discovery not implemented, using fallback")
        
        fallback_data = get_fallback_price(request.product_name)
        
        price_response = PriceDiscoveryResponse(
            min_price=fallback_data["min_price"],
            max_price=fallback_data["max_price"],
            recommended_price=fallback_data["recommended_price"],
            reasoning=fallback_data["reasoning"],
            market_trend=fallback_data["market_trend"],
            confidence=fallback_data["confidence"]
        )
        
        return create_success_response(price_response.dict())
        
    except Exception as e:
        logger.error(f"Price discovery service error: {e}")
        
        # Return safe fallback
        fallback_data = get_fallback_price(request.product_name)
        price_response = PriceDiscoveryResponse(**fallback_data)
        
        return create_success_response(price_response.dict())

@app.post(api_endpoints.NEGOTIATE, response_model=Dict)
async def negotiate_assistance(request: NegotiationRequest):
    """Negotiation assistance endpoint with fallback"""
    logger.info(f"Negotiation request for: {request.product_name}")
    
    # Validate input
    is_valid, error_msg = PromptTemplates.validate_input(request.buyer_message, 500)
    if not is_valid:
        logger.warning(f"Invalid negotiation input: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        # TODO: Implement actual AI negotiation
        # For now, return fallback response
        logger.warning("AI negotiation not implemented, using fallback")
        
        fallback_data = get_fallback_negotiation()
        
        negotiation_response = NegotiationResponse(
            suggestions=fallback_data["suggestions"],
            tone=fallback_data["tone"],
            context=fallback_data["context"]
        )
        
        return create_success_response(negotiation_response.dict())
        
    except Exception as e:
        logger.error(f"Negotiation service error: {e}")
        
        # Return safe fallback
        fallback_data = get_fallback_negotiation()
        negotiation_response = NegotiationResponse(**fallback_data)
        
        return create_success_response(negotiation_response.dict())

if __name__ == "__main__":
    logger.info(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"📝 Environment: {settings.environment}")
    logger.info(f"🔧 Debug mode: {settings.debug}")
    logger.info(f"🌐 CORS origins: {len(settings.cors_origins_list)} configured")
    
    uvicorn.run(
        "main:app", 
        host=settings.host, 
        port=settings.port, 
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )