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
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    
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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend (only if directory exists)
import os
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint serving the frontend"""
    try:
        with open("static/index.html", "r") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        logger.warning("Frontend index.html not found, serving API info")
        return HTMLResponse(content="""
        <html>
            <head><title>Zynx AGI API</title></head>
            <body>
                <h1>Zynx AGI API</h1>
                <p>Welcome to the culturally aware AGI API</p>
                <ul>
                    <li><a href="/docs">API Documentation</a></li>
                    <li><a href="/health">Health Check</a></li>
                    <li><a href="/api/v1/agi">AGI Endpoint</a></li>
                </ul>
            </body>
        </html>
        """)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return HealthResponse(
        status="healthy",
        message="Zynx AGI Backend is running",
        version="1.0.0"
    )

@app.get("/api/v1/agi", response_model=AGIResponse)
async def get_agi_info():
    """Get AGI information with cultural context"""
    try:
        logger.info("AGI info requested")
        
        return AGIResponse(
            message="Welcome to Zynx AGI - Culturally Aware Intelligence",
            cultural_context={
                "thai_culture": {
                    "respect": "การเคารพ (Respect)",
                    "harmony": "ความสมดุล (Harmony)",
                    "community": "ชุมชน (Community)"
                },
                "global_perspectives": [
                    "Cultural sensitivity",
                    "Ethical considerations",
                    "Inclusive design"
                ]
            },
            ethical_considerations={
                "privacy": "Data protection and user privacy",
                "transparency": "Clear decision-making processes",
                "fairness": "Unbiased and equitable treatment",
                "accountability": "Responsible AI development"
            }
        )
    except Exception as e:
        logger.error(f"Error in AGI endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/deeja")
async def meet_deeja():
    """Meet Deeja - The cultural AGI assistant"""
    try:
        logger.info("Deeja introduction requested")
        
        return {
            "name": "Deeja",
            "role": "Cultural AGI Assistant",
            "personality": {
                "culturally_aware": True,
                "empathetic": True,
                "ethical": True,
                "multilingual": True
            },
            "capabilities": [
                "Cultural context understanding",
                "Ethical decision making",
                "Multilingual communication",
                "Cultural sensitivity training"
            ],
            "greeting": {
                "thai": "สวัสดีครับ/ค่ะ ยินดีที่ได้รู้จัก",
                "english": "Hello! Nice to meet you",
                "meaning": "Greeting with cultural respect"
            }
        }
    except Exception as e:
        logger.error(f"Error in Deeja endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )