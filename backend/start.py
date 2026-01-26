#!/usr/bin/env python3
"""
Simple startup script for Multilingual Mandi Backend
Handles dependency installation and server startup
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Multilingual Mandi Backend...")
    try:
        # Import here to ensure dependencies are installed
        import uvicorn
        from main import app
        from settings import get_settings
        
        settings = get_settings()
        uvicorn.run(
            "main:app",
            host=settings.host,
            port=settings.port,
            reload=settings.debug,
            log_level=settings.log_level.lower()
        )
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Try running: pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main startup function"""
    print("🇮🇳 Multilingual Mandi Backend - 26 Jan Prompt Challenge")
    print("-" * 60)
    
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: Not running in a virtual environment")
        print("💡 Consider running: python -m venv venv && venv\\Scripts\\activate")
    
    # Install dependencies if needed
    try:
        import pydantic_settings
        import fastapi
        import uvicorn
        print("✅ Dependencies already installed")
    except ImportError:
        if not install_dependencies():
            sys.exit(1)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()