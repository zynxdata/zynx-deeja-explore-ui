#!/usr/bin/env python3
"""
Zynx AGI Platform - Phase 3 Execution Script
Advanced Features: Emotion Detection Integration
"""

import asyncio
import sys
import time
from pathlib import Path
from typing import Dict, List, Any
from loguru import logger

# Add backend to path for imports
sys.path.append("backend")

from emotion_detection import EmotionIntegration, EmotionAnalyzer, EmotionDetector
from redis_pubsub import RedisPubSubManager, WebSocketManager, WebSocketMessage, MessageType
from pdpa_policy_engine import PDPAPolicyEngine, ProcessingPurpose, DataCategory

class Phase3Executor:
    """Execute Phase 3 of Zynx implementation plan"""
    
    def __init__(self):
        self.emotion_integration = EmotionIntegration()
        self.emotion_analyzer = EmotionAnalyzer()
        self.redis_manager = RedisPubSubManager()
        self.pdpa_engine = PDPAPolicyEngine()
        self.results = {}
        self.start_time = time.time()
    
    async def execute_emotion_detection(self) -> Dict[str, Any]:
        """Execute emotion detection integration"""
        logger.info("🧠 Starting Emotion Detection Integration...")
        
        try:
            # Test emotion detection with various inputs
            test_inputs = [
                {
                    "type": "text",
                    "text": "I'm so happy today! Everything is going great!"
                },
                {
                    "type": "text", 
                    "text": "I'm feeling really sad and depressed"
                },
                {
                    "type": "text",
                    "text": "I'm so angry about what happened!"
                },
                {
                    "type": "text",
                    "text": "I'm confused about this situation"
                },
                {
                    "type": "text",
                    "text": "I'm excited to work with you!"
                }
            ]
            
            user_id = "user-001"
            session_id = "session-001"
            
            detection_results = []
            for input_data in test_inputs:
                result = await self.emotion_integration.process_with_emotion(
                    user_id, session_id, input_data
                )
                detection_results.append(result)
            
            # Test emotion trends
            trends = await self.emotion_analyzer.get_emotion_trends(user_id)
            
            # Test emotion report
            report = await self.emotion_analyzer.generate_emotion_report(user_id)
            
            return {
                "success": True,
                "detection_results": detection_results,
                "emotion_trends": trends,
                "emotion_report": report,
                "total_emotions_detected": len(detection_results)
            }
            
        except Exception as e:
            logger.error(f"❌ Emotion detection execution failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def execute_redis_emotion_integration(self) -> Dict[str, Any]:
        """Execute Redis + Emotion integration"""
        logger.info("🔗 Starting Redis + Emotion Integration...")
        
        try:
            # Connect to Redis
            connection_success = await self.redis_manager.connect()
            if not connection_success:
                return {"success": False, "error": "Redis connection failed"}
            
            # Test emotion message publishing
            emotion_message = WebSocketMessage(
                message_id="emotion-test-001",
                message_type=MessageType.EMOTION,
                user_id="user-001",
                session_id="session-001",
                content={
                    "emotion": "happy",
                    "confidence": 0.85,
                    "intensity": 0.8,
                    "timestamp": time.time()
                },
                timestamp=time.time()
            )
            
            publish_success = await self.redis_manager.publish("emotion:test", emotion_message)
            
            # Test emotion-aware chat message
            chat_message = WebSocketMessage(
                message_id="chat-emotion-001",
                message_type=MessageType.CHAT,
                user_id="user-001",
                session_id="session-001",
                content={
                    "text": "I'm feeling great today!",
                    "emotion_detected": {
                        "emotion": "happy",
                        "confidence": 0.9,
                        "intensity": 0.85
                    }
                },
                timestamp=time.time()
            )
            
            chat_publish_success = await self.redis_manager.publish("chat:emotion", chat_message)
            
            return {
                "success": True,
                "redis_connected": connection_success,
                "emotion_message_published": publish_success,
                "chat_emotion_published": chat_publish_success,
                "channels_subscribed": len(self.redis_manager.channels)
            }
            
        except Exception as e:
            logger.error(f"❌ Redis + Emotion integration failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def execute_pdpa_emotion_integration(self) -> Dict[str, Any]:
        """Execute PDPA + Emotion integration"""
        logger.info("🔒 Starting PDPA + Emotion Integration...")
        
        try:
            user_id = "user-001"
            
            # Create consent for emotion detection
            consent = await self.pdpa_engine.create_consent(
                user_id=user_id,
                purpose=ProcessingPurpose.EMOTION_DETECTION,
                data_categories=[DataCategory.SENSITIVE],
                expires_in_days=7
            )
            
            # Check consent for emotion processing
            has_consent, consent_id = await self.pdpa_engine.check_consent(
                user_id, ProcessingPurpose.EMOTION_DETECTION
            )
            
            # Record emotion data processing
            processing_record = await self.pdpa_engine.record_data_processing(
                user_id=user_id,
                purpose=ProcessingPurpose.EMOTION_DETECTION,
                data_categories=[DataCategory.SENSITIVE],
                consent_id=consent.consent_id,
                data_hash="emotion-data-hash-123"
            )
            
            # Test user rights for emotion data
            rights_request = await self.pdpa_engine.request_user_rights(
                user_id=user_id,
                request_type="access",
                details={"reason": "Access emotion detection data"}
            )
            
            return {
                "success": True,
                "consent_created": consent.consent_id,
                "consent_valid": has_consent,
                "processing_recorded": processing_record.processing_id,
                "rights_requested": rights_request.request_id
            }
            
        except Exception as e:
            logger.error(f"❌ PDPA + Emotion integration failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def test_end_to_end_integration(self) -> Dict[str, Any]:
        """Test end-to-end integration of all Phase 3 components"""
        logger.info("🔗 Testing End-to-End Phase 3 Integration...")
        
        try:
            user_id = "user-002"
            session_id = "session-002"
            
            # 1. Create PDPA consent for emotion detection
            consent = await self.pdpa_engine.create_consent(
                user_id=user_id,
                purpose=ProcessingPurpose.EMOTION_DETECTION,
                data_categories=[DataCategory.SENSITIVE],
                expires_in_days=7
            )
            
            # 2. Check consent
            has_consent, consent_id = await self.pdpa_engine.check_consent(
                user_id, ProcessingPurpose.EMOTION_DETECTION
            )
            
            if not has_consent:
                return {"success": False, "error": "Consent check failed"}
            
            # 3. Process input with emotion detection
            input_data = {
                "type": "text",
                "text": "I'm feeling really happy and excited about this project!"
            }
            
            emotion_result = await self.emotion_integration.process_with_emotion(
                user_id, session_id, input_data
            )
            
            # 4. Publish emotion message to Redis
            emotion_message = WebSocketMessage(
                message_id="integration-emotion-001",
                message_type=MessageType.EMOTION,
                user_id=user_id,
                session_id=session_id,
                content={
                    "emotion": emotion_result["emotion_detected"]["emotion"],
                    "confidence": emotion_result["emotion_detected"]["confidence"],
                    "intensity": emotion_result["emotion_detected"]["intensity"],
                    "timestamp": emotion_result["emotion_detected"]["timestamp"]
                },
                timestamp=time.time()
            )
            
            publish_success = await self.redis_manager.publish("emotion:integration", emotion_message)
            
            # 5. Record data processing
            processing_record = await self.pdpa_engine.record_data_processing(
                user_id=user_id,
                purpose=ProcessingPurpose.EMOTION_DETECTION,
                data_categories=[DataCategory.SENSITIVE],
                consent_id=consent.consent_id,
                data_hash=f"emotion-{emotion_result['emotion_detected']['emotion']}-hash"
            )
            
            return {
                "success": True,
                "consent_created": consent.consent_id,
                "consent_valid": has_consent,
                "emotion_detected": emotion_result["emotion_detected"]["emotion"],
                "emotion_confidence": emotion_result["emotion_detected"]["confidence"],
                "message_published": publish_success,
                "processing_recorded": processing_record.processing_id,
                "integration_complete": True
            }
            
        except Exception as e:
            logger.error(f"❌ End-to-end integration test failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def validate_phase3_requirements(self) -> Dict[str, Any]:
        """Validate Phase 3 requirements completion"""
        logger.info("✅ Validating Phase 3 Requirements...")
        
        requirements = {
            "emotion_detection": False,
            "redis_emotion_integration": False,
            "pdpa_emotion_integration": False,
            "end_to_end_integration": False,
            "advanced_features": False
        }
        
        # Check emotion detection
        if "emotion" in self.results and self.results["emotion"]["success"]:
            requirements["emotion_detection"] = True
            requirements["advanced_features"] = True
        
        # Check Redis + Emotion integration
        if "redis_emotion" in self.results and self.results["redis_emotion"]["success"]:
            requirements["redis_emotion_integration"] = True
        
        # Check PDPA + Emotion integration
        if "pdpa_emotion" in self.results and self.results["pdpa_emotion"]["success"]:
            requirements["pdpa_emotion_integration"] = True
        
        # Check end-to-end integration
        if "integration" in self.results and self.results["integration"]["success"]:
            requirements["end_to_end_integration"] = True
        
        return {
            "requirements_met": all(requirements.values()),
            "requirements_status": requirements,
            "overall_success": all(requirements.values())
        }
    
    async def generate_phase3_report(self) -> Dict[str, Any]:
        """Generate comprehensive Phase 3 report"""
        logger.info("📋 Generating Phase 3 Report...")
        
        execution_time = time.time() - self.start_time
        
        report = {
            "phase": "Phase 3: Advanced Features",
            "execution_time_seconds": execution_time,
            "timestamp": time.time(),
            "overall_success": False,
            "emotion_results": self.results.get("emotion", {}),
            "redis_emotion_results": self.results.get("redis_emotion", {}),
            "pdpa_emotion_results": self.results.get("pdpa_emotion", {}),
            "integration_results": self.results.get("integration", {}),
            "requirements_validation": self.results.get("validation", {}),
            "next_phase_ready": False,
            "recommendations": []
        }
        
        # Determine overall success
        if (self.results.get("emotion", {}).get("success", False) and 
            self.results.get("redis_emotion", {}).get("success", False) and
            self.results.get("pdpa_emotion", {}).get("success", False) and
            self.results.get("validation", {}).get("overall_success", False)):
            report["overall_success"] = True
            report["next_phase_ready"] = True
            report["recommendations"].append("✅ Phase 3 completed successfully - ready for production")
        else:
            report["recommendations"].append("⚠️ Phase 3 needs additional work before production")
        
        # Add specific recommendations
        if not self.results.get("emotion", {}).get("success", False):
            report["recommendations"].append("🧠 Review emotion detection implementation")
        
        if not self.results.get("redis_emotion", {}).get("success", False):
            report["recommendations"].append("🔗 Review Redis + Emotion integration")
        
        if not self.results.get("pdpa_emotion", {}).get("success", False):
            report["recommendations"].append("🔒 Review PDPA + Emotion integration")
        
        if not self.results.get("validation", {}).get("requirements_met", False):
            report["recommendations"].append("📊 Review requirements validation")
        
        return report
    
    async def execute_phase3(self) -> Dict[str, Any]:
        """Execute complete Phase 3"""
        logger.info("🚀 Starting Phase 3: Advanced Features Implementation")
        logger.info("=" * 50)
        
        # Step 1: Emotion Detection Integration
        logger.info("📋 Step 1: Emotion Detection Integration")
        emotion_results = await self.execute_emotion_detection()
        self.results["emotion"] = emotion_results
        
        if emotion_results["success"]:
            logger.info("✅ Emotion Detection Integration completed successfully")
        else:
            logger.error("❌ Emotion Detection Integration failed")
        
        # Step 2: Redis + Emotion Integration
        logger.info("📋 Step 2: Redis + Emotion Integration")
        redis_emotion_results = await self.execute_redis_emotion_integration()
        self.results["redis_emotion"] = redis_emotion_results
        
        if redis_emotion_results["success"]:
            logger.info("✅ Redis + Emotion Integration completed successfully")
        else:
            logger.error("❌ Redis + Emotion Integration failed")
        
        # Step 3: PDPA + Emotion Integration
        logger.info("📋 Step 3: PDPA + Emotion Integration")
        pdpa_emotion_results = await self.execute_pdpa_emotion_integration()
        self.results["pdpa_emotion"] = pdpa_emotion_results
        
        if pdpa_emotion_results["success"]:
            logger.info("✅ PDPA + Emotion Integration completed successfully")
        else:
            logger.error("❌ PDPA + Emotion Integration failed")
        
        # Step 4: End-to-End Integration Testing
        logger.info("📋 Step 4: End-to-End Integration Testing")
        integration_results = await self.test_end_to_end_integration()
        self.results["integration"] = integration_results
        
        if integration_results["success"]:
            logger.info("✅ End-to-End Integration Testing completed successfully")
        else:
            logger.error("❌ End-to-End Integration Testing failed")
        
        # Step 5: Validate Requirements
        logger.info("📋 Step 5: Validate Phase 3 Requirements")
        validation_results = await self.validate_phase3_requirements()
        self.results["validation"] = validation_results
        
        if validation_results["overall_success"]:
            logger.info("✅ Phase 3 Requirements validated successfully")
        else:
            logger.warning("⚠️ Phase 3 Requirements partially met")
        
        # Step 6: Generate Report
        logger.info("📋 Step 6: Generate Phase 3 Report")
        phase3_report = await self.generate_phase3_report()
        self.results["report"] = phase3_report
        
        # Final summary
        logger.info("=" * 50)
        logger.info("📊 Phase 3 Execution Summary:")
        logger.info(f"✅ Emotion Detection: {emotion_results['success']}")
        logger.info(f"✅ Redis + Emotion: {redis_emotion_results['success']}")
        logger.info(f"✅ PDPA + Emotion: {pdpa_emotion_results['success']}")
        logger.info(f"✅ Integration: {integration_results['success']}")
        logger.info(f"✅ Requirements Met: {validation_results['overall_success']}")
        logger.info(f"✅ Overall Success: {phase3_report['overall_success']}")
        logger.info(f"✅ Next Phase Ready: {phase3_report['next_phase_ready']}")
        
        return phase3_report

async def main():
    """Main function for Phase 3 execution"""
    executor = Phase3Executor()
    
    try:
        # Execute Phase 3
        results = await executor.execute_phase3()
        
        # Print detailed results
        print("\n" + "="*60)
        print("📋 PHASE 3 EXECUTION RESULTS")
        print("="*60)
        
        print(f"\n🎯 Overall Success: {results['overall_success']}")
        print(f"⏱️ Execution Time: {results['execution_time_seconds']:.2f} seconds")
        print(f"🚀 Next Phase Ready: {results['next_phase_ready']}")
        
        print(f"\n🧠 Emotion Detection Integration:")
        emotion = results['emotion_results']
        if emotion.get('success'):
            print(f"  ✅ Total Emotions Detected: {emotion.get('total_emotions_detected', 0)}")
            print(f"  ✅ Detection Results: {len(emotion.get('detection_results', []))}")
            print(f"  ✅ Emotion Trends: Available")
            print(f"  ✅ Emotion Report: Generated")
        else:
            print(f"  ❌ Failed: {emotion.get('error', 'Unknown error')}")
        
        print(f"\n🔗 Redis + Emotion Integration:")
        redis_emotion = results['redis_emotion_results']
        if redis_emotion.get('success'):
            print(f"  ✅ Redis Connected: {redis_emotion.get('redis_connected', False)}")
            print(f"  ✅ Emotion Message Published: {redis_emotion.get('emotion_message_published', False)}")
            print(f"  ✅ Chat Emotion Published: {redis_emotion.get('chat_emotion_published', False)}")
            print(f"  📊 Channels Subscribed: {redis_emotion.get('channels_subscribed', 0)}")
        else:
            print(f"  ❌ Failed: {redis_emotion.get('error', 'Unknown error')}")
        
        print(f"\n🔒 PDPA + Emotion Integration:")
        pdpa_emotion = results['pdpa_emotion_results']
        if pdpa_emotion.get('success'):
            print(f"  ✅ Consent Created: {pdpa_emotion.get('consent_created', 'N/A')}")
            print(f"  ✅ Consent Valid: {pdpa_emotion.get('consent_valid', False)}")
            print(f"  ✅ Processing Recorded: {pdpa_emotion.get('processing_recorded', 'N/A')}")
            print(f"  ✅ Rights Requested: {pdpa_emotion.get('rights_requested', 'N/A')}")
        else:
            print(f"  ❌ Failed: {pdpa_emotion.get('error', 'Unknown error')}")
        
        print(f"\n🔗 End-to-End Integration:")
        integration = results['integration_results']
        if integration.get('success'):
            print(f"  ✅ Integration Complete: {integration.get('integration_complete', False)}")
            print(f"  ✅ Emotion Detected: {integration.get('emotion_detected', 'N/A')}")
            print(f"  ✅ Emotion Confidence: {integration.get('emotion_confidence', 0):.2f}")
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
            print("🎉 PHASE 3 COMPLETED SUCCESSFULLY!")
            print("🚀 Ready for production deployment")
        else:
            print("⚠️ PHASE 3 NEEDS ADDITIONAL WORK")
            print("🔧 Review recommendations before production")
        
        print("="*60)
        
    except Exception as e:
        logger.error(f"❌ Phase 3 execution failed: {e}")
        print(f"❌ Phase 3 execution failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())