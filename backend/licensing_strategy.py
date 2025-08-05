#!/usr/bin/env python3
"""
Zynx AGI Platform - Licensing Strategy Implementation
Phase 1: Foundation - Strict Permissive-Only Licensing
"""

import re
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from loguru import logger

class LicenseType(Enum):
    """License types for AI models and components"""
    MIT = "MIT"
    APACHE_2 = "Apache-2.0"
    BSD_3 = "BSD-3-Clause"
    GPL_3 = "GPL-3.0"
    AGPL_3 = "AGPL-3.0"
    PROPRIETARY = "Proprietary"
    UNKNOWN = "Unknown"

@dataclass
class LicenseInfo:
    """License information for a component"""
    name: str
    version: str
    license_type: LicenseType
    license_url: Optional[str] = None
    commercial_use: bool = False
    modification_allowed: bool = False
    distribution_allowed: bool = False
    attribution_required: bool = False
    copyleft: bool = False
    risk_level: str = "Low"

class LicenseComplianceChecker:
    """Strict permissive-only licensing compliance checker"""
    
    def __init__(self):
        self.permissive_licenses = {
            LicenseType.MIT,
            LicenseType.APACHE_2,
            LicenseType.BSD_3
        }
        
        self.restrictive_licenses = {
            LicenseType.GPL_3,
            LicenseType.AGPL_3
        }
        
        self.license_patterns = {
            LicenseType.MIT: r"MIT|MIT License",
            LicenseType.APACHE_2: r"Apache.*2\.0|Apache-2\.0",
            LicenseType.BSD_3: r"BSD.*3|BSD-3",
            LicenseType.GPL_3: r"GPL.*3|GPL-3",
            LicenseType.AGPL_3: r"AGPL.*3|AGPL-3"
        }
    
    def detect_license(self, license_text: str) -> LicenseType:
        """Detect license type from text"""
        license_text = license_text.upper()
        
        for license_type, pattern in self.license_patterns.items():
            if re.search(pattern, license_text, re.IGNORECASE):
                return license_type
        
        return LicenseType.UNKNOWN
    
    def analyze_license(self, license_text: str) -> LicenseInfo:
        """Analyze license and return detailed information"""
        license_type = self.detect_license(license_text)
        
        # Determine license characteristics
        commercial_use = license_type in self.permissive_licenses
        modification_allowed = license_type in self.permissive_licenses
        distribution_allowed = license_type in self.permissive_licenses
        attribution_required = license_type in {LicenseType.APACHE_2, LicenseType.BSD_3}
        copyleft = license_type in self.restrictive_licenses
        
        # Determine risk level
        if license_type in self.restrictive_licenses:
            risk_level = "High"
        elif license_type == LicenseType.UNKNOWN:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return LicenseInfo(
            name="Unknown Component",
            version="1.0.0",
            license_type=license_type,
            commercial_use=commercial_use,
            modification_allowed=modification_allowed,
            distribution_allowed=distribution_allowed,
            attribution_required=attribution_required,
            copyleft=copyleft,
            risk_level=risk_level
        )
    
    def is_compliant(self, license_info: LicenseInfo) -> bool:
        """Check if license is compliant with strict permissive-only policy"""
        return (
            license_info.license_type in self.permissive_licenses and
            license_info.risk_level == "Low"
        )
    
    def get_compliance_report(self, components: List[LicenseInfo]) -> Dict[str, Any]:
        """Generate compliance report"""
        compliant_components = []
        non_compliant_components = []
        
        for component in components:
            if self.is_compliant(component):
                compliant_components.append(component)
            else:
                non_compliant_components.append(component)
        
        return {
            "total_components": len(components),
            "compliant_components": len(compliant_components),
            "non_compliant_components": len(non_compliant_components),
            "compliance_rate": len(compliant_components) / len(components) * 100,
            "compliant_list": [c.name for c in compliant_components],
            "non_compliant_list": [c.name for c in non_compliant_components],
            "risk_analysis": {
                "high_risk": len([c for c in components if c.risk_level == "High"]),
                "medium_risk": len([c for c in components if c.risk_level == "Medium"]),
                "low_risk": len([c for c in components if c.risk_level == "Low"])
            }
        }

class ModelEvaluationFramework:
    """Framework for evaluating AI models and their licenses"""
    
    def __init__(self):
        self.checker = LicenseComplianceChecker()
        self.evaluated_models = {}
    
    async def evaluate_model(self, model_name: str, model_info: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate a model for licensing compliance"""
        try:
            # Extract license information
            license_text = model_info.get("license", "Unknown")
            license_info = self.checker.analyze_license(license_text)
            license_info.name = model_name
            license_info.version = model_info.get("version", "1.0.0")
            license_info.license_url = model_info.get("license_url")
            
            # Check compliance
            is_compliant = self.checker.is_compliant(license_info)
            
            # Store evaluation
            evaluation = {
                "model_name": model_name,
                "license_info": license_info,
                "is_compliant": is_compliant,
                "recommendation": self.get_recommendation(license_info),
                "alternatives": self.get_alternatives(model_name, license_info)
            }
            
            self.evaluated_models[model_name] = evaluation
            return evaluation
            
        except Exception as e:
            logger.error(f"Error evaluating model {model_name}: {e}")
            return {
                "model_name": model_name,
                "error": str(e),
                "is_compliant": False
            }
    
    def get_recommendation(self, license_info: LicenseInfo) -> str:
        """Get recommendation based on license analysis"""
        if license_info.license_type in self.checker.permissive_licenses:
            return "✅ APPROVED - Permissive license suitable for commercial use"
        elif license_info.license_type in self.checker.restrictive_licenses:
            return "❌ REJECTED - Restrictive license may require source code disclosure"
        elif license_info.license_type == LicenseType.UNKNOWN:
            return "⚠️ REVIEW REQUIRED - Unknown license, manual review needed"
        else:
            return "❌ REJECTED - License not suitable for commercial use"
    
    def get_alternatives(self, model_name: str, license_info: LicenseInfo) -> List[str]:
        """Get alternative models with permissive licenses"""
        # Common alternatives for popular models
        alternatives_map = {
            "gpt": ["llama", "mistral", "falcon"],
            "llama": ["mistral", "falcon", "gpt4all"],
            "mistral": ["llama", "falcon", "gpt4all"],
            "falcon": ["llama", "mistral", "gpt4all"],
            "bert": ["roberta", "distilbert", "albert"],
            "roberta": ["bert", "distilbert", "albert"],
            "t5": ["bart", "pegasus", "mT5"]
        }
        
        model_lower = model_name.lower()
        for key, alternatives in alternatives_map.items():
            if key in model_lower:
                return alternatives
        
        return ["llama", "mistral", "falcon"]  # Default alternatives
    
    async def batch_evaluate_models(self, models: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluate multiple models at once"""
        results = []
        
        for model in models:
            result = await self.evaluate_model(
                model["name"], 
                model
            )
            results.append(result)
        
        # Generate batch report
        compliant_count = len([r for r in results if r.get("is_compliant", False)])
        total_count = len(results)
        
        return {
            "total_models": total_count,
            "compliant_models": compliant_count,
            "compliance_rate": compliant_count / total_count * 100,
            "evaluations": results,
            "summary": {
                "approved": [r["model_name"] for r in results if r.get("is_compliant", False)],
                "rejected": [r["model_name"] for r in results if not r.get("is_compliant", False)],
                "needs_review": [r["model_name"] for r in results if "REVIEW REQUIRED" in r.get("recommendation", "")]
            }
        }

class LicenseManager:
    """Main license management system"""
    
    def __init__(self):
        self.checker = LicenseComplianceChecker()
        self.evaluator = ModelEvaluationFramework()
        self.license_cache = {}
    
    async def validate_component(self, component_name: str, license_text: str) -> Dict[str, Any]:
        """Validate a single component"""
        license_info = self.checker.analyze_license(license_text)
        license_info.name = component_name
        
        return {
            "component_name": component_name,
            "license_info": license_info,
            "is_compliant": self.checker.is_compliant(license_info),
            "recommendation": self.evaluator.get_recommendation(license_info)
        }
    
    async def validate_project_dependencies(self, requirements_file: str = "requirements.txt") -> Dict[str, Any]:
        """Validate all project dependencies"""
        try:
            requirements_path = Path(requirements_file)
            if not requirements_path.exists():
                return {"error": f"Requirements file not found: {requirements_file}"}
            
            # Read requirements
            with open(requirements_path, 'r') as f:
                requirements = f.readlines()
            
            # For now, we'll use a simplified approach
            # In a real implementation, you'd query PyPI or other package registries
            components = []
            for req in requirements:
                if req.strip() and not req.startswith('#'):
                    # Simplified license check - in reality you'd query package metadata
                    components.append(LicenseInfo(
                        name=req.split('==')[0].strip(),
                        version="1.0.0",
                        license_type=LicenseType.MIT,  # Assume MIT for now
                        commercial_use=True,
                        modification_allowed=True,
                        distribution_allowed=True,
                        attribution_required=False,
                        copyleft=False,
                        risk_level="Low"
                    ))
            
            return self.checker.get_compliance_report(components)
            
        except Exception as e:
            logger.error(f"Error validating project dependencies: {e}")
            return {"error": str(e)}
    
    async def generate_license_report(self) -> Dict[str, Any]:
        """Generate comprehensive license report"""
        return {
            "timestamp": asyncio.get_event_loop().time(),
            "policy": {
                "strict_permissive_only": True,
                "allowed_licenses": [license.value for license in self.checker.permissive_licenses],
                "restricted_licenses": [license.value for license in self.checker.restrictive_licenses]
            },
            "evaluated_models": self.evaluator.evaluated_models,
            "cache_size": len(self.license_cache)
        }

# Example usage and testing
async def main():
    """Main function for testing licensing strategy"""
    manager = LicenseManager()
    
    # Test license validation
    test_licenses = [
        ("MIT Component", "MIT License"),
        ("Apache Component", "Apache License 2.0"),
        ("GPL Component", "GNU General Public License v3.0"),
        ("Unknown Component", "Custom License")
    ]
    
    print("🔍 Testing License Compliance...")
    for name, license_text in test_licenses:
        result = await manager.validate_component(name, license_text)
        print(f"✅ {name}: {result['is_compliant']} - {result['recommendation']}")
    
    # Test model evaluation
    evaluator = ModelEvaluationFramework()
    test_models = [
        {"name": "llama-2-7b", "license": "MIT", "version": "2.0"},
        {"name": "gpt-4", "license": "Proprietary", "version": "4.0"},
        {"name": "mistral-7b", "license": "Apache-2.0", "version": "1.0"}
    ]
    
    print("\n🤖 Testing Model Evaluation...")
    evaluation_results = await evaluator.batch_evaluate_models(test_models)
    print(f"📊 Compliance Rate: {evaluation_results['compliance_rate']:.1f}%")
    print(f"✅ Approved: {evaluation_results['summary']['approved']}")
    print(f"❌ Rejected: {evaluation_results['summary']['rejected']}")
    
    # Generate report
    report = await manager.generate_license_report()
    print(f"\n📋 License Report Generated: {len(report['evaluated_models'])} models evaluated")

if __name__ == "__main__":
    asyncio.run(main())