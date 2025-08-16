"""
Mock Case Manager Agent for Vigilant Sentinel
Simulates case investigation assistance
"""

import json
import random
from datetime import datetime
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

# Mock Strands Agent implementation
class MockCaseManagerAgent:
    def __init__(self):
        self.investigation_templates = {
            "transaction_analysis": [
                "Transaction pattern analysis completed",
                "Historical data reviewed",
                "Similar cases identified",
                "Risk assessment updated"
            ],
            "user_profile": [
                "User behavior profile analyzed",
                "Account history reviewed",
                "Previous fraud incidents checked",
                "Risk profile updated"
            ],
            "evidence_collection": [
                "Transaction logs collected",
                "Device fingerprints analyzed",
                "IP geolocation verified",
                "Evidence package prepared"
            ]
        }
    
    def investigate_case(self, case_id: str, request_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Investigate a fraud case and provide assistance"""
        
        investigation_steps = self.investigation_templates.get(
            request_type, 
            ["General investigation completed", "Case reviewed"]
        )
        
        # Add some randomness for demonstration
        additional_steps = [
            "Cross-referenced with fraud database",
            "Machine learning insights generated",
            "Regulatory compliance checked",
            "Documentation updated"
        ]
        
        if random.random() > 0.5:
            investigation_steps.extend(random.sample(additional_steps, 2))
        
        recommendations = []
        
        # Generate recommendations based on request type
        if request_type == "transaction_analysis":
            recommendations = [
                "Monitor user for 30 days",
                "Implement additional verification",
                "Update fraud detection rules"
            ]
        elif request_type == "user_profile":
            recommendations = [
                "Review account security settings",
                "Educate user about fraud prevention",
                "Consider account restrictions"
            ]
        elif request_type == "evidence_collection":
            recommendations = [
                "Prepare case for legal review",
                "Document all evidence",
                "Coordinate with law enforcement if needed"
            ]
        else:
            recommendations = [
                "Continue monitoring",
                "Follow standard procedures",
                "Escalate if necessary"
            ]
        
        return {
            "case_id": case_id,
            "investigation_type": request_type,
            "steps_completed": investigation_steps,
            "recommendations": recommendations,
            "confidence_score": random.uniform(0.7, 0.95),
            "estimated_completion_time": f"{random.randint(2, 8)} hours",
            "status": "completed",
            "timestamp": datetime.now().isoformat()
        }

# Global agent instance
case_manager_agent = MockCaseManagerAgent()

def assist_case_investigation(case_id: str, request_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Assist with case investigation"""
    try:
        return case_manager_agent.investigate_case(case_id, request_type, data)
    except Exception as e:
        logger.error(f"Error in case investigation: {e}")
        # Return a default response
        return {
            "case_id": case_id,
            "investigation_type": request_type,
            "steps_completed": ["Error in investigation", "Manual review required"],
            "recommendations": ["Escalate to human analyst"],
            "confidence_score": 0.0,
            "estimated_completion_time": "Unknown",
            "status": "error",
            "timestamp": datetime.now().isoformat()
        }
