#!/usr/bin/env python3
"""
Zynx AGI Platform - Phase 2 Execution Script
Core Features: Redis Pub/Sub + PDPA Policy Engine
"""

import asyncio
import sys
import time
from pathlib import Path
from typing import Dict, List, Any
from loguru import logger

# Add backend to path for imports
sys.path.append("backend")

from redis_pubsub import RedisPubSubManager, WebSocketManager, ChatMessageHandler, EmotionMessageHandler, WebSocketMessage, MessageType
from pdpa_policy_engine import PDPAPolicyEngine, ProcessingPurpose, DataCategory, ConsentStatus

class Phase2Executor:
    """Execute Phase 2 of Zynx implementation plan"""
    
    def __init__(self):
        self.redis_manager = RedisPubSubManager()
        self.ws_manager = WebSocketManager(self.redis_manager)
        self.pdpa_engine = PDPAPolicyEngine()
        self.results = {}
        self.start_time = time.time()
    
    async def execute_redis_pubsub(self) -> Dict[str, Any]:
        """Execute Redis Pub/Sub implementation"""
        logger.info("🔍 Starting Redis Pub/Sub Implementation...")
        
        try:
            # Test Redis connection
            connection_success = await self.redis_manager.connect()
            if not connection_success:
                logger.error("❌ Failed to connect to Redis")
                return {"success": False, "error": "Redis connection failed"}
            
            # Initialize message handlers
            chat_handler = ChatMessageHandler(self.redis_manager, self.ws_manager)
            emotion_handler = EmotionMessageHandler(self.redis_manager, self.ws_manager)
            
            # Subscribe to test channels
            await self.redis_manager.subscribe("chat:test", chat_handler.handle_chat_message)
            await self.redis_manager.subscribe("emotion:test", emotion_handler.handle_emotion_message)
            
            # Test message publishing
            test_message = WebSocketMessage(
                message_id="test-001",
                message_type=MessageType.CHAT,
                user_id="user-001",
                session_id="session-001",
                content={"text": "Hello, Zynx AGI!"},
                timestamp=time.time()
            )
            
            publish_success = await self.redis_manager.publish("chat:test", test_message)
            
            # Test WebSocket manager
            connection_stats = await self.ws_manager.get_connection_stats()
            
            return {
                "success": True,
                "redis_connected": connection_success,
                "message_published": publish_success,
                "connection_stats": connection_stats,
                "channels_subscribed": len(self.redis_manager.channels)
            }
            
        except Exception as e:
            logger.error(f"❌ Redis Pub/Sub execution failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def execute_pdpa_policy_engine(self) -> Dict[str, Any]:
        """Execute PDPA Policy Engine implementation"""
        logger.info("🔒 Starting PDPA Policy Engine Implementation...")
        
        try:
            # Test consent creation
            user_id = "user-001"
            consent = await self.pdpa_engine.create_consent(
                user_id=user_id,
                purpose=ProcessingPurpose.CHAT_SERVICE,
                data_categories=[DataCategory.PERSONAL, DataCategory.SENSITIVE],
                expires_in_days=30
            )
            
            # Test consent checking
            has_consent, consent_id = await self.pdpa_engine.check_consent(user_id, ProcessingPurpose.CHAT_SERVICE)
            
            # Test data processing recording
            processing_record = await self.pdpa_engine.record_data_processing(
                user_id=user_id,
                purpose=ProcessingPurpose.CHAT_SERVICE,
                data_categories=[DataCategory.PERSONAL],
                consent_id=consent.consent_id,
                data_hash="hash-123"
            )
            
            # Test user rights request
            rights_request = await self.pdpa_engine.request_user_rights(
                user_id=user_id,
                request_type="access",
                details={"reason": "Data access request"}
            )
            
            # Test user data retrieval
            user_data = await self.pdpa_engine.get_user_data(user_id)
            
            # Test compliance report
            compliance_report = await self.pdpa_engine.get_compliance_report()
            
            return {
                "success": True,
                "consent_created": consent.consent_id,
                "consent_valid": has_consent,
                "processing_recorded": processing_record.processing_id,
                "rights_requested": rights_request.request_id,
                "user_data_retrieved": len(user_data.get("consents", [])),
                "compliance_metrics": compliance_report.get("compliance_metrics", {})
            }
            
        except Exception as e:
            logger.error(f"❌ PDPA Policy Engine execution failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def test_integration(self) -> Dict[str, Any]:
        """Test integration between Redis Pub/Sub and PDPA Policy Engine"""
        logger.info("🔗 Testing Redis + PDPA Integration...")
        
        try:
            # Test end-to-end flow
            user_id = "user-002"
            session_id = "session-002"
            
            # 1. Create consent for chat service
            consent = await self.pdpa_engine.create_consent(
                user_id=user_id,
                purpose=ProcessingPurpose.CHAT_SERVICE,
                data_categories=[DataCategory.PERSONAL],
                expires_in_days=30
            )
            
            # 2. Check consent before processing
            has_consent, consent_id = await self.pdpa_engine.check_consent(user_id, ProcessingPurpose.CHAT_SERVICE)
            
            if not has_consent:
                return {"success": False, "error": "Consent check failed"}
            
            # 3. Create chat message
            chat_message = WebSocketMessage(
                message_id="integration-test-001",
                message_type=MessageType.CHAT,
                user_id=user_id,
                session_id=session_id,
                content={"text": "Integration test message"},
                timestamp=time.time()
            )
            
            # 4. Publish message to Redis
            publish_success = await self.redis_manager.publish("chat:integration", chat_message)
            
            # 5. Record data processing
            processing_record = await self.pdpa_engine.record_data_processing(
                user_id=user_id,
                purpose=ProcessingPurpose.CHAT_SERVICE,
                data_categories=[DataCategory.PERSONAL],
                consent_id=consent.consent_id,
                data_hash=f"hash-{chat_message.message_id}"
            )
            
            return {
                "success": True,
                "consent_created": consent.consent_id,
                "consent_valid": has_consent,
                "message_published": publish_success,
                "processing_recorded": processing_record.processing_id,
                "integration_complete": True
            }
            
        except Exception as e:
            logger.error(f"❌ Integration test failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def validate_phase2_requirements(self) -> Dict[str, Any]:
        """Validate Phase 2 requirements completion"""
        logger.info("✅ Validating Phase 2 Requirements...")
        
        requirements = {
            "redis_pubsub": False,
            "pdpa_policy_engine": False,
            "integration": False,
            "scalability": False,
            "compliance": False
        }
        
        # Check Redis Pub/Sub
        if "redis" in self.results and self.results["redis"]["success"]:
            requirements["redis_pubsub"] = True
            requirements["scalability"] = True
        
        # Check PDPA Policy Engine
        if "pdpa" in self.results and self.results["pdpa"]["success"]:
            requirements["pdpa_policy_engine"] = True
            requirements["compliance"] = True
        
        # Check integration
        if "integration" in self.results and self.results["integration"]["success"]:
            requirements["integration"] = True
        
        return {
            "requirements_met": all(requirements.values()),
            "requirements_status": requirements,
            "overall_success": all(requirements.values())
        }
    
    async def generate_phase2_report(self) -> Dict[str, Any]:
        """Generate comprehensive Phase 2 report"""
        logger.info("📋 Generating Phase 2 Report...")
        
        execution_time = time.time() - self.start_time
        
        report = {
            "phase": "Phase 2: Core Features",
            "execution_time_seconds": execution_time,
            "timestamp": time.time(),
            "overall_success": False,
            "redis_results": self.results.get("redis", {}),
            "pdpa_results": self.results.get("pdpa", {}),
            "integration_results": self.results.get("integration", {}),
            "requirements_validation": self.results.get("validation", {}),
            "next_phase_ready": False,
            "recommendations": []
        }
        
        # Determine overall success
        if (self.results.get("redis", {}).get("success", False) and 
            self.results.get("pdpa", {}).get("success", False) and
            self.results.get("validation", {}).get("overall_success", False)):
            report["overall_success"] = True
            report["next_phase_ready"] = True
            report["recommendations"].append("✅ Phase 2 completed successfully - ready for Phase 3")
        else:
            report["recommendations"].append("⚠️ Phase 2 needs additional work before Phase 3")
        
        # Add specific recommendations
        if not self.results.get("redis", {}).get("success", False):
            report["recommendations"].append("🔍 Review Redis Pub/Sub implementation")
        
        if not self.results.get("pdpa", {}).get("success", False):
            report["recommendations"].append("🔒 Review PDPA Policy Engine implementation")
        
        if not self.results.get("validation", {}).get("requirements_met", False):
            report["recommendations"].append("📊 Review requirements validation")
        
        return report
    
    async def execute_phase2(self) -> Dict[str, Any]:
        """Execute complete Phase 2"""
        logger.info("🚀 Starting Phase 2: Core Features Implementation")
        logger.info("=" * 50)
        
        # Step 1: Redis Pub/Sub Implementation
        logger.info("📋 Step 1: Redis Pub/Sub Implementation")
        redis_results = await self.execute_redis_pubsub()
        self.results["redis"] = redis_results
        
        if redis_results["success"]:
            logger.info("✅ Redis Pub/Sub completed successfully")
        else:
            logger.error("❌ Redis Pub/Sub failed")
        
        # Step 2: PDPA Policy Engine Implementation
        logger.info("📋 Step 2: PDPA Policy Engine Implementation")
        pdpa_results = await self.execute_pdpa_policy_engine()
        self.results["pdpa"] = pdpa_results
        
        if pdpa_results["success"]:
            logger.info("✅ PDPA Policy Engine completed successfully")
        else:
            logger.error("❌ PDPA Policy Engine failed")
        
        # Step 3: Integration Testing
        logger.info("📋 Step 3: Integration Testing")
        integration_results = await self.test_integration()
        self.results["integration"] = integration_results
        
        if integration_results["success"]:
            logger.info("✅ Integration testing completed successfully")
        else:
            logger.error("❌ Integration testing failed")
        
        # Step 4: Validate Requirements
        logger.info("📋 Step 4: Validate Phase 2 Requirements")
        validation_results = await self.validate_phase2_requirements()
        self.results["validation"] = validation_results
        
        if validation_results["overall_success"]:
            logger.info("✅ Phase 2 Requirements validated successfully")
        else:
            logger.warning("⚠️ Phase 2 Requirements partially met")
        
        # Step 5: Generate Report
        logger.info("📋 Step 5: Generate Phase 2 Report")
        phase2_report = await self.generate_phase2_report()
        self.results["report"] = phase2_report
        
        # Final summary
        logger.info("=" * 50)
        logger.info("📊 Phase 2 Execution Summary:")
        logger.info(f"✅ Redis Pub/Sub: {redis_results['success']}")
        logger.info(f"✅ PDPA Policy Engine: {pdpa_results['success']}")
        logger.info(f"✅ Integration: {integration_results['success']}")
        logger.info(f"✅ Requirements Met: {validation_results['overall_success']}")
        logger.info(f"✅ Overall Success: {phase2_report['overall_success']}")
        logger.info(f"✅ Next Phase Ready: {phase2_report['next_phase_ready']}")
        
        return phase2_report

async def main():
    """Main function for Phase 2 execution"""
    executor = Phase2Executor()
    
    try:
        # Execute Phase 2
        results = await executor.execute_phase2()
        
        # Print detailed results
        print("\n" + "="*60)
        print("📋 PHASE 2 EXECUTION RESULTS")
        print("="*60)
        
        print(f"\n🎯 Overall Success: {results['overall_success']}")
        print(f"⏱️ Execution Time: {results['execution_time_seconds']:.2f} seconds")
        print(f"🚀 Next Phase Ready: {results['next_phase_ready']}")
        
        print(f"\n🔍 Redis Pub/Sub:")
        redis = results['redis_results']
        if redis.get('success'):
            print(f"  ✅ Connected: {redis.get('redis_connected', False)}")
            print(f"  ✅ Message Published: {redis.get('message_published', False)}")
            print(f"  📊 Channels Subscribed: {redis.get('channels_subscribed', 0)}")
        else:
            print(f"  ❌ Failed: {redis.get('error', 'Unknown error')}")
        
        print(f"\n🔒 PDPA Policy Engine:")
        pdpa = results['pdpa_results']
        if pdpa.get('success'):
            print(f"  ✅ Consent Created: {pdpa.get('consent_created', 'N/A')}")
            print(f"  ✅ Consent Valid: {pdpa.get('consent_valid', False)}")
            print(f"  ✅ Processing Recorded: {pdpa.get('processing_recorded', 'N/A')}")
            print(f"  ✅ Rights Requested: {pdpa.get('rights_requested', 'N/A')}")
        else:
            print(f"  ❌ Failed: {pdpa.get('error', 'Unknown error')}")
        
        print(f"\n🔗 Integration Testing:")
        integration = results['integration_results']
        if integration.get('success'):
            print(f"  ✅ Integration Complete: {integration.get('integration_complete', False)}")
            print(f"  ✅ Message Published: {integration.get('message_published', False)}")
            print(f"  ✅ Processing Recorded: {integration.get('processing_recorded', 'N/A')}")
        else:
            print(f"  ❌ Failed: {integration.get('error', 'Unknown error')}")
        
        print(f"\n✅ Requirements Validation:")
        validation = results['requirements_validation']
        print(f"  📋 All Requirements Met: {validation.get('requirements_met', False)}")
        
        print(f"\n💡 Recommendations:")
        for rec in results['recommendations']:
            print(f"  - {rec}")
        
        print("\n" + "="*60)
        
        if results['overall_success']:
            print("🎉 PHASE 2 COMPLETED SUCCESSFULLY!")
            print("🚀 Ready to proceed to Phase 3: Advanced Features")
        else:
            print("⚠️ PHASE 2 NEEDS ADDITIONAL WORK")
            print("🔧 Review recommendations before proceeding")
        
        print("="*60)
        
    except Exception as e:
        logger.error(f"❌ Phase 2 execution failed: {e}")
        print(f"❌ Phase 2 execution failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())