#!/usr/bin/env python3
"""
Zynx AGI Platform - PDPA Policy Engine Implementation
Phase 2: Core Features - Data Protection & Compliance
"""

import asyncio
import json
import time
import hashlib
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime, timedelta
from loguru import logger

class ConsentStatus(Enum):
    """Consent status for data processing"""
    GRANTED = "granted"
    DENIED = "denied"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"
    PENDING = "pending"

class DataCategory(Enum):
    """Data categories for PDPA compliance"""
    PERSONAL = "personal"
    SENSITIVE = "sensitive"
    ANONYMIZED = "anonymized"
    PSEUDONYMIZED = "pseudonymized"
    AGGREGATED = "aggregated"

class ProcessingPurpose(Enum):
    """Data processing purposes"""
    CHAT_SERVICE = "chat_service"
    EMOTION_DETECTION = "emotion_detection"
    ANALYTICS = "analytics"
    IMPROVEMENT = "improvement"
    COMPLIANCE = "compliance"

@dataclass
class ConsentRecord:
    """Consent record for data processing"""
    consent_id: str
    user_id: str
    purpose: ProcessingPurpose
    data_categories: List[DataCategory]
    status: ConsentStatus
    granted_at: datetime
    expires_at: Optional[datetime] = None
    withdrawn_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class DataProcessingRecord:
    """Record of data processing activities"""
    processing_id: str
    user_id: str
    purpose: ProcessingPurpose
    data_categories: List[DataCategory]
    consent_id: str
    processed_at: datetime
    data_hash: str
    retention_period: timedelta
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class UserRightsRequest:
    """User rights request under PDPA"""
    request_id: str
    user_id: str
    request_type: str  # access, rectification, erasure, portability
    status: str  # pending, approved, denied, completed
    requested_at: datetime
    completed_at: Optional[datetime] = None
    details: Optional[Dict[str, Any]] = None

class PDPAPolicyEngine:
    """PDPA Policy Engine for data protection and compliance"""
    
    def __init__(self):
        self.consent_records: Dict[str, ConsentRecord] = {}
        self.processing_records: Dict[str, DataProcessingRecord] = {}
        self.user_rights_requests: Dict[str, UserRightsRequest] = {}
        self.audit_log: List[Dict[str, Any]] = []
        self.data_retention_policies: Dict[str, timedelta] = {
            ProcessingPurpose.CHAT_SERVICE: timedelta(days=30),
            ProcessingPurpose.EMOTION_DETECTION: timedelta(days=7),
            ProcessingPurpose.ANALYTICS: timedelta(days=90),
            ProcessingPurpose.IMPROVEMENT: timedelta(days=180),
            ProcessingPurpose.COMPLIANCE: timedelta(days=365)
        }
    
    def generate_id(self, prefix: str) -> str:
        """Generate unique ID for records"""
        timestamp = int(time.time() * 1000)
        random_suffix = hashlib.md5(f"{prefix}{timestamp}".encode()).hexdigest()[:8]
        return f"{prefix}-{timestamp}-{random_suffix}"
    
    async def create_consent(self, user_id: str, purpose: ProcessingPurpose, 
                           data_categories: List[DataCategory], 
                           expires_in_days: Optional[int] = None) -> ConsentRecord:
        """Create a new consent record"""
        try:
            consent_id = self.generate_id("consent")
            granted_at = datetime.now()
            expires_at = None
            
            if expires_in_days:
                expires_at = granted_at + timedelta(days=expires_in_days)
            
            consent_record = ConsentRecord(
                consent_id=consent_id,
                user_id=user_id,
                purpose=purpose,
                data_categories=data_categories,
                status=ConsentStatus.GRANTED,
                granted_at=granted_at,
                expires_at=expires_at
            )
            
            self.consent_records[consent_id] = consent_record
            
            # Log audit event
            await self.log_audit_event(
                "consent_created",
                user_id=user_id,
                consent_id=consent_id,
                purpose=purpose.value,
                data_categories=[cat.value for cat in data_categories]
            )
            
            logger.info(f"✅ Created consent: {consent_id} for user: {user_id}")
            return consent_record
            
        except Exception as e:
            logger.error(f"❌ Failed to create consent: {e}")
            raise
    
    async def withdraw_consent(self, consent_id: str) -> bool:
        """Withdraw a consent record"""
        try:
            if consent_id not in self.consent_records:
                logger.warning(f"⚠️ Consent not found: {consent_id}")
                return False
            
            consent = self.consent_records[consent_id]
            consent.status = ConsentStatus.WITHDRAWN
            consent.withdrawn_at = datetime.now()
            
            # Log audit event
            await self.log_audit_event(
                "consent_withdrawn",
                user_id=consent.user_id,
                consent_id=consent_id,
                purpose=consent.purpose.value
            )
            
            logger.info(f"✅ Withdrew consent: {consent_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to withdraw consent: {e}")
            return False
    
    async def check_consent(self, user_id: str, purpose: ProcessingPurpose) -> Tuple[bool, Optional[str]]:
        """Check if user has valid consent for processing purpose"""
        try:
            current_time = datetime.now()
            
            for consent_id, consent in self.consent_records.items():
                if (consent.user_id == user_id and 
                    consent.purpose == purpose and
                    consent.status == ConsentStatus.GRANTED):
                    
                    # Check if consent has expired
                    if consent.expires_at and current_time > consent.expires_at:
                        consent.status = ConsentStatus.EXPIRED
                        logger.warning(f"⚠️ Consent expired: {consent_id}")
                        continue
                    
                    logger.info(f"✅ Valid consent found: {consent_id}")
                    return True, consent_id
            
            logger.warning(f"⚠️ No valid consent found for user: {user_id}, purpose: {purpose.value}")
            return False, None
            
        except Exception as e:
            logger.error(f"❌ Error checking consent: {e}")
            return False, None
    
    async def record_data_processing(self, user_id: str, purpose: ProcessingPurpose,
                                   data_categories: List[DataCategory], consent_id: str,
                                   data_hash: str, metadata: Optional[Dict[str, Any]] = None) -> DataProcessingRecord:
        """Record a data processing activity"""
        try:
            processing_id = self.generate_id("processing")
            processed_at = datetime.now()
            retention_period = self.data_retention_policies.get(purpose, timedelta(days=30))
            
            processing_record = DataProcessingRecord(
                processing_id=processing_id,
                user_id=user_id,
                purpose=purpose,
                data_categories=data_categories,
                consent_id=consent_id,
                processed_at=processed_at,
                data_hash=data_hash,
                retention_period=retention_period,
                metadata=metadata
            )
            
            self.processing_records[processing_id] = processing_record
            
            # Log audit event
            await self.log_audit_event(
                "data_processed",
                user_id=user_id,
                processing_id=processing_id,
                purpose=purpose.value,
                data_categories=[cat.value for cat in data_categories]
            )
            
            logger.info(f"✅ Recorded data processing: {processing_id}")
            return processing_record
            
        except Exception as e:
            logger.error(f"❌ Failed to record data processing: {e}")
            raise
    
    async def request_user_rights(self, user_id: str, request_type: str, 
                                details: Optional[Dict[str, Any]] = None) -> UserRightsRequest:
        """Create a user rights request"""
        try:
            request_id = self.generate_id("rights")
            requested_at = datetime.now()
            
            rights_request = UserRightsRequest(
                request_id=request_id,
                user_id=user_id,
                request_type=request_type,
                status="pending",
                requested_at=requested_at,
                details=details
            )
            
            self.user_rights_requests[request_id] = rights_request
            
            # Log audit event
            await self.log_audit_event(
                "rights_requested",
                user_id=user_id,
                request_id=request_id,
                request_type=request_type
            )
            
            logger.info(f"✅ Created rights request: {request_id}")
            return rights_request
            
        except Exception as e:
            logger.error(f"❌ Failed to create rights request: {e}")
            raise
    
    async def process_user_rights_request(self, request_id: str, action: str, 
                                        details: Optional[Dict[str, Any]] = None) -> bool:
        """Process a user rights request"""
        try:
            if request_id not in self.user_rights_requests:
                logger.warning(f"⚠️ Rights request not found: {request_id}")
                return False
            
            request = self.user_rights_requests[request_id]
            request.status = action
            request.completed_at = datetime.now()
            
            if details:
                request.details = details
            
            # Log audit event
            await self.log_audit_event(
                "rights_processed",
                user_id=request.user_id,
                request_id=request_id,
                action=action
            )
            
            logger.info(f"✅ Processed rights request: {request_id} - {action}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to process rights request: {e}")
            return False
    
    async def get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Get all data associated with a user"""
        try:
            user_data = {
                "user_id": user_id,
                "consents": [],
                "processing_records": [],
                "rights_requests": []
            }
            
            # Get consent records
            for consent in self.consent_records.values():
                if consent.user_id == user_id:
                    user_data["consents"].append(asdict(consent))
            
            # Get processing records
            for record in self.processing_records.values():
                if record.user_id == user_id:
                    user_data["processing_records"].append(asdict(record))
            
            # Get rights requests
            for request in self.user_rights_requests.values():
                if request.user_id == user_id:
                    user_data["rights_requests"].append(asdict(request))
            
            logger.info(f"✅ Retrieved user data for: {user_id}")
            return user_data
            
        except Exception as e:
            logger.error(f"❌ Failed to get user data: {e}")
            return {"error": str(e)}
    
    async def delete_user_data(self, user_id: str) -> bool:
        """Delete all data associated with a user (right to erasure)"""
        try:
            deleted_count = 0
            
            # Delete consent records
            consent_ids_to_delete = [
                consent_id for consent_id, consent in self.consent_records.items()
                if consent.user_id == user_id
            ]
            for consent_id in consent_ids_to_delete:
                del self.consent_records[consent_id]
                deleted_count += 1
            
            # Delete processing records
            processing_ids_to_delete = [
                processing_id for processing_id, record in self.processing_records.items()
                if record.user_id == user_id
            ]
            for processing_id in processing_ids_to_delete:
                del self.processing_records[processing_id]
                deleted_count += 1
            
            # Delete rights requests
            request_ids_to_delete = [
                request_id for request_id, request in self.user_rights_requests.items()
                if request.user_id == user_id
            ]
            for request_id in request_ids_to_delete:
                del self.user_rights_requests[request_id]
                deleted_count += 1
            
            # Log audit event
            await self.log_audit_event(
                "data_deleted",
                user_id=user_id,
                deleted_count=deleted_count
            )
            
            logger.info(f"✅ Deleted {deleted_count} records for user: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to delete user data: {e}")
            return False
    
    async def cleanup_expired_data(self) -> Dict[str, int]:
        """Clean up expired data based on retention policies"""
        try:
            current_time = datetime.now()
            cleanup_stats = {
                "expired_consents": 0,
                "expired_processing_records": 0
            }
            
            # Clean up expired consents
            consent_ids_to_delete = []
            for consent_id, consent in self.consent_records.items():
                if (consent.expires_at and current_time > consent.expires_at and
                    consent.status == ConsentStatus.GRANTED):
                    consent.status = ConsentStatus.EXPIRED
                    consent_ids_to_delete.append(consent_id)
                    cleanup_stats["expired_consents"] += 1
            
            # Clean up expired processing records
            processing_ids_to_delete = []
            for processing_id, record in self.processing_records.items():
                expiry_date = record.processed_at + record.retention_period
                if current_time > expiry_date:
                    processing_ids_to_delete.append(processing_id)
                    cleanup_stats["expired_processing_records"] += 1
            
            # Perform deletions
            for consent_id in consent_ids_to_delete:
                del self.consent_records[consent_id]
            
            for processing_id in processing_ids_to_delete:
                del self.processing_records[processing_id]
            
            # Log audit event
            await self.log_audit_event(
                "data_cleanup",
                expired_consents=cleanup_stats["expired_consents"],
                expired_processing_records=cleanup_stats["expired_processing_records"]
            )
            
            logger.info(f"✅ Cleaned up expired data: {cleanup_stats}")
            return cleanup_stats
            
        except Exception as e:
            logger.error(f"❌ Failed to cleanup expired data: {e}")
            return {"error": str(e)}
    
    async def log_audit_event(self, event_type: str, **kwargs):
        """Log an audit event"""
        try:
            audit_entry = {
                "event_id": self.generate_id("audit"),
                "event_type": event_type,
                "timestamp": datetime.now().isoformat(),
                "details": kwargs
            }
            
            self.audit_log.append(audit_entry)
            
            # Keep only last 1000 audit entries
            if len(self.audit_log) > 1000:
                self.audit_log = self.audit_log[-1000:]
            
            logger.debug(f"📝 Audit log: {event_type} - {kwargs}")
            
        except Exception as e:
            logger.error(f"❌ Failed to log audit event: {e}")
    
    async def get_audit_log(self, user_id: Optional[str] = None, 
                           event_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get audit log entries with optional filtering"""
        try:
            filtered_log = self.audit_log
            
            if user_id:
                filtered_log = [
                    entry for entry in filtered_log
                    if entry["details"].get("user_id") == user_id
                ]
            
            if event_type:
                filtered_log = [
                    entry for entry in filtered_log
                    if entry["event_type"] == event_type
                ]
            
            return filtered_log
            
        except Exception as e:
            logger.error(f"❌ Failed to get audit log: {e}")
            return []
    
    async def get_compliance_report(self) -> Dict[str, Any]:
        """Generate PDPA compliance report"""
        try:
            current_time = datetime.now()
            
            # Count active consents
            active_consents = sum(
                1 for consent in self.consent_records.values()
                if consent.status == ConsentStatus.GRANTED and
                (not consent.expires_at or current_time <= consent.expires_at)
            )
            
            # Count expired consents
            expired_consents = sum(
                1 for consent in self.consent_records.values()
                if consent.status == ConsentStatus.EXPIRED
            )
            
            # Count processing records
            total_processing = len(self.processing_records)
            
            # Count pending rights requests
            pending_requests = sum(
                1 for request in self.user_rights_requests.values()
                if request.status == "pending"
            )
            
            report = {
                "timestamp": current_time.isoformat(),
                "compliance_metrics": {
                    "active_consents": active_consents,
                    "expired_consents": expired_consents,
                    "total_processing_records": total_processing,
                    "pending_rights_requests": pending_requests,
                    "total_audit_entries": len(self.audit_log)
                },
                "retention_policies": {
                    purpose.value: str(policy) 
                    for purpose, policy in self.data_retention_policies.items()
                }
            }
            
            logger.info(f"✅ Generated compliance report")
            return report
            
        except Exception as e:
            logger.error(f"❌ Failed to generate compliance report: {e}")
            return {"error": str(e)}

# Example usage and testing
async def main():
    """Main function for testing PDPA Policy Engine"""
    engine = PDPAPolicyEngine()
    
    # Test consent creation
    user_id = "user-001"
    consent = await engine.create_consent(
        user_id=user_id,
        purpose=ProcessingPurpose.CHAT_SERVICE,
        data_categories=[DataCategory.PERSONAL, DataCategory.SENSITIVE],
        expires_in_days=30
    )
    
    print(f"✅ Created consent: {consent.consent_id}")
    
    # Test consent checking
    has_consent, consent_id = await engine.check_consent(user_id, ProcessingPurpose.CHAT_SERVICE)
    print(f"✅ Has consent: {has_consent}, Consent ID: {consent_id}")
    
    # Test data processing recording
    processing_record = await engine.record_data_processing(
        user_id=user_id,
        purpose=ProcessingPurpose.CHAT_SERVICE,
        data_categories=[DataCategory.PERSONAL],
        consent_id=consent.consent_id,
        data_hash="hash-123"
    )
    
    print(f"✅ Recorded processing: {processing_record.processing_id}")
    
    # Test user rights request
    rights_request = await engine.request_user_rights(
        user_id=user_id,
        request_type="access",
        details={"reason": "Data access request"}
    )
    
    print(f"✅ Created rights request: {rights_request.request_id}")
    
    # Test user data retrieval
    user_data = await engine.get_user_data(user_id)
    print(f"✅ Retrieved user data: {len(user_data['consents'])} consents, {len(user_data['processing_records'])} processing records")
    
    # Test compliance report
    compliance_report = await engine.get_compliance_report()
    print(f"✅ Compliance report: {compliance_report['compliance_metrics']}")
    
    # Test data cleanup
    cleanup_stats = await engine.cleanup_expired_data()
    print(f"✅ Data cleanup: {cleanup_stats}")

if __name__ == "__main__":
    asyncio.run(main())