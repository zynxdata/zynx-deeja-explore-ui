#!/usr/bin/env python3
"""
Zynx Documentation Automation Script
Automates documentation generation, validation, and integration
"""

import os
import json
import asyncio
import aiofiles
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import yaml
import markdown
from loguru import logger

class DocumentationAutomation:
    """Automated documentation management for Zynx project"""
    
    def __init__(self, docs_dir: str = "docs"):
        self.docs_dir = Path(docs_dir)
        self.docs_dir.mkdir(exist_ok=True)
        self.config_file = self.docs_dir / "config.yaml"
        self.status_file = self.docs_dir / "status.json"
        
        # Load configuration
        self.config = self.load_config()
        self.status = self.load_status()
    
    def load_config(self) -> Dict[str, Any]:
        """Load documentation configuration"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                return yaml.safe_load(f)
        else:
            # Default configuration
            config = {
                "project": {
                    "name": "Zynx AGI Platform",
                    "version": "1.0.0",
                    "description": "Context-as-a-Service with Deeja AI"
                },
                "documentation": {
                    "categories": [
                        "core_project",
                        "deeja_ai", 
                        "technical",
                        "launch",
                        "business"
                    ],
                    "formats": ["markdown", "yaml", "json"],
                    "auto_generate": ["api_docs", "readme", "changelog"]
                },
                "integration": {
                    "backend": {
                        "api_docs": True,
                        "openapi": True,
                        "code_docs": True
                    },
                    "frontend": {
                        "component_docs": True,
                        "storybook": False
                    }
                }
            }
            self.save_config(config)
            return config
    
    def save_config(self, config: Dict[str, Any]):
        """Save configuration to file"""
        with open(self.config_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
    
    def load_status(self) -> Dict[str, Any]:
        """Load documentation status"""
        if self.status_file.exists():
            with open(self.status_file, 'r') as f:
                return json.load(f)
        else:
            return {
                "last_updated": datetime.now().isoformat(),
                "categories": {},
                "integration_status": {},
                "metrics": {}
            }
    
    def save_status(self):
        """Save status to file"""
        self.status["last_updated"] = datetime.now().isoformat()
        with open(self.status_file, 'w') as f:
            json.dump(self.status, f, indent=2)
    
    async def scan_documentation(self) -> Dict[str, List[str]]:
        """Scan existing documentation files"""
        docs = {}
        
        for category in self.config["documentation"]["categories"]:
            category_dir = self.docs_dir / category
            if category_dir.exists():
                files = []
                for file_path in category_dir.glob("*.md"):
                    files.append(str(file_path.relative_to(self.docs_dir)))
                docs[category] = files
        
        return docs
    
    async def generate_api_documentation(self) -> Dict[str, Any]:
        """Generate API documentation from FastAPI app"""
        try:
            # Import FastAPI app
            import sys
            sys.path.append("backend")
            from main import app
            
            # Generate OpenAPI schema
            openapi_schema = app.openapi()
            
            # Create API documentation
            api_docs = {
                "title": "Zynx AGI Platform API",
                "version": "1.0.0",
                "description": "Complete API documentation for Zynx platform",
                "endpoints": [],
                "schemas": openapi_schema.get("components", {}).get("schemas", {}),
                "paths": openapi_schema.get("paths", {})
            }
            
            # Extract endpoint information
            for path, methods in openapi_schema.get("paths", {}).items():
                for method, details in methods.items():
                    if method.upper() in ["GET", "POST", "PUT", "DELETE"]:
                        api_docs["endpoints"].append({
                            "path": path,
                            "method": method.upper(),
                            "summary": details.get("summary", ""),
                            "description": details.get("description", ""),
                            "tags": details.get("tags", [])
                        })
            
            return api_docs
            
        except Exception as e:
            logger.error(f"Failed to generate API documentation: {e}")
            return {"error": str(e)}
    
    async def generate_readme(self) -> str:
        """Generate main README file"""
        readme_content = f"""# {self.config['project']['name']}

{self.config['project']['description']}

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd zynx-agi

# Install dependencies
npm install
cd backend && pip install -r requirements.txt

# Start development servers
./dev.sh
```

### Access Points
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🧠 Features

### Deeja AI Assistant
- **Cultural Awareness**: Thai-English bilingual support
- **Emotion Detection**: Real-time emotion recognition
- **Context Understanding**: Advanced conversation context
- **Ethical AI**: Built-in safety and compliance

### Technical Stack
- **Backend**: FastAPI + Python 3.11
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL + Redis
- **AI/ML**: Custom RAG pipeline + Emotion detection
- **Deployment**: Docker + Docker Compose

## 📚 Documentation

See the [docs/](docs/) directory for comprehensive documentation:

- [Project Overview](docs/README.md)
- [API Documentation](docs/api/)
- [Deeja AI System](docs/deeja/)
- [Technical Implementation](docs/technical/)
- [Launch Materials](docs/launch/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Thai cultural advisors for cultural sensitivity guidance
- AI ethics community for responsible AI development principles
- Open source contributors for amazing tools and libraries

---

**Zynx AGI** - Building culturally aware artificial intelligence for a better world 🌏🤖
"""
        
        return readme_content
    
    async def validate_documentation(self) -> Dict[str, Any]:
        """Validate documentation completeness and accuracy"""
        validation_results = {
            "timestamp": datetime.now().isoformat(),
            "categories": {},
            "overall_score": 0,
            "issues": [],
            "recommendations": []
        }
        
        # Check each documentation category
        for category in self.config["documentation"]["categories"]:
            category_score = 0
            category_issues = []
            
            # Check if category directory exists
            category_dir = self.docs_dir / category
            if not category_dir.exists():
                category_issues.append(f"Category directory missing: {category}")
                category_score = 0
            else:
                # Check for required files
                required_files = self.get_required_files(category)
                found_files = list(category_dir.glob("*.md"))
                
                for required_file in required_files:
                    if not (category_dir / required_file).exists():
                        category_issues.append(f"Missing required file: {required_file}")
                    else:
                        category_score += 10
                
                # Check file quality
                for file_path in found_files:
                    quality_score = await self.check_file_quality(file_path)
                    category_score += quality_score
            
            validation_results["categories"][category] = {
                "score": min(category_score, 100),
                "issues": category_issues
            }
        
        # Calculate overall score
        total_score = sum(cat["score"] for cat in validation_results["categories"].values())
        validation_results["overall_score"] = total_score // len(validation_results["categories"])
        
        # Generate recommendations
        if validation_results["overall_score"] < 80:
            validation_results["recommendations"].append("Documentation needs improvement")
        
        return validation_results
    
    def get_required_files(self, category: str) -> List[str]:
        """Get required files for a category"""
        required_files = {
            "core_project": ["README.md", "overview.md"],
            "deeja_ai": ["deeja_prompt.md", "emotion_engine.md"],
            "technical": ["api_docs.md", "architecture.md"],
            "launch": ["mvp_plan.md", "demo_script.md"],
            "business": ["executive_summary.md", "roadmap.md"]
        }
        return required_files.get(category, [])
    
    async def check_file_quality(self, file_path: Path) -> int:
        """Check quality of a documentation file"""
        try:
            async with aiofiles.open(file_path, 'r') as f:
                content = await f.read()
            
            score = 0
            
            # Check file size
            if len(content) > 100:
                score += 10
            
            # Check for headers
            if "# " in content:
                score += 10
            
            # Check for code blocks
            if "```" in content:
                score += 10
            
            # Check for links
            if "[" in content and "](" in content:
                score += 10
            
            # Check for lists
            if "- " in content or "* " in content:
                score += 10
            
            return score
            
        except Exception as e:
            logger.error(f"Error checking file quality for {file_path}: {e}")
            return 0
    
    async def update_documentation_index(self):
        """Update main documentation index"""
        docs = await self.scan_documentation()
        
        index_content = f"""# 📚 {self.config['project']['name']} - Documentation Index

*Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*

## 📋 Documentation Categories

"""
        
        for category, files in docs.items():
            index_content += f"### {category.replace('_', ' ').title()}\n\n"
            for file in files:
                index_content += f"- [{file}]({file})\n"
            index_content += "\n"
        
        # Add quick links
        index_content += """## 🎯 Quick Links

- [API Documentation](technical/api_docs.md)
- [Deeja AI System](deeja_ai/deeja_prompt.md)
- [Project Overview](core_project/overview.md)
- [Launch Plan](launch/mvp_plan.md)

## 📊 Documentation Status

"""
        
        # Add status information
        validation_results = await self.validate_documentation()
        index_content += f"- **Overall Score**: {validation_results['overall_score']}/100\n"
        index_content += f"- **Categories**: {len(docs)}/5\n"
        index_content += f"- **Total Files**: {sum(len(files) for files in docs.values())}\n"
        
        index_file = self.docs_dir / "index.md"
        async with aiofiles.open(index_file, 'w') as f:
            await f.write(index_content)
    
    async def run_automation(self):
        """Run complete documentation automation"""
        logger.info("Starting documentation automation...")
        
        # Scan existing documentation
        docs = await self.scan_documentation()
        logger.info(f"Found {sum(len(files) for files in docs.values())} documentation files")
        
        # Generate API documentation
        api_docs = await self.generate_api_documentation()
        if "error" not in api_docs:
            logger.info(f"Generated API documentation with {len(api_docs['endpoints'])} endpoints")
        
        # Generate README
        readme_content = await self.generate_readme()
        readme_file = Path("README.md")
        async with aiofiles.open(readme_file, 'w') as f:
            await f.write(readme_content)
        logger.info("Generated main README")
        
        # Validate documentation
        validation_results = await self.validate_documentation()
        logger.info(f"Documentation validation score: {validation_results['overall_score']}/100")
        
        # Update documentation index
        await self.update_documentation_index()
        logger.info("Updated documentation index")
        
        # Save status
        self.status["categories"] = docs
        self.status["validation"] = validation_results
        self.save_status()
        
        logger.info("Documentation automation completed!")

async def main():
    """Main function"""
    automation = DocumentationAutomation()
    await automation.run_automation()

if __name__ == "__main__":
    asyncio.run(main())