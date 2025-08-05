#!/usr/bin/env python3
"""
Zynx AGI Platform - Redis Pub/Sub Implementation
Phase 2: Core Features - WebSocket Scaling
"""

import asyncio
import json
import time
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass
from enum import Enum
import redis.asyncio as redis
from loguru import logger

class MessageType(Enum):
    """Message types for WebSocket communication"""
    CHAT = "chat"
    EMOTION = "emotion"
    CONTEXT = "context"
    SYSTEM = "system"
    HEARTBEAT = "heartbeat"

@dataclass
class WebSocketMessage:
    """WebSocket message structure"""
    message_id: str
    message_type: MessageType
    user_id: str
    session_id: str
    content: Dict[str, Any]
    timestamp: float
    metadata: Optional[Dict[str, Any]] = None

class RedisPubSubManager:
    """Redis Pub/Sub manager for WebSocket scaling"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis_client = None
        self.pubsub = None
        self.channels = set()
        self.message_handlers: Dict[str, List[Callable]] = {}
        self.connection_status = False
        
    async def connect(self) -> bool:
        """Connect to Redis server"""
        try:
            self.redis_client = redis.from_url(self.redis_url)
            await self.redis_client.ping()
            self.pubsub = self.redis_client.pubsub()
            self.connection_status = True
            logger.info("✅ Connected to Redis server")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to Redis: {e}")
            self.connection_status = False
            return False
    
    async def disconnect(self):
        """Disconnect from Redis server"""
        try:
            if self.pubsub:
                await self.pubsub.close()
            if self.redis_client:
                await self.redis_client.close()
            self.connection_status = False
            logger.info("✅ Disconnected from Redis server")
        except Exception as e:
            logger.error(f"❌ Error disconnecting from Redis: {e}")
    
    async def subscribe(self, channel: str, handler: Callable) -> bool:
        """Subscribe to a Redis channel"""
        try:
            if not self.connection_status:
                await self.connect()
            
            await self.pubsub.subscribe(channel)
            self.channels.add(channel)
            
            if channel not in self.message_handlers:
                self.message_handlers[channel] = []
            self.message_handlers[channel].append(handler)
            
            logger.info(f"✅ Subscribed to channel: {channel}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to subscribe to channel {channel}: {e}")
            return False
    
    async def unsubscribe(self, channel: str) -> bool:
        """Unsubscribe from a Redis channel"""
        try:
            await self.pubsub.unsubscribe(channel)
            self.channels.discard(channel)
            self.message_handlers.pop(channel, None)
            logger.info(f"✅ Unsubscribed from channel: {channel}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to unsubscribe from channel {channel}: {e}")
            return False
    
    async def publish(self, channel: str, message: WebSocketMessage) -> bool:
        """Publish message to Redis channel"""
        try:
            if not self.connection_status:
                await self.connect()
            
            message_data = {
                "message_id": message.message_id,
                "message_type": message.message_type.value,
                "user_id": message.user_id,
                "session_id": message.session_id,
                "content": message.content,
                "timestamp": message.timestamp,
                "metadata": message.metadata or {}
            }
            
            await self.redis_client.publish(channel, json.dumps(message_data))
            logger.info(f"✅ Published message to channel: {channel}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to publish message to channel {channel}: {e}")
            return False
    
    async def listen_for_messages(self):
        """Listen for messages from subscribed channels"""
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    channel = message["channel"].decode()
                    data = json.loads(message["data"].decode())
                    
                    # Create WebSocket message
                    ws_message = WebSocketMessage(
                        message_id=data["message_id"],
                        message_type=MessageType(data["message_type"]),
                        user_id=data["user_id"],
                        session_id=data["session_id"],
                        content=data["content"],
                        timestamp=data["timestamp"],
                        metadata=data.get("metadata", {})
                    )
                    
                    # Call handlers
                    if channel in self.message_handlers:
                        for handler in self.message_handlers[channel]:
                            try:
                                await handler(ws_message)
                            except Exception as e:
                                logger.error(f"❌ Error in message handler: {e}")
                    
        except Exception as e:
            logger.error(f"❌ Error listening for messages: {e}")

class WebSocketManager:
    """WebSocket connection manager with Redis Pub/Sub"""
    
    def __init__(self, redis_manager: RedisPubSubManager):
        self.redis_manager = redis_manager
        self.active_connections: Dict[str, Any] = {}
        self.user_sessions: Dict[str, List[str]] = {}
        self.session_users: Dict[str, str] = {}
    
    async def add_connection(self, session_id: str, user_id: str, websocket: Any):
        """Add a new WebSocket connection"""
        self.active_connections[session_id] = websocket
        self.session_users[session_id] = user_id
        
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(session_id)
        
        # Subscribe to user-specific channel
        channel = f"user:{user_id}"
        await self.redis_manager.subscribe(channel, self.handle_user_message)
        
        logger.info(f"✅ Added WebSocket connection: {session_id} for user: {user_id}")
    
    async def remove_connection(self, session_id: str):
        """Remove a WebSocket connection"""
        if session_id in self.active_connections:
            user_id = self.session_users.get(session_id)
            del self.active_connections[session_id]
            del self.session_users[session_id]
            
            if user_id and user_id in self.user_sessions:
                self.user_sessions[user_id].remove(session_id)
                if not self.user_sessions[user_id]:
                    del self.user_sessions[user_id]
            
            logger.info(f"✅ Removed WebSocket connection: {session_id}")
    
    async def send_message(self, session_id: str, message: WebSocketMessage) -> bool:
        """Send message to specific WebSocket connection"""
        try:
            if session_id in self.active_connections:
                websocket = self.active_connections[session_id]
                message_data = {
                    "message_id": message.message_id,
                    "message_type": message.message_type.value,
                    "content": message.content,
                    "timestamp": message.timestamp,
                    "metadata": message.metadata or {}
                }
                
                await websocket.send_text(json.dumps(message_data))
                logger.info(f"✅ Sent message to session: {session_id}")
                return True
            else:
                logger.warning(f"⚠️ Session not found: {session_id}")
                return False
        except Exception as e:
            logger.error(f"❌ Failed to send message to session {session_id}: {e}")
            return False
    
    async def broadcast_message(self, message: WebSocketMessage, user_id: Optional[str] = None):
        """Broadcast message to all connections or specific user"""
        try:
            if user_id:
                # Send to specific user's sessions
                if user_id in self.user_sessions:
                    for session_id in self.user_sessions[user_id]:
                        await self.send_message(session_id, message)
            else:
                # Send to all active connections
                for session_id in self.active_connections:
                    await self.send_message(session_id, message)
            
            logger.info(f"✅ Broadcasted message to {len(self.active_connections)} connections")
        except Exception as e:
            logger.error(f"❌ Failed to broadcast message: {e}")
    
    async def handle_user_message(self, message: WebSocketMessage):
        """Handle incoming message from Redis"""
        try:
            # Send to user's active sessions
            if message.user_id in self.user_sessions:
                for session_id in self.user_sessions[message.user_id]:
                    await self.send_message(session_id, message)
            
            logger.info(f"✅ Handled user message: {message.message_id}")
        except Exception as e:
            logger.error(f"❌ Error handling user message: {e}")
    
    async def get_connection_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            "total_connections": len(self.active_connections),
            "total_users": len(self.user_sessions),
            "channels_subscribed": len(self.redis_manager.channels),
            "connection_status": self.redis_manager.connection_status
        }

class ChatMessageHandler:
    """Handle chat messages with Redis Pub/Sub"""
    
    def __init__(self, redis_manager: RedisPubSubManager, ws_manager: WebSocketManager):
        self.redis_manager = redis_manager
        self.ws_manager = ws_manager
        self.chat_history: Dict[str, List[Dict[str, Any]]] = {}
    
    async def handle_chat_message(self, message: WebSocketMessage):
        """Handle incoming chat message"""
        try:
            # Store in chat history
            session_id = message.session_id
            if session_id not in self.chat_history:
                self.chat_history[session_id] = []
            
            chat_entry = {
                "message_id": message.message_id,
                "user_id": message.user_id,
                "content": message.content,
                "timestamp": message.timestamp,
                "message_type": message.message_type.value
            }
            
            self.chat_history[session_id].append(chat_entry)
            
            # Publish to chat channel
            chat_channel = f"chat:{session_id}"
            await self.redis_manager.publish(chat_channel, message)
            
            # Send to all session participants
            await self.ws_manager.broadcast_message(message, message.user_id)
            
            logger.info(f"✅ Handled chat message: {message.message_id}")
        except Exception as e:
            logger.error(f"❌ Error handling chat message: {e}")
    
    async def get_chat_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        return self.chat_history.get(session_id, [])

class EmotionMessageHandler:
    """Handle emotion detection messages"""
    
    def __init__(self, redis_manager: RedisPubSubManager, ws_manager: WebSocketManager):
        self.redis_manager = redis_manager
        self.ws_manager = ws_manager
        self.emotion_history: Dict[str, List[Dict[str, Any]]] = {}
    
    async def handle_emotion_message(self, message: WebSocketMessage):
        """Handle emotion detection message"""
        try:
            # Store emotion data
            user_id = message.user_id
            if user_id not in self.emotion_history:
                self.emotion_history[user_id] = []
            
            emotion_entry = {
                "message_id": message.message_id,
                "emotion": message.content.get("emotion"),
                "confidence": message.content.get("confidence"),
                "timestamp": message.timestamp
            }
            
            self.emotion_history[user_id].append(emotion_entry)
            
            # Publish to emotion channel
            emotion_channel = f"emotion:{user_id}"
            await self.redis_manager.publish(emotion_channel, message)
            
            logger.info(f"✅ Handled emotion message: {message.message_id}")
        except Exception as e:
            logger.error(f"❌ Error handling emotion message: {e}")
    
    async def get_emotion_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get emotion history for a user"""
        return self.emotion_history.get(user_id, [])

# Example usage and testing
async def main():
    """Main function for testing Redis Pub/Sub"""
    # Initialize Redis manager
    redis_manager = RedisPubSubManager()
    
    # Connect to Redis
    if not await redis_manager.connect():
        logger.error("❌ Failed to connect to Redis")
        return
    
    # Initialize WebSocket manager
    ws_manager = WebSocketManager(redis_manager)
    
    # Initialize message handlers
    chat_handler = ChatMessageHandler(redis_manager, ws_manager)
    emotion_handler = EmotionMessageHandler(redis_manager, ws_manager)
    
    # Subscribe to channels
    await redis_manager.subscribe("chat:test", chat_handler.handle_chat_message)
    await redis_manager.subscribe("emotion:test", emotion_handler.handle_emotion_message)
    
    # Test message publishing
    test_message = WebSocketMessage(
        message_id="test-001",
        message_type=MessageType.CHAT,
        user_id="user-001",
        session_id="session-001",
        content={"text": "Hello, Zynx AGI!"},
        timestamp=time.time()
    )
    
    await redis_manager.publish("chat:test", test_message)
    
    # Start listening for messages
    logger.info("🚀 Starting Redis Pub/Sub message listener...")
    await redis_manager.listen_for_messages()

if __name__ == "__main__":
    asyncio.run(main())