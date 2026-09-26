"""
Real Threat Response Agent using direct Bedrock calls
Executes automated responses to fraud threats
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import boto3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

class ThreatResponse(BaseModel):
    alert_id: str
    actions_taken: List[str]
    status: str
    timestamp: datetime
    response_time_ms: int
    agent_reasoning: str

# Direct Bedrock client for simpler interaction
def get_bedrock_client():
    """Get Bedrock client with proper configuration"""
    import os
    return boto3.client(
        'bedrock-runtime',
        region_name=settings.bedrock_region
    )

def call_bedrock_directly(prompt: str) -> str:
    """Call Bedrock directly without tools to avoid validation issues"""
    try:
        client = get_bedrock_client()
        import os
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        })
        
        response = client.invoke_model(
            modelId=settings.bedrock_model_id,
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except Exception as e:
        logger.error(f"❌ Direct Bedrock call failed: {e}")
        return "Error calling Bedrock model"

# Threat response functions (simplified without @tool decorator)
def block_transaction(transaction_id: str, reason: str) -> Dict[str, Any]:
    """Block a suspicious transaction immediately."""
    logger.info(f"🚫 BLOCKING TRANSACTION: {transaction_id}")
    logger.info(f"📝 Reason: {reason}")
    
    print(f"🚫 EMERGENCY BLOCK: Transaction {transaction_id} has been BLOCKED")
    print(f"📝 Reason: {reason}")
    print(f"⏰ Block executed at: {datetime.now().isoformat()}")
    
    return {
        "action": "block_transaction",
        "transaction_id": transaction_id,
        "status": "blocked",
        "reason": reason,
        "timestamp": datetime.now().isoformat()
    }

def freeze_account(user_id: str, duration_hours: int, reason: str) -> Dict[str, Any]:
    """Temporarily freeze a user account."""
    logger.warning(f"🧊 FREEZING ACCOUNT: {user_id} for {duration_hours} hours")
    logger.info(f"📝 Reason: {reason}")
    
    print(f"🧊 ACCOUNT FREEZE: User {user_id} account has been FROZEN")
    print(f"⏱️ Duration: {duration_hours} hours")
    print(f"📝 Reason: {reason}")
    print(f"⏰ Freeze executed at: {datetime.now().isoformat()}")
    
    return {
        "action": "freeze_account",
        "user_id": user_id,
        "status": "frozen",
        "duration_hours": duration_hours,
        "reason": reason,
        "timestamp": datetime.now().isoformat()
    }

def send_fraud_alert(user_id: str, alert_type: str, message: str) -> Dict[str, Any]:
    """Send fraud alert notification to the user."""
    logger.info(f"📱 SENDING ALERT: {alert_type} to user {user_id}")
    
    print(f"📱 FRAUD ALERT SENT: {alert_type} notification to user {user_id}")
    print(f"💬 Message: {message}")
    print(f"⏰ Alert sent at: {datetime.now().isoformat()}")
    
    return {
        "action": "send_fraud_alert",
        "user_id": user_id,
        "alert_type": alert_type,
        "message": message,
        "status": "sent",
        "timestamp": datetime.now().isoformat()
    }

def require_verification(user_id: str, verification_type: str, reason: str) -> Dict[str, Any]:
    """Require additional verification from user."""
    logger.info(f"🔐 REQUIRING VERIFICATION: {verification_type} for user {user_id}")
    
    print(f"🔐 VERIFICATION REQUIRED: {verification_type} for user {user_id}")
    print(f"📝 Reason: {reason}")
    print(f"⏰ Verification requested at: {datetime.now().isoformat()}")
    
    return {
        "action": "require_verification",
        "user_id": user_id,
        "verification_type": verification_type,
        "reason": reason,
        "status": "pending",
        "timestamp": datetime.now().isoformat()
    }

def log_security_event(event_type: str, severity: str, details: Dict[str, Any]) -> Dict[str, Any]:
    """Log security event for audit and monitoring."""
    logger.info(f"📋 LOGGING EVENT: {event_type} - {severity}")
    
    print(f"📋 SECURITY EVENT LOGGED: {event_type}")
    print(f"🚨 Severity: {severity}")
    print(f"📊 Details: {json.dumps(details, indent=2, default=str)}")
    print(f"⏰ Event logged at: {datetime.now().isoformat()}")
    
    return {
        "action": "log_security_event",
        "event_type": event_type,
        "severity": severity,
        "details": details,
        "status": "logged",
        "timestamp": datetime.now().isoformat()
    }

def execute_threat_response(alert_id: str, fraud_alert: Dict[str, Any]) -> ThreatResponse:
    """
    Execute automated threat response based on fraud alert.
    
    Args:
        alert_id (str): Unique identifier for the alert
        fraud_alert (Dict[str, Any]): Fraud alert data containing risk score and details
        
    Returns:
        ThreatResponse: Response with actions taken and details
    """
    start_time = datetime.now()
    
    print(f"\n{'🛡️ THREAT RESPONSE AGENT ACTIVATED':.^80}")
    print(f"🤖 Agent: Received alert {alert_id} from Fraud Detection Agent")
    print(f"📊 Alert details: {json.dumps(fraud_alert, indent=2, default=str)}")
    
    try:
        # Extract key information
        risk_score = fraud_alert.get('risk_score', 0.0)
        transaction_id = fraud_alert.get('transaction_id', 'unknown')
        user_id = fraud_alert.get('user_id', 'unknown')
        risk_factors = fraud_alert.get('risk_factors', [])
        severity = fraud_alert.get('severity', 'UNKNOWN')
        
        print(f"\n{'⚡ THREAT ASSESSMENT':.^80}")
        print(f"🎯 Alert ID: {alert_id}")
        print(f"📊 Risk Score: {risk_score}")
        print(f"🚨 Severity Level: {severity}")
        print(f"💳 Transaction ID: {transaction_id}")
        print(f"👤 User ID: {user_id}")
        print(f"📋 Risk Factors: {len(risk_factors)}")
        
        # Create prompt for AI decision making
        print(f"\n🤖 [AI DECISION ENGINE] Consulting Claude 3 Haiku for response strategy...")
        
        response_prompt = f"""
You are a threat response AI agent. Analyze this fraud alert and decide what actions to take:

ALERT ID: {alert_id}
RISK SCORE: {risk_score}
TRANSACTION ID: {transaction_id}
USER ID: {user_id}
RISK FACTORS: {', '.join(risk_factors)}

RESPONSE PROTOCOLS:
- CRITICAL (0.7+): Block transaction, freeze account, send alert
- HIGH (0.5-0.69): Require verification, send alert
- MEDIUM (0.3-0.49): Require basic verification, send notification
- LOW (0.0-0.29): Log event only

Based on the risk score of {risk_score}, what specific actions should be taken? 
Respond with a clear action plan including which functions to call and why.
"""

        # Get AI response
        print(f"🔄 Sending threat analysis to AWS Bedrock...")
        ai_response = call_bedrock_directly(response_prompt)
        print(f"🤖 [AI DECISION ENGINE] → Response strategy determined!")
        
        # Execute actions based on risk score
        actions_taken = []
        
        print(f"\n{'🚀 AUTOMATED RESPONSE EXECUTION':.^80}")
        
        if risk_score >= 0.7:
            print(f"🚨 [CRITICAL PROTOCOL] Executing maximum security response...")
            
            # CRITICAL - Block and freeze
            print(f"🚫 [ACTION 1/4] Blocking transaction...")
            block_result = block_transaction(transaction_id, f"Critical fraud risk: {risk_score}")
            actions_taken.append(f"Blocked transaction {transaction_id}")
            
            print(f"🧊 [ACTION 2/4] Freezing user account...")
            freeze_result = freeze_account(user_id, 24, f"Critical fraud alert: {alert_id}")
            actions_taken.append(f"Froze account {user_id} for 24 hours")
            
            print(f"📱 [ACTION 3/4] Sending urgent fraud alert...")
            alert_result = send_fraud_alert(user_id, "SMS", f"URGENT: Suspicious activity detected. Account temporarily secured.")
            actions_taken.append(f"Sent urgent fraud alert to {user_id}")
            
            print(f"📋 [ACTION 4/4] Logging critical security event...")
            log_result = log_security_event("CRITICAL_FRAUD", "HIGH", fraud_alert)
            actions_taken.append("Logged critical security event")
            
        elif risk_score >= 0.5:
            print(f"⚠️  [HIGH RISK PROTOCOL] Executing enhanced verification response...")
            
            # HIGH - Require verification
            print(f"🔐 [ACTION 1/3] Requiring 2FA verification...")
            verify_result = require_verification(user_id, "2FA", f"High fraud risk: {risk_score}")
            actions_taken.append(f"Required 2FA verification for {user_id}")
            
            print(f"📧 [ACTION 2/3] Sending security alert...")
            alert_result = send_fraud_alert(user_id, "EMAIL", f"Security verification required for recent transaction.")
            actions_taken.append(f"Sent security alert to {user_id}")
            
            print(f"📋 [ACTION 3/3] Logging high-risk security event...")
            log_result = log_security_event("HIGH_FRAUD", "MEDIUM", fraud_alert)
            actions_taken.append("Logged high-risk security event")
            
        elif risk_score >= 0.3:
            print(f"🟡 [MEDIUM RISK PROTOCOL] Executing standard verification response...")
            
            # MEDIUM - Basic verification
            print(f"📱 [ACTION 1/2] Requiring SMS verification...")
            verify_result = require_verification(user_id, "SMS_CODE", f"Medium fraud risk: {risk_score}")
            actions_taken.append(f"Required SMS verification for {user_id}")
            
            print(f"📋 [ACTION 2/2] Logging medium-risk security event...")
            log_result = log_security_event("MEDIUM_FRAUD", "LOW", fraud_alert)
            actions_taken.append("Logged medium-risk security event")
            
        else:
            print(f"🟢 [LOW RISK PROTOCOL] Executing monitoring response...")
            
            # LOW - Log only
            print(f"📋 [ACTION 1/1] Logging low-risk security event...")
            log_result = log_security_event("LOW_FRAUD", "INFO", fraud_alert)
            actions_taken.append("Logged low-risk security event")
        
        end_time = datetime.now()
        response_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        print(f"\n{'✅ THREAT RESPONSE COMPLETE':.^80}")
        print(f"⏱️  Response Time: {response_time_ms}ms")
        print(f"🎯 Actions Executed: {len(actions_taken)}")
        for i, action in enumerate(actions_taken, 1):
            print(f"   {i}. {action}")
        
        # Communicate with Case Manager if needed
        if risk_score >= 0.7:
            print(f"\n🤖 [AGENT COMMUNICATION] Notifying Case Manager Agent...")
            print(f"📡 Escalating to human investigation team...")
        
        print(f"{'='*80}\n")
        
        return ThreatResponse(
            alert_id=alert_id,
            actions_taken=actions_taken,
            status="completed",
            timestamp=end_time,
            response_time_ms=response_time_ms,
            agent_reasoning=ai_response
        )
        
    except Exception as e:
        logger.error(f"❌ Error in threat response agent: {e}")
        print(f"🚨 [ERROR] Threat Response Agent encountered an error: {e}")
        print(f"🔄 [FALLBACK] Switching to backup response protocol...")
        return _fallback_response(alert_id, fraud_alert, start_time)

def _fallback_response(alert_id: str, fraud_alert: Dict[str, Any], start_time: datetime) -> ThreatResponse:
    """Fallback response when agent encounters errors"""
    logger.warning("🔄 Using fallback threat response")
    
    end_time = datetime.now()
    response_time_ms = int((end_time - start_time).total_seconds() * 1000)
    
    # Basic fallback actions
    actions_taken = ["Logged security event (fallback mode)"]
    
    # Log the event at minimum
    try:
        log_security_event("FALLBACK_RESPONSE", "INFO", fraud_alert)
    except Exception as e:
        logger.error(f"❌ Even fallback logging failed: {e}")
    
    return ThreatResponse(
        alert_id=alert_id,
        actions_taken=actions_taken,
        status="fallback_completed",
        timestamp=end_time,
        response_time_ms=response_time_ms,
        agent_reasoning="Fallback response used due to agent error"
    )

# Initialize flag
threat_response_agent = True  # Simple flag since we're using direct calls
logger.info("✅ Threat Response Agent initialized successfully with direct Bedrock calls")
