"""
Zynx AGI Backend API
FastAPI application with cultural awareness and ethical considerations
"""

import os
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from loguru import logger
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="7 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}"
)

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

class AGIResponse(BaseModel):
    message: str
    cultural_context: Dict[str, Any]
    ethical_considerations: Dict[str, Any]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("🚀 Starting Zynx AGI Backend")
    yield
    logger.info("🛑 Shutting down Zynx AGI Backend")

# Create FastAPI app
app = FastAPI(
    title="Zynx AGI API",
    description="Culturally aware artificial general intelligence API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (only if directory exists)
import os
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint with welcome message"""
    logger.info("Root endpoint accessed")
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
                <p>Welcome to the culturally aware artificial general intelligence API.</p>
                
                <h2>Available Endpoints:</h2>
                <div class="endpoint">
                    <strong>GET /health</strong> - Health check
                </div>
                <div class="endpoint">
                    <strong>GET /api/v1/agi/context</strong> - Get cultural context
                </div>
                <div class="endpoint">
                    <strong>POST /api/v1/agi/interact</strong> - Interact with AGI
                </div>
                
                <h2>Documentation:</h2>
                <ul>
                    <li><a href="/docs">Interactive API Docs (Swagger)</a></li>
                    <li><a href="/redoc">ReDoc Documentation</a></li>
                </ul>
            </div>
        </body>
    </html>
    """

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return HealthResponse(
        status="healthy",
        message="Zynx AGI API is running",
        version="1.0.0"
    )

@app.get("/api/v1/agi/context", response_model=Dict[str, Any])
async def get_cultural_context():
    """Get cultural context for AGI interactions"""
    logger.info("Cultural context requested")
    
    try:
        context = {
            "thai_culture": {
                "greeting": "สวัสดีครับ/ค่ะ",
                "respect_levels": ["คุณ", "ท่าน", "อาจารย์"],
                "cultural_values": ["ความกตัญญู", "ความสุภาพ", "ความอดทน"]
            },
            "global_culture": {
                "diversity": True,
                "inclusivity": True,
                "ethical_ai": True
            },
            "agi_considerations": {
                "cultural_sensitivity": True,
                "language_adaptation": True,
                "ethical_boundaries": True
            }
        }
        logger.info("Cultural context retrieved successfully")
        return context
    except Exception as e:
        logger.error(f"Error retrieving cultural context: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve cultural context")

class InteractionRequest(BaseModel):
    message: str
    cultural_context: str = "global"
    language: str = "en"

@app.post("/api/v1/agi/interact", response_model=AGIResponse)
async def interact_with_agi(request: InteractionRequest):
    """Interact with the AGI system"""
    logger.info(f"AGI interaction requested: {request.message[:50]}...")
    
    try:
        # Simulate AGI processing with cultural awareness
        response_message = f"AGI processed: {request.message}"
        
        cultural_context = {
            "thai": {
                "greeting": "สวัสดีครับ/ค่ะ",
                "response_style": "polite_and_respectful"
            },
            "global": {
                "greeting": "Hello",
                "response_style": "inclusive_and_respectful"
            }
        }
        
        ethical_considerations = {
            "privacy_protected": True,
            "bias_mitigation": True,
            "cultural_sensitivity": True,
            "transparency": True
        }
        
        logger.info("AGI interaction processed successfully")
        return AGIResponse(
            message=response_message,
            cultural_context=cultural_context.get(request.cultural_context, cultural_context["global"]),
            ethical_considerations=ethical_considerations
        )
    except Exception as e:
        logger.error(f"Error in AGI interaction: {e}")
        raise HTTPException(status_code=500, detail="Failed to process AGI interaction")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )