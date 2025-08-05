"""
Zynx AGI Backend API
FastAPI application with cultural awareness and ethical considerations
"""

import os
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from loguru import logger
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger.add(
    "logs/app.log",
    rotation="1 day",
    retention="30 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}"
)

# Application settings
class Settings:
    """Application settings with environment variable support"""
    def __init__(self):
        self.app_name = "Zynx AGI API"
        self.version = "1.0.0"
        self.debug = os.getenv("DEBUG", "False").lower() == "true"
        self.api_key = os.getenv("API_KEY", "")
        self.database_url = os.getenv("DATABASE_URL", "")

settings = Settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("🚀 Starting Zynx AGI Backend")
    logger.info(f"App Name: {settings.app_name}")
    logger.info(f"Version: {settings.version}")
    logger.info(f"Debug Mode: {settings.debug}")
    
    yield
    
    logger.info("🛑 Shutting down Zynx AGI Backend")

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Culturally aware AGI backend API with ethical considerations",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for API key validation
async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify API key if required"""
    if settings.api_key and x_api_key != settings.api_key:
        logger.warning(f"Invalid API key attempt: {x_api_key[:8] if x_api_key else 'None'}...")
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint with HTML response"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Zynx AGI API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Zynx AGI API</h1>
            <p>Culturally aware artificial general intelligence backend</p>
            
            <h2>Available Endpoints:</h2>
            <div class="endpoint">
                <strong>GET /health</strong> - Health check
            </div>
            <div class="endpoint">
                <strong>GET /docs</strong> - Interactive API documentation
            </div>
            <div class="endpoint">
                <strong>GET /redoc</strong> - ReDoc documentation
            </div>
            <div class="endpoint">
                <strong>POST /api/v1/agi/process</strong> - Process AGI requests
            </div>
            
            <h2>Quick Start:</h2>
            <p>Visit <a href="/docs">/docs</a> for interactive API documentation</p>
        </div>
    </body>
    </html>
    """

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    
    return {
        "status": "healthy",
        "message": "Zynx AGI API is running",
        "version": settings.version,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/agi/process")
async def process_agi_request(
    request: Request,
    _: bool = Depends(verify_api_key)
):
    """
    Process AGI requests with cultural awareness and ethical considerations
    """
    try:
        # Parse JSON body
        body = await request.json()
        
        prompt = body.get("prompt", "")
        cultural_context = body.get("cultural_context", "global")
        ethical_framework = body.get("ethical_framework", "utilitarian")
        
        logger.info(f"Processing AGI request: {prompt[:50]}...")
        logger.info(f"Cultural context: {cultural_context}")
        logger.info(f"Ethical framework: {ethical_framework}")
        
        # Simulate AGI processing with cultural awareness
        response = f"Processed: {prompt}"
        cultural_notes = f"Cultural context considered: {cultural_context}"
        ethical_considerations = f"Ethical framework applied: {ethical_framework}"
        confidence_score = 0.85
        
        logger.info("AGI request processed successfully")
        
        return {
            "response": response,
            "cultural_notes": cultural_notes,
            "ethical_considerations": ethical_considerations,
            "confidence_score": confidence_score
        }
        
    except Exception as e:
        logger.error(f"Error processing AGI request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/agi/capabilities")
async def get_agi_capabilities():
    """Get AGI system capabilities"""
    logger.info("AGI capabilities requested")
    
    return {
        "capabilities": [
            "Cultural awareness processing",
            "Ethical framework integration",
            "Multi-language support",
            "Context-aware responses",
            "Bias detection and mitigation"
        ],
        "supported_cultures": [
            "Thai", "English", "Chinese", "Japanese", "Korean",
            "Arabic", "Spanish", "French", "German", "Russian"
        ],
        "ethical_frameworks": [
            "utilitarian", "deontological", "virtue_ethics",
            "care_ethics", "justice_ethics"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting development server")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )