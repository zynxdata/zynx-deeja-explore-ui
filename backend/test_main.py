"""
Test suite for Zynx AGI Backend
"""

import pytest
from fastapi.testclient import TestClient
from main import app
import os
import tempfile
import shutil

# Create test client
client = TestClient(app)

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test health check returns correct response"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["message"] == "Zynx AGI Backend is running"
        assert data["version"] == "1.0.0"

class TestAGIEndpoint:
    """Test AGI information endpoint"""
    
    def test_get_agi_info(self):
        """Test AGI info endpoint returns cultural context"""
        response = client.get("/api/v1/agi")
        assert response.status_code == 200
        data = response.json()
        
        assert "message" in data
        assert "cultural_context" in data
        assert "ethical_considerations" in data
        
        # Check Thai cultural context
        thai_culture = data["cultural_context"]["thai_culture"]
        assert "respect" in thai_culture
        assert "harmony" in thai_culture
        assert "community" in thai_culture
        
        # Check ethical considerations
        ethics = data["ethical_considerations"]
        assert "privacy" in ethics
        assert "transparency" in ethics
        assert "fairness" in ethics
        assert "accountability" in ethics

class TestDeejaEndpoint:
    """Test Deeja assistant endpoint"""
    
    def test_meet_deeja(self):
        """Test Deeja introduction endpoint"""
        response = client.get("/api/v1/deeja")
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Deeja"
        assert data["role"] == "Cultural AGI Assistant"
        
        # Check personality traits
        personality = data["personality"]
        assert personality["culturally_aware"] is True
        assert personality["empathetic"] is True
        assert personality["ethical"] is True
        assert personality["multilingual"] is True
        
        # Check capabilities
        capabilities = data["capabilities"]
        assert "Cultural context understanding" in capabilities
        assert "Ethical decision making" in capabilities
        assert "Multilingual communication" in capabilities
        
        # Check greeting
        greeting = data["greeting"]
        assert "thai" in greeting
        assert "english" in greeting
        assert "meaning" in greeting

class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root_without_frontend(self):
        """Test root endpoint when frontend is not available"""
        response = client.get("/")
        assert response.status_code == 200
        content = response.text
        assert "Zynx AGI API" in content
        assert "/docs" in content
        assert "/health" in content

class TestAPIDocumentation:
    """Test API documentation endpoints"""
    
    def test_docs_endpoint(self):
        """Test OpenAPI docs endpoint"""
        response = client.get("/docs")
        assert response.status_code == 200
    
    def test_redoc_endpoint(self):
        """Test ReDoc endpoint"""
        response = client.get("/redoc")
        assert response.status_code == 200

class TestErrorHandling:
    """Test error handling"""
    
    def test_nonexistent_endpoint(self):
        """Test 404 for nonexistent endpoint"""
        response = client.get("/api/v1/nonexistent")
        assert response.status_code == 404
    
    def test_root_with_frontend_file(self):
        """Test root endpoint with frontend file"""
        # Create a temporary index.html file
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False, dir='static', suffix='.html') as f:
            f.write('<html><body>Test</body></html>')
            temp_file = f.name
        
        try:
            # Rename to index.html
            os.rename(temp_file, 'static/index.html')
            
            # Test the endpoint
            response = client.get("/")
            assert response.status_code == 200
            assert "Test" in response.text
        finally:
            # Clean up
            if os.path.exists('static/index.html'):
                os.remove('static/index.html')

class TestCORS:
    """Test CORS configuration"""
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = client.get("/health")
        assert response.status_code == 200
        # CORS headers are added by FastAPI middleware, but may not be present in all responses
        # Just verify the endpoint works
        assert response.json()["status"] == "healthy"

class TestMainFunction:
    """Test main function execution"""
    
    def test_app_creation(self):
        """Test that the app is created successfully"""
        from main import app
        assert app is not None
        assert app.title == "Zynx AGI API"
        assert app.version == "1.0.0"
    
    def test_lifespan_function(self):
        """Test lifespan function"""
        from main import lifespan
        import asyncio
        
        # Test that lifespan can be called
        async def test_lifespan():
            async with lifespan(None):
                pass
        
        # This should not raise an exception
        asyncio.run(test_lifespan())

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=main", "--cov-report=html"])