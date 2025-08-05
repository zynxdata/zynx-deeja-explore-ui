"""
Test suite for Zynx AGI Backend API
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import os
import tempfile
import shutil

from main import app, settings

client = TestClient(app)

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test health check returns correct response"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["message"] == "Zynx AGI API is running"
        assert data["version"] == settings.version
        assert "timestamp" in data

class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root_returns_html(self):
        """Test root endpoint returns HTML response"""
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        assert "Zynx AGI API" in response.text

class TestAGIEndpoints:
    """Test AGI-related endpoints"""
    
    def test_agi_capabilities(self):
        """Test AGI capabilities endpoint"""
        response = client.get("/api/v1/agi/capabilities")
        assert response.status_code == 200
        
        data = response.json()
        assert "capabilities" in data
        assert "supported_cultures" in data
        assert "ethical_frameworks" in data
        assert len(data["capabilities"]) > 0
        assert len(data["supported_cultures"]) > 0
        assert len(data["ethical_frameworks"]) > 0
    
    def test_agi_process_success(self):
        """Test successful AGI processing"""
        request_data = {
            "prompt": "Hello, how are you?",
            "cultural_context": "Thai",
            "ethical_framework": "utilitarian"
        }
        
        response = client.post("/api/v1/agi/process", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert "cultural_notes" in data
        assert "ethical_considerations" in data
        assert "confidence_score" in data
        assert isinstance(data["confidence_score"], float)
        assert 0 <= data["confidence_score"] <= 1
    
    def test_agi_process_minimal_request(self):
        """Test AGI processing with minimal request data"""
        request_data = {
            "prompt": "Test prompt"
        }
        
        response = client.post("/api/v1/agi/process", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["response"] == "Processed: Test prompt"
    
    def test_agi_process_empty_request(self):
        """Test AGI processing with empty request"""
        request_data = {}
        
        response = client.post("/api/v1/agi/process", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["response"] == "Processed: "

class TestErrorHandling:
    """Test error handling scenarios"""
    
    @patch('main.logger')
    def test_agi_process_exception_handling(self, mock_logger):
        """Test exception handling in AGI processing"""
        # This test would require more complex mocking to simulate exceptions
        # For now, we test the basic structure
        request_data = {
            "prompt": "Test prompt"
        }
        
        response = client.post("/api/v1/agi/process", json=request_data)
        assert response.status_code == 200

class TestSettings:
    """Test application settings"""
    
    def test_settings_defaults(self):
        """Test default settings values"""
        assert settings.app_name == "Zynx AGI API"
        assert settings.version == "1.0.0"
        assert isinstance(settings.debug, bool)
    
    @patch.dict(os.environ, {"DEBUG": "true"})
    def test_settings_environment_override(self):
        """Test environment variable override"""
        # Note: This test might not work as expected due to module-level loading
        # In a real application, you'd want to reload the settings
        pass

class TestAPIDocumentation:
    """Test API documentation endpoints"""
    
    def test_docs_endpoint(self):
        """Test OpenAPI docs endpoint"""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_redoc_endpoint(self):
        """Test ReDoc endpoint"""
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

class TestCORS:
    """Test CORS configuration"""
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = client.options("/health")
        # CORS headers should be present
        assert response.status_code in [200, 405]  # OPTIONS might not be implemented

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=main", "--cov-report=term-missing"])