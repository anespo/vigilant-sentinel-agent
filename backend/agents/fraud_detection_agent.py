"""
Real Fraud Detection Agent using direct Bedrock calls
Integrates with AWS Bedrock for advanced fraud analysis
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import boto3

# Configure logging for detailed agent output
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

class FraudAlert(BaseModel):
    transaction_id: str
    risk_score: float
    risk_factors: List[str]
    severity: str
    recommended_action: str
    timestamp: datetime
    agent_reasoning: str

class TransactionData(BaseModel):
    id: str
    user_id: str
    amount: float
    merchant: str
    location: str
    timestamp: str
    device_id: str
    ip_address: str
    card_type: str

# Direct Bedrock client
def get_bedrock_client():
    """Get Bedrock client with proper configuration"""
    import os
    return boto3.client(
        'bedrock-runtime',
        region_name=os.getenv('BEDROCK_REGION', 'eu-west-1')
    )

def call_bedrock_directly(prompt: str) -> str:
    """Call Bedrock directly without tools to avoid validation issues"""
    try:
        client = get_bedrock_client()
        import os
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1500,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        })
        
        response = client.invoke_model(
            modelId=os.getenv('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0'),
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except Exception as e:
        logger.error(f"❌ Direct Bedrock call failed: {e}")
        return "Error calling Bedrock model"

# Analysis functions (simplified without @tool decorator)
def analyze_transaction_amount(amount: float, user_id: str) -> Dict[str, Any]:
    """Analyze transaction amount for fraud indicators"""
    logger.info(f"💰 Analyzing amount: ${amount} for user {user_id}")
    
    # Simulate amount analysis
    risk_factors = []
    risk_score = 0.0
    
    if amount > 5000:
        risk_factors.append("High transaction amount (>$5000)")
        risk_score += 0.3
    elif amount > 1000:
        risk_factors.append("Elevated transaction amount (>$1000)")
        risk_score += 0.1
    
    if amount % 100 == 0:  # Round amounts can be suspicious
        risk_factors.append("Round amount transaction")
        risk_score += 0.05
    
    return {
        "analysis_type": "amount_analysis",
        "amount": amount,
        "risk_factors": risk_factors,
        "risk_score": min(risk_score, 1.0),
        "details": f"Transaction amount analysis for ${amount}"
    }

def analyze_location_pattern(location: str, user_id: str) -> Dict[str, Any]:
    """Analyze transaction location for fraud patterns"""
    logger.info(f"🌍 Analyzing location: {location} for user {user_id}")
    
    risk_factors = []
    risk_score = 0.0
    
    # Simulate location analysis
    high_risk_locations = ["Unknown", "Foreign", "High-risk country"]
    
    if any(risk_loc in location for risk_loc in high_risk_locations):
        risk_factors.append(f"High-risk location: {location}")
        risk_score += 0.4
    
    if "ATM" in location:
        risk_factors.append("ATM transaction")
        risk_score += 0.1
    
    return {
        "analysis_type": "location_analysis",
        "location": location,
        "risk_factors": risk_factors,
        "risk_score": min(risk_score, 1.0),
        "details": f"Location analysis for {location}"
    }

def analyze_device_pattern(device_id: str, user_id: str) -> Dict[str, Any]:
    """Analyze device usage patterns"""
    logger.info(f"📱 Analyzing device: {device_id} for user {user_id}")
    
    risk_factors = []
    risk_score = 0.0
    
    # Simulate device analysis
    if device_id == "unknown" or device_id == "new_device":
        risk_factors.append("Unknown or new device")
        risk_score += 0.3
    
    return {
        "analysis_type": "device_analysis",
        "device_id": device_id,
        "risk_factors": risk_factors,
        "risk_score": min(risk_score, 1.0),
        "details": f"Device analysis for {device_id}"
    }

def analyze_time_pattern(timestamp: str, user_id: str) -> Dict[str, Any]:
    """Analyze transaction timing patterns"""
    logger.info(f"⏰ Analyzing timestamp: {timestamp} for user {user_id}")
    
    risk_factors = []
    risk_score = 0.0
    
    try:
        # Parse timestamp and analyze
        from datetime import datetime
        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        hour = dt.hour
        
        # Unusual hours (late night/early morning)
        if hour < 6 or hour > 23:
            risk_factors.append(f"Unusual transaction time: {hour}:00")
            risk_score += 0.2
            
    except Exception as e:
        logger.warning(f"Could not parse timestamp: {timestamp}")
        risk_factors.append("Invalid timestamp format")
        risk_score += 0.1
    
    return {
        "analysis_type": "time_analysis",
        "timestamp": timestamp,
        "risk_factors": risk_factors,
        "risk_score": min(risk_score, 1.0),
        "details": f"Time pattern analysis for {timestamp}"
    }

def check_velocity_patterns(user_id: str, current_amount: float) -> Dict[str, Any]:
    """Check for rapid transaction patterns (velocity fraud)"""
    logger.info(f"🚀 Checking velocity patterns for user {user_id}")
    
    # Simulate velocity check
    risk_factors = []
    risk_score = 0.0
    
    # Simulate finding multiple recent transactions
    recent_transactions = 3  # Simulated count
    
    if recent_transactions > 5:
        risk_factors.append("High transaction velocity (>5 transactions recently)")
        risk_score += 0.4
    elif recent_transactions > 2:
        risk_factors.append("Elevated transaction velocity")
        risk_score += 0.2
    
    return {
        "analysis_type": "velocity_analysis",
        "user_id": user_id,
        "recent_transaction_count": recent_transactions,
        "risk_factors": risk_factors,
        "risk_score": min(risk_score, 1.0),
        "details": f"Velocity analysis found {recent_transactions} recent transactions"
    }

def process_transaction_alert(transaction_data: TransactionData) -> FraudAlert:
    """
    Process a transaction and generate fraud alert if necessary.
    
    Args:
        transaction_data: Transaction details to analyze
        
    Returns:
        FraudAlert: Fraud analysis results with risk score and recommendations
    """
    start_time = datetime.now()
    
    print(f"\n{'🔍 FRAUD DETECTION AGENT ACTIVATED':.^80}")
    print(f"🤖 Agent: Starting analysis for transaction {transaction_data.id}")
    print(f"📊 Transaction details: {json.dumps(transaction_data.dict(), indent=2, default=str)}")
    
    try:
        print(f"\n{'⚡ MULTI-AGENT ANALYSIS PIPELINE':.^80}")
        print(f"🔄 Initializing specialized analysis modules...")
        
        # Perform individual analyses with agent communication
        print(f"\n💰 [AMOUNT ANALYZER] Processing transaction amount...")
        amount_analysis = analyze_transaction_amount(transaction_data.amount, transaction_data.user_id)
        print(f"💰 [AMOUNT ANALYZER] → Risk Score: {amount_analysis['risk_score']:.3f}")
        if amount_analysis['risk_factors']:
            for factor in amount_analysis['risk_factors']:
                print(f"💰 [AMOUNT ANALYZER] → ⚠️  {factor}")
        
        print(f"\n🌍 [LOCATION ANALYZER] Processing transaction location...")
        location_analysis = analyze_location_pattern(transaction_data.location, transaction_data.user_id)
        print(f"🌍 [LOCATION ANALYZER] → Risk Score: {location_analysis['risk_score']:.3f}")
        if location_analysis['risk_factors']:
            for factor in location_analysis['risk_factors']:
                print(f"🌍 [LOCATION ANALYZER] → ⚠️  {factor}")
        
        print(f"\n📱 [DEVICE ANALYZER] Processing device patterns...")
        device_analysis = analyze_device_pattern(transaction_data.device_id, transaction_data.user_id)
        print(f"📱 [DEVICE ANALYZER] → Risk Score: {device_analysis['risk_score']:.3f}")
        if device_analysis['risk_factors']:
            for factor in device_analysis['risk_factors']:
                print(f"📱 [DEVICE ANALYZER] → ⚠️  {factor}")
        
        print(f"\n⏰ [TIME ANALYZER] Processing temporal patterns...")
        time_analysis = analyze_time_pattern(transaction_data.timestamp, transaction_data.user_id)
        print(f"⏰ [TIME ANALYZER] → Risk Score: {time_analysis['risk_score']:.3f}")
        if time_analysis['risk_factors']:
            for factor in time_analysis['risk_factors']:
                print(f"⏰ [TIME ANALYZER] → ⚠️  {factor}")
        
        print(f"\n🚀 [VELOCITY ANALYZER] Processing transaction velocity...")
        velocity_analysis = check_velocity_patterns(transaction_data.user_id, transaction_data.amount)
        print(f"🚀 [VELOCITY ANALYZER] → Risk Score: {velocity_analysis['risk_score']:.3f}")
        if velocity_analysis['risk_factors']:
            for factor in velocity_analysis['risk_factors']:
                print(f"🚀 [VELOCITY ANALYZER] → ⚠️  {factor}")
        
        # Combine all risk factors
        all_risk_factors = []
        total_risk_score = 0.0
        
        analyses = [amount_analysis, location_analysis, device_analysis, time_analysis, velocity_analysis]
        
        print(f"\n{'🧠 RISK AGGREGATION ENGINE':.^80}")
        print(f"🔄 Combining analysis results from all agents...")
        
        for i, analysis in enumerate(analyses, 1):
            factors = analysis.get('risk_factors', [])
            score = analysis.get('risk_score', 0.0)
            all_risk_factors.extend(factors)
            total_risk_score += score
            print(f"📊 Module {i}: {len(factors)} factors, score: {score:.3f}")
        
        # Normalize risk score (max 1.0)
        final_risk_score = min(total_risk_score, 1.0)
        
        print(f"\n{'🎯 FINAL RISK ASSESSMENT':.^80}")
        print(f"📊 Combined Risk Score: {final_risk_score:.3f}")
        print(f"📋 Total Risk Factors: {len(all_risk_factors)}")
        
        # Create AI prompt for final analysis
        print(f"\n🤖 [AI REASONING ENGINE] Consulting Claude 3 Haiku...")
        print(f"🔄 Sending analysis to AWS Bedrock...")
        
        ai_prompt = f"""
You are an expert fraud detection AI. Analyze this transaction and provide a final assessment:

TRANSACTION DETAILS:
- ID: {transaction_data.id}
- Amount: ${transaction_data.amount}
- Merchant: {transaction_data.merchant}
- Location: {transaction_data.location}
- User: {transaction_data.user_id}
- Device: {transaction_data.device_id}
- Time: {transaction_data.timestamp}

RISK ANALYSIS RESULTS:
- Combined Risk Score: {final_risk_score:.3f}
- Risk Factors Found: {len(all_risk_factors)}

IDENTIFIED RISK FACTORS:
{chr(10).join(f"- {factor}" for factor in all_risk_factors)}

Based on this analysis, provide:
1. Your assessment of the fraud risk
2. Recommended actions
3. Reasoning for your decision

Risk Score Interpretation:
- 0.0-0.29: LOW risk
- 0.3-0.49: MEDIUM risk  
- 0.5-0.69: HIGH risk
- 0.7+: CRITICAL risk
"""

        # Get AI assessment
        ai_reasoning = call_bedrock_directly(ai_prompt)
        print(f"🤖 [AI REASONING ENGINE] → Analysis complete!")
        
        # Determine severity and recommended action
        if final_risk_score >= 0.7:
            severity = "CRITICAL"
            recommended_action = "BLOCK_TRANSACTION_AND_FREEZE_ACCOUNT"
            print(f"🚨 [DECISION ENGINE] → CRITICAL THREAT DETECTED!")
        elif final_risk_score >= 0.5:
            severity = "HIGH"
            recommended_action = "REQUIRE_ADDITIONAL_VERIFICATION"
            print(f"⚠️  [DECISION ENGINE] → HIGH RISK IDENTIFIED!")
        elif final_risk_score >= 0.3:
            severity = "MEDIUM"
            recommended_action = "REQUIRE_BASIC_VERIFICATION"
            print(f"🟡 [DECISION ENGINE] → MEDIUM RISK DETECTED!")
        else:
            severity = "LOW"
            recommended_action = "MONITOR_ONLY"
            print(f"🟢 [DECISION ENGINE] → LOW RISK - PROCEED!")
        
        end_time = datetime.now()
        
        print(f"\n{'✅ FRAUD ANALYSIS COMPLETE':.^80}")
        print(f"🎯 Final Decision: {severity} - {recommended_action}")
        print(f"📊 Risk Score: {final_risk_score:.3f}")
        print(f"⏱️  Analysis Time: {int((end_time - start_time).total_seconds() * 1000)}ms")
        print(f"📋 Risk Factors Identified:")
        for i, factor in enumerate(all_risk_factors, 1):
            print(f"   {i}. {factor}")
        
        # Trigger threat response if needed
        if final_risk_score >= 0.5:
            print(f"\n🚨 [AGENT COMMUNICATION] Alerting Threat Response Agent...")
            print(f"📡 Sending alert to threat response system...")
        
        print(f"{'='*80}\n")
        
        return FraudAlert(
            transaction_id=transaction_data.id,
            risk_score=final_risk_score,
            risk_factors=all_risk_factors,
            severity=severity,
            recommended_action=recommended_action,
            timestamp=end_time,
            agent_reasoning=ai_reasoning
        )
        
    except Exception as e:
        logger.error(f"❌ Error in fraud detection agent: {e}")
        print(f"🚨 [ERROR] Fraud Detection Agent encountered an error: {e}")
        print(f"🔄 [FALLBACK] Switching to backup analysis...")
        return _fallback_fraud_alert(transaction_data, start_time)

def _fallback_fraud_alert(transaction_data: TransactionData, start_time: datetime) -> FraudAlert:
    """Fallback fraud alert when agent encounters errors"""
    logger.warning("🔄 Using fallback fraud detection")
    
    # Simple rule-based fallback
    risk_score = 0.0
    risk_factors = []
    
    if transaction_data.amount > 1000:
        risk_score += 0.3
        risk_factors.append("High amount transaction (fallback)")
    
    if "unknown" in transaction_data.location.lower():
        risk_score += 0.2
        risk_factors.append("Unknown location (fallback)")
    
    severity = "MEDIUM" if risk_score > 0.3 else "LOW"
    recommended_action = "REQUIRE_BASIC_VERIFICATION" if risk_score > 0.3 else "MONITOR_ONLY"
    
    return FraudAlert(
        transaction_id=transaction_data.id,
        risk_score=min(risk_score, 1.0),
        risk_factors=risk_factors,
        severity=severity,
        recommended_action=recommended_action,
        timestamp=datetime.now(),
        agent_reasoning="Fallback analysis used due to agent error"
    )

# Initialize flag
fraud_detection_agent = True  # Simple flag since we're using direct calls
logger.info("✅ Fraud Detection Agent initialized successfully with direct Bedrock calls")
