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
    
    def test_invalid_endpoint(self):
        """Test 404 for invalid endpoint"""
        response = client.get("/api/v1/nonexistent")
        assert response.status_code == 404
    
    def test_root_with_static_files(self):
        """Test root endpoint when static files exist"""
        # Create a temporary static directory and index.html
        import tempfile
        import os
        
        with tempfile.TemporaryDirectory() as temp_dir:
            os.makedirs(temp_dir, exist_ok=True)
            with open(os.path.join(temp_dir, "index.html"), "w") as f:
                f.write("<html><body>Test</body></html>")
            
            # Temporarily change the static directory
            original_static_exists = os.path.exists("static")
            if not original_static_exists:
                os.makedirs("static", exist_ok=True)
                with open("static/index.html", "w") as f:
                    f.write("<html><body>Test</body></html>")
            
            try:
                response = client.get("/")
                assert response.status_code == 200
                assert "Test" in response.text
            finally:
                if not original_static_exists:
                    import shutil
                    shutil.rmtree("static", ignore_errors=True)

class TestMainExecution:
    """Test main execution block"""
    
    def test_main_execution(self):
        """Test that main can be imported and app is created"""
        import main
        assert hasattr(main, 'app')
        assert main.app is not None

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=main", "--cov-report=html"])