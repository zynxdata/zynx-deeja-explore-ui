#!/usr/bin/env python3
"""
Zynx AGI Platform - Emotion Detection Integration
Phase 3: Advanced Features - Real-time Emotion Analysis
"""

import asyncio
import json
import time
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import numpy as np
from loguru import logger

class EmotionType(Enum):
    """Emotion types for detection"""
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    NEUTRAL = "neutral"
    EXCITED = "excited"
    CALM = "calm"
    CONFUSED = "confused"

@dataclass
class EmotionResult:
    """Emotion detection result"""
    emotion: EmotionType
    confidence: float
    intensity: float
    timestamp: float
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class EmotionContext:
    """Context for emotion analysis"""
    user_id: str
    session_id: str
    conversation_history: List[Dict[str, Any]]
    cultural_context: str = "thai"
    language: str = "th"
    previous_emotions: List[EmotionResult] = None

class EmotionDetector:
    """Off-the-shelf emotion detection system"""
    
    def __init__(self):
        self.emotion_models = {
            "text": self._text_emotion_detector,
            "voice": self._voice_emotion_detector,
            "facial": self._facial_emotion_detector
        }
        self.cultural_weights = {
            "thai": {
                "happy": 1.2,
                "sad": 0.8,
                "angry": 0.9,
                "fear": 1.1,
                "surprise": 1.0,
                "disgust": 0.7,
                "neutral": 1.0,
                "excited": 1.3,
                "calm": 1.1,
                "confused": 0.9
            }
        }
    
    async def detect_emotion(self, input_data: Dict[str, Any], 
                           context: EmotionContext) -> EmotionResult:
        """Detect emotion from input data"""
        try:
            input_type = input_data.get("type", "text")
            
            if input_type not in self.emotion_models:
                logger.warning(f"⚠️ Unsupported input type: {input_type}")
                return self._create_neutral_result()
            
            # Get base emotion detection
            base_result = await self.emotion_models[input_type](input_data)
            
            # Apply cultural context
            cultural_result = self._apply_cultural_context(base_result, context)
            
            # Apply conversation context
            contextual_result = self._apply_conversation_context(cultural_result, context)
            
            logger.info(f"✅ Emotion detected: {contextual_result.emotion.value} "
                       f"(confidence: {contextual_result.confidence:.2f})")
            
            return contextual_result
            
        except Exception as e:
            logger.error(f"❌ Emotion detection failed: {e}")
            return self._create_neutral_result()
    
    async def _text_emotion_detector(self, input_data: Dict[str, Any]) -> EmotionResult:
        """Detect emotion from text input"""
        text = input_data.get("text", "").lower()
        
        # Simple keyword-based emotion detection
        emotion_keywords = {
            EmotionType.HAPPY: ["happy", "joy", "excited", "great", "wonderful", "ดี", "สุข", "ดีใจ"],
            EmotionType.SAD: ["sad", "sorrow", "depressed", "unhappy", "เศร้า", "เสียใจ", "หดหู่"],
            EmotionType.ANGRY: ["angry", "mad", "furious", "rage", "โกรธ", "โมโห", "ฉุนเฉียว"],
            EmotionType.FEAR: ["fear", "afraid", "scared", "terrified", "กลัว", "หวาดกลัว", "ตกใจ"],
            EmotionType.SURPRISE: ["surprise", "shocked", "amazed", "wow", "ประหลาดใจ", "ตกใจ", "แปลกใจ"],
            EmotionType.DISGUST: ["disgust", "revolted", "sick", "ขยะแขยง", "รังเกียจ"],
            EmotionType.EXCITED: ["excited", "thrilled", "enthusiastic", "ตื่นเต้น", "กระตือรือร้น"],
            EmotionType.CALM: ["calm", "peaceful", "relaxed", "สงบ", "ผ่อนคลาย", "เย็น"],
            EmotionType.CONFUSED: ["confused", "puzzled", "unsure", "สับสน", "งง", "ไม่แน่ใจ"]
        }
        
        # Calculate emotion scores
        emotion_scores = {}
        for emotion, keywords in emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > 0:
                emotion_scores[emotion] = score
        
        if not emotion_scores:
            return self._create_neutral_result()
        
        # Get highest scoring emotion
        best_emotion = max(emotion_scores.items(), key=lambda x: x[1])
        confidence = min(best_emotion[1] / len(text.split()) * 2, 1.0)
        
        return EmotionResult(
            emotion=best_emotion[0],
            confidence=confidence,
            intensity=confidence,
            timestamp=time.time()
        )
    
    async def _voice_emotion_detector(self, input_data: Dict[str, Any]) -> EmotionResult:
        """Detect emotion from voice input (simulated)"""
        # Simulate voice emotion detection
        audio_features = input_data.get("audio_features", {})
        
        # Simulate based on pitch, volume, speed
        pitch = audio_features.get("pitch", 0.5)
        volume = audio_features.get("volume", 0.5)
        speed = audio_features.get("speed", 0.5)
        
        # Simple rule-based detection
        if pitch > 0.7 and volume > 0.6:
            emotion = EmotionType.EXCITED
            confidence = 0.8
        elif pitch < 0.3 and volume < 0.4:
            emotion = EmotionType.SAD
            confidence = 0.7
        elif volume > 0.8:
            emotion = EmotionType.ANGRY
            confidence = 0.6
        else:
            emotion = EmotionType.NEUTRAL
            confidence = 0.5
        
        return EmotionResult(
            emotion=emotion,
            confidence=confidence,
            intensity=confidence,
            timestamp=time.time()
        )
    
    async def _facial_emotion_detector(self, input_data: Dict[str, Any]) -> EmotionResult:
        """Detect emotion from facial expressions (simulated)"""
        # Simulate facial emotion detection
        facial_features = input_data.get("facial_features", {})
        
        # Simulate based on facial landmarks
        smile = facial_features.get("smile", 0.5)
        eyebrows = facial_features.get("eyebrows", 0.5)
        eyes = facial_features.get("eyes", 0.5)
        
        # Simple rule-based detection
        if smile > 0.7:
            emotion = EmotionType.HAPPY
            confidence = 0.8
        elif eyebrows < 0.3 and eyes < 0.4:
            emotion = EmotionType.SAD
            confidence = 0.7
        elif eyebrows > 0.8:
            emotion = EmotionType.ANGRY
            confidence = 0.6
        else:
            emotion = EmotionType.NEUTRAL
            confidence = 0.5
        
        return EmotionResult(
            emotion=emotion,
            confidence=confidence,
            intensity=confidence,
            timestamp=time.time()
        )
    
    def _apply_cultural_context(self, result: EmotionResult, 
                               context: EmotionContext) -> EmotionResult:
        """Apply cultural context to emotion detection"""
        cultural_weights = self.cultural_weights.get(context.cultural_context, {})
        
        if result.emotion.value in cultural_weights:
            weight = cultural_weights[result.emotion.value]
            adjusted_confidence = min(result.confidence * weight, 1.0)
            adjusted_intensity = min(result.intensity * weight, 1.0)
            
            return EmotionResult(
                emotion=result.emotion,
                confidence=adjusted_confidence,
                intensity=adjusted_intensity,
                timestamp=result.timestamp,
                metadata={"cultural_adjustment": weight}
            )
        
        return result
    
    def _apply_conversation_context(self, result: EmotionResult, 
                                   context: EmotionContext) -> EmotionResult:
        """Apply conversation context to emotion detection"""
        if not context.previous_emotions:
            return result
        
        # Consider recent emotion history
        recent_emotions = context.previous_emotions[-3:]  # Last 3 emotions
        
        # Calculate emotion stability
        emotion_changes = len(set(e.emotion for e in recent_emotions))
        stability_factor = 1.0 - (emotion_changes / len(recent_emotions)) * 0.2
        
        # Adjust confidence based on stability
        adjusted_confidence = result.confidence * stability_factor
        
        return EmotionResult(
            emotion=result.emotion,
            confidence=adjusted_confidence,
            intensity=result.intensity,
            timestamp=result.timestamp,
            metadata={"stability_factor": stability_factor}
        )
    
    def _create_neutral_result(self) -> EmotionResult:
        """Create a neutral emotion result"""
        return EmotionResult(
            emotion=EmotionType.NEUTRAL,
            confidence=0.5,
            intensity=0.5,
            timestamp=time.time()
        )

class EmotionAnalyzer:
    """Advanced emotion analysis with context"""
    
    def __init__(self):
        self.detector = EmotionDetector()
        self.emotion_history: Dict[str, List[EmotionResult]] = {}
        self.conversation_contexts: Dict[str, EmotionContext] = {}
    
    async def analyze_emotion(self, user_id: str, session_id: str, 
                            input_data: Dict[str, Any]) -> EmotionResult:
        """Analyze emotion with full context"""
        try:
            # Get or create context
            context_key = f"{user_id}:{session_id}"
            if context_key not in self.conversation_contexts:
                self.conversation_contexts[context_key] = EmotionContext(
                    user_id=user_id,
                    session_id=session_id,
                    conversation_history=[],
                    previous_emotions=[]
                )
            
            context = self.conversation_contexts[context_key]
            
            # Update conversation history
            context.conversation_history.append({
                "timestamp": time.time(),
                "input": input_data,
                "type": input_data.get("type", "text")
            })
            
            # Detect emotion
            emotion_result = await self.detector.detect_emotion(input_data, context)
            
            # Update emotion history
            if user_id not in self.emotion_history:
                self.emotion_history[user_id] = []
            
            self.emotion_history[user_id].append(emotion_result)
            context.previous_emotions = self.emotion_history[user_id][-10:]  # Keep last 10
            
            # Update context
            self.conversation_contexts[context_key] = context
            
            logger.info(f"✅ Emotion analyzed for user {user_id}: {emotion_result.emotion.value}")
            return emotion_result
            
        except Exception as e:
            logger.error(f"❌ Emotion analysis failed: {e}")
            return self.detector._create_neutral_result()
    
    async def get_emotion_trends(self, user_id: str, 
                                time_window: int = 3600) -> Dict[str, Any]:
        """Get emotion trends for a user"""
        try:
            if user_id not in self.emotion_history:
                return {"error": "No emotion history found"}
            
            current_time = time.time()
            recent_emotions = [
                e for e in self.emotion_history[user_id]
                if current_time - e.timestamp < time_window
            ]
            
            if not recent_emotions:
                return {"error": "No recent emotions found"}
            
            # Calculate trends
            emotion_counts = {}
            avg_confidence = 0
            avg_intensity = 0
            
            for emotion in recent_emotions:
                emotion_type = emotion.emotion.value
                emotion_counts[emotion_type] = emotion_counts.get(emotion_type, 0) + 1
                avg_confidence += emotion.confidence
                avg_intensity += emotion.intensity
            
            avg_confidence /= len(recent_emotions)
            avg_intensity /= len(recent_emotions)
            
            # Find dominant emotion
            dominant_emotion = max(emotion_counts.items(), key=lambda x: x[1])
            
            return {
                "user_id": user_id,
                "time_window": time_window,
                "total_emotions": len(recent_emotions),
                "emotion_distribution": emotion_counts,
                "dominant_emotion": dominant_emotion[0],
                "dominant_count": dominant_emotion[1],
                "average_confidence": avg_confidence,
                "average_intensity": avg_intensity,
                "trend_analysis": self._analyze_trends(recent_emotions)
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to get emotion trends: {e}")
            return {"error": str(e)}
    
    def _analyze_trends(self, emotions: List[EmotionResult]) -> Dict[str, Any]:
        """Analyze emotion trends"""
        if len(emotions) < 2:
            return {"trend": "insufficient_data"}
        
        # Calculate emotion stability
        emotion_changes = 0
        for i in range(1, len(emotions)):
            if emotions[i].emotion != emotions[i-1].emotion:
                emotion_changes += 1
        
        stability = 1.0 - (emotion_changes / (len(emotions) - 1))
        
        # Determine trend
        if stability > 0.8:
            trend = "stable"
        elif stability > 0.5:
            trend = "moderate"
        else:
            trend = "volatile"
        
        return {
            "trend": trend,
            "stability": stability,
            "emotion_changes": emotion_changes
        }
    
    async def generate_emotion_report(self, user_id: str) -> Dict[str, Any]:
        """Generate comprehensive emotion report"""
        try:
            trends = await self.get_emotion_trends(user_id)
            
            if "error" in trends:
                return trends
            
            # Get context
            context_key = f"{user_id}:*"
            user_contexts = [
                ctx for key, ctx in self.conversation_contexts.items()
                if key.startswith(f"{user_id}:")
            ]
            
            report = {
                "user_id": user_id,
                "timestamp": time.time(),
                "emotion_trends": trends,
                "active_sessions": len(user_contexts),
                "total_emotions_detected": len(self.emotion_history.get(user_id, [])),
                "recommendations": self._generate_recommendations(trends)
            }
            
            return report
            
        except Exception as e:
            logger.error(f"❌ Failed to generate emotion report: {e}")
            return {"error": str(e)}
    
    def _generate_recommendations(self, trends: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on emotion trends"""
        recommendations = []
        
        if "dominant_emotion" in trends:
            dominant = trends["dominant_emotion"]
            
            if dominant == "sad":
                recommendations.append("Consider offering emotional support")
                recommendations.append("Suggest positive activities")
            elif dominant == "angry":
                recommendations.append("Provide calming responses")
                recommendations.append("Avoid confrontational language")
            elif dominant == "excited":
                recommendations.append("Maintain enthusiasm in responses")
                recommendations.append("Encourage continued engagement")
            elif dominant == "confused":
                recommendations.append("Provide clear, simple explanations")
                recommendations.append("Offer additional clarification")
        
        if "trend_analysis" in trends:
            trend = trends["trend_analysis"]["trend"]
            
            if trend == "volatile":
                recommendations.append("Monitor emotional stability")
                recommendations.append("Provide consistent support")
            elif trend == "stable":
                recommendations.append("Maintain current approach")
                recommendations.append("Continue positive reinforcement")
        
        return recommendations

class EmotionIntegration:
    """Integration layer for emotion detection with other systems"""
    
    def __init__(self):
        self.analyzer = EmotionAnalyzer()
        self.integration_hooks = {}
    
    async def process_with_emotion(self, user_id: str, session_id: str, 
                                 input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input with emotion detection"""
        try:
            # Detect emotion
            emotion_result = await self.analyzer.analyze_emotion(
                user_id, session_id, input_data
            )
            
            # Create response with emotion context
            response = {
                "user_id": user_id,
                "session_id": session_id,
                "input_data": input_data,
                "emotion_detected": {
                    "emotion": emotion_result.emotion.value,
                    "confidence": emotion_result.confidence,
                    "intensity": emotion_result.intensity,
                    "timestamp": emotion_result.timestamp
                },
                "emotion_aware_response": self._generate_emotion_aware_response(
                    input_data, emotion_result
                ),
                "recommendations": self._get_emotion_recommendations(emotion_result)
            }
            
            logger.info(f"✅ Processed with emotion: {emotion_result.emotion.value}")
            return response
            
        except Exception as e:
            logger.error(f"❌ Emotion integration failed: {e}")
            return {"error": str(e)}
    
    def _generate_emotion_aware_response(self, input_data: Dict[str, Any], 
                                       emotion_result: EmotionResult) -> Dict[str, Any]:
        """Generate emotion-aware response"""
        emotion = emotion_result.emotion.value
        intensity = emotion_result.intensity
        
        # Base response
        response = {
            "text": "I understand your message.",
            "tone": "neutral",
            "approach": "standard"
        }
        
        # Adjust based on emotion
        if emotion == "sad":
            response["text"] = "I sense you might be feeling down. I'm here to help."
            response["tone"] = "empathetic"
            response["approach"] = "supportive"
        elif emotion == "angry":
            response["text"] = "I understand this might be frustrating. Let me help."
            response["tone"] = "calming"
            response["approach"] = "de-escalating"
        elif emotion == "excited":
            response["text"] = "Your enthusiasm is great! Let's work together."
            response["tone"] = "enthusiastic"
            response["approach"] = "encouraging"
        elif emotion == "confused":
            response["text"] = "Let me clarify this for you step by step."
            response["tone"] = "patient"
            response["approach"] = "explanatory"
        
        # Adjust intensity
        if intensity > 0.8:
            response["urgency"] = "high"
        elif intensity > 0.5:
            response["urgency"] = "medium"
        else:
            response["urgency"] = "low"
        
        return response
    
    def _get_emotion_recommendations(self, emotion_result: EmotionResult) -> List[str]:
        """Get recommendations based on detected emotion"""
        recommendations = []
        emotion = emotion_result.emotion.value
        intensity = emotion_result.intensity
        
        if emotion == "sad":
            recommendations.append("Offer emotional support")
            recommendations.append("Suggest positive activities")
            if intensity > 0.7:
                recommendations.append("Consider professional help resources")
        elif emotion == "angry":
            recommendations.append("Maintain calm communication")
            recommendations.append("Avoid confrontational language")
            if intensity > 0.7:
                recommendations.append("Provide space for cooling down")
        elif emotion == "excited":
            recommendations.append("Maintain enthusiasm")
            recommendations.append("Channel energy productively")
        elif emotion == "confused":
            recommendations.append("Provide clear explanations")
            recommendations.append("Break down complex concepts")
        
        return recommendations
    
    async def register_integration_hook(self, hook_name: str, hook_function):
        """Register integration hook for emotion detection"""
        self.integration_hooks[hook_name] = hook_function
        logger.info(f"✅ Registered emotion integration hook: {hook_name}")
    
    async def call_integration_hooks(self, emotion_result: EmotionResult, 
                                   context: Dict[str, Any]):
        """Call registered integration hooks"""
        for hook_name, hook_function in self.integration_hooks.items():
            try:
                await hook_function(emotion_result, context)
                logger.debug(f"✅ Called emotion hook: {hook_name}")
            except Exception as e:
                logger.error(f"❌ Emotion hook {hook_name} failed: {e}")

# Example usage and testing
async def main():
    """Main function for testing emotion detection"""
    integration = EmotionIntegration()
    
    # Test emotion detection
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
        }
    ]
    
    user_id = "user-001"
    session_id = "session-001"
    
    print("🧠 Testing Emotion Detection Integration...")
    
    for i, input_data in enumerate(test_inputs):
        result = await integration.process_with_emotion(user_id, session_id, input_data)
        
        print(f"\n📝 Test {i+1}:")
        print(f"  Input: {input_data['text']}")
        print(f"  Emotion: {result['emotion_detected']['emotion']}")
        print(f"  Confidence: {result['emotion_detected']['confidence']:.2f}")
        print(f"  Response: {result['emotion_aware_response']['text']}")
    
    # Test emotion trends
    analyzer = EmotionAnalyzer()
    trends = await analyzer.get_emotion_trends(user_id)
    print(f"\n📊 Emotion Trends:")
    print(f"  Dominant Emotion: {trends.get('dominant_emotion', 'N/A')}")
    print(f"  Total Emotions: {trends.get('total_emotions', 0)}")
    print(f"  Average Confidence: {trends.get('average_confidence', 0):.2f}")
    
    # Test emotion report
    report = await analyzer.generate_emotion_report(user_id)
    print(f"\n📋 Emotion Report:")
    print(f"  Active Sessions: {report.get('active_sessions', 0)}")
    print(f"  Total Emotions: {report.get('total_emotions_detected', 0)}")
    print(f"  Recommendations: {len(report.get('recommendations', []))}")

if __name__ == "__main__":
    asyncio.run(main())