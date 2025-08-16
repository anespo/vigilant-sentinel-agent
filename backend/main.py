"""
FastAPI Backend for Vigilant Sentinel Anti-Fraud Application
Integrates Strands Agents with AWS services for real-time fraud detection
"""

import json
import logging
import logging.config
import asyncio
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
import uvicorn
import boto3
from contextlib import asynccontextmanager

# Import configuration
from config import settings, LOGGING_CONFIG

# Import our agents
from agents.fraud_detection_agent import fraud_detection_agent, process_transaction_alert
from agents.threat_response_agent import threat_response_agent, execute_threat_response
from agents.case_manager_agent import case_manager_agent, assist_case_investigation

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

# Pydantic models for API requests/responses
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

class FraudAlert(BaseModel):
    transaction_id: str
    user_id: str
    risk_score: float
    risk_factors: List[str]
    severity: str
    recommended_action: str
    timestamp: str

class ThreatResponse(BaseModel):
    alert_id: str
    actions_taken: List[str]
    status: str
    timestamp: str

class CaseInvestigation(BaseModel):
    case_id: str
    request_type: str
    data: Dict[str, Any]

class AgentStatus(BaseModel):
    agent_name: str
    status: str
    last_activity: str
    processed_count: int
    error_count: int

# Global state management
class ApplicationState:
    def __init__(self):
        self.active_alerts = {}
        self.agent_metrics = {
            "fraud_detection": {"processed": 0, "errors": 0, "last_activity": None},
            "threat_response": {"processed": 0, "errors": 0, "last_activity": None},
            "case_manager": {"processed": 0, "errors": 0, "last_activity": None}
        }
        self.websocket_connections = set()
        self.transaction_queue = asyncio.Queue()
        self.alert_queue = asyncio.Queue()

app_state = ApplicationState()

# Background task for processing transactions
async def process_transaction_queue():
    """Background task to process incoming transactions"""
    while True:
        try:
            transaction_data = await app_state.transaction_queue.get()
            
            print(f"\n{'🔄 TRANSACTION PROCESSING PIPELINE':.^80}")
            print(f"📥 New transaction received: {transaction_data['id']}")
            print(f"💰 Amount: ${transaction_data['amount']}")
            print(f"👤 User: {transaction_data['user_id']}")
            print(f"🏪 Merchant: {transaction_data['merchant']}")
            print(f"🚀 Initiating fraud detection analysis...")
            
            # Process with fraud detection agent
            logger.info(f"Processing transaction: {transaction_data['id']}")
            
            # Convert dict to TransactionData object
            transaction_obj = TransactionData(**transaction_data)
            
            # Simulate fraud detection processing
            alert = await asyncio.to_thread(process_transaction_alert, transaction_obj)
            logger.info(f"Generated alert: {alert}")
            
            print(f"✅ Fraud Detection Agent analysis complete")
            print(f"📊 Risk Assessment: {alert.severity} (Score: {alert.risk_score:.3f})")
            
            # Update metrics
            app_state.agent_metrics["fraud_detection"]["processed"] += 1
            app_state.agent_metrics["fraud_detection"]["last_activity"] = datetime.now().isoformat()
            
            # Convert alert to dict for processing
            alert_dict = {
                "transaction_id": alert.transaction_id,
                "user_id": transaction_data.get("user_id"),
                "risk_score": alert.risk_score,
                "risk_factors": alert.risk_factors,
                "severity": alert.severity,
                "recommended_action": alert.recommended_action,
                "timestamp": alert.timestamp.isoformat()
            }
            
            logger.info(f"Alert dict: {alert_dict}")
            
            # Always add to alert queue for demonstration (in production, filter by risk threshold)
            await app_state.alert_queue.put(alert_dict)
            
            # Store active alert
            app_state.active_alerts[alert.transaction_id] = alert
            logger.info(f"Stored alert. Total active alerts: {len(app_state.active_alerts)}")
            
            # Notify WebSocket clients immediately
            await broadcast_alert(alert_dict)
            
        except Exception as e:
            logger.error(f"Error processing transaction: {e}")
            app_state.agent_metrics["fraud_detection"]["errors"] += 1

# Background task for processing alerts
async def process_alert_queue():
    """Background task to process fraud alerts"""
    while True:
        try:
            alert_data = await app_state.alert_queue.get()
            
            print(f"\n{'📡 AGENT COORDINATION CENTER':.^80}")
            print(f"🔄 Alert received from Fraud Detection Agent")
            print(f"📊 Transaction ID: {alert_data['transaction_id']}")
            print(f"🎯 Risk Score: {alert_data.get('risk_score', 'unknown')}")
            print(f"⚡ Routing to Threat Response Agent...")
            
            # Process with threat response agent
            logger.info(f"Processing alert: {alert_data['transaction_id']}")
            
            response = await asyncio.to_thread(execute_threat_response, alert_data['transaction_id'], alert_data)
            
            print(f"✅ Threat Response Agent completed processing")
            print(f"📋 Actions taken: {len(response.actions_taken)}")
            
            # Update metrics
            app_state.agent_metrics["threat_response"]["processed"] += 1
            app_state.agent_metrics["threat_response"]["last_activity"] = datetime.now().isoformat()
            
            # Notify WebSocket clients of response
            print(f"📡 Broadcasting response to connected clients...")
            await broadcast_response(response)
            
            # Check if case manager should be involved
            if alert_data.get('risk_score', 0) >= 0.7:
                print(f"🤖 [AGENT ESCALATION] Notifying Case Manager Agent for human review...")
            
            print(f"{'='*80}")
            
        except Exception as e:
            logger.error(f"Error processing alert: {e}")
            print(f"🚨 [ERROR] Agent coordination error: {e}")
            app_state.agent_metrics["threat_response"]["errors"] += 1

# WebSocket broadcast functions
async def broadcast_alert(alert_data: Dict[str, Any]):
    """Broadcast fraud alert to all connected WebSocket clients"""
    if app_state.websocket_connections:
        message = {
            "type": "fraud_alert",
            "data": alert_data
        }
        disconnected = set()
        
        for websocket in app_state.websocket_connections:
            try:
                await websocket.send_text(json.dumps(message))
            except:
                disconnected.add(websocket)
        
        # Remove disconnected clients
        app_state.websocket_connections -= disconnected

async def broadcast_response(response_data: Dict[str, Any]):
    """Broadcast threat response to all connected WebSocket clients"""
    if app_state.websocket_connections:
        message = {
            "type": "threat_response",
            "data": response_data
        }
        disconnected = set()
        
        for websocket in app_state.websocket_connections:
            try:
                await websocket.send_text(json.dumps(message))
            except:
                disconnected.add(websocket)
        
        # Remove disconnected clients
        app_state.websocket_connections -= disconnected

# Application lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Vigilant Sentinel Anti-Fraud Application")
    
    # Start background tasks
    transaction_task = asyncio.create_task(process_transaction_queue())
    alert_task = asyncio.create_task(process_alert_queue())
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")
    transaction_task.cancel()
    alert_task.cancel()

# Initialize FastAPI app
app = FastAPI(
    title="Vigilant Sentinel Anti-Fraud API",
    description="AI-powered fraud detection and response system using Strands Agents",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["natvigilant.catandaita.com", "localhost", "127.0.0.1"]
)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add CORS middleware with production settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# API Routes

@app.get("/health")
async def health_check():
    """Health check endpoint for load balancer"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Vigilant Sentinel Anti-Fraud API",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/status")
async def get_system_status():
    """Get overall system status and agent metrics"""
    return {
        "system_status": "operational",
        "agents": [
            AgentStatus(
                agent_name="Fraud Detection Agent",
                status="active",
                last_activity=app_state.agent_metrics["fraud_detection"]["last_activity"] or "Never",
                processed_count=app_state.agent_metrics["fraud_detection"]["processed"],
                error_count=app_state.agent_metrics["fraud_detection"]["errors"]
            ),
            AgentStatus(
                agent_name="Threat Response Agent", 
                status="active",
                last_activity=app_state.agent_metrics["threat_response"]["last_activity"] or "Never",
                processed_count=app_state.agent_metrics["threat_response"]["processed"],
                error_count=app_state.agent_metrics["threat_response"]["errors"]
            ),
            AgentStatus(
                agent_name="Case Manager Agent",
                status="active", 
                last_activity=app_state.agent_metrics["case_manager"]["last_activity"] or "Never",
                processed_count=app_state.agent_metrics["case_manager"]["processed"],
                error_count=app_state.agent_metrics["case_manager"]["errors"]
            )
        ],
        "active_alerts": len(app_state.active_alerts),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/transactions/analyze")
async def analyze_transaction(transaction: TransactionData, background_tasks: BackgroundTasks):
    """Submit a transaction for fraud analysis"""
    try:
        # Process immediately for testing
        logger.info(f"Processing transaction immediately: {transaction.id}")
        
        # Generate alert - pass TransactionData object directly
        alert = process_transaction_alert(transaction)
        logger.info(f"Generated alert: {alert}")
        
        # Update metrics
        app_state.agent_metrics["fraud_detection"]["processed"] += 1
        app_state.agent_metrics["fraud_detection"]["last_activity"] = datetime.now().isoformat()
        
        # Store active alert immediately
        app_state.active_alerts[alert.transaction_id] = alert
        logger.info(f"Stored alert. Total active alerts: {len(app_state.active_alerts)}")
        
        # Also add to queue for background processing
        await app_state.transaction_queue.put(transaction_data)
        
        return {
            "status": "accepted",
            "transaction_id": transaction.id,
            "message": "Transaction submitted for fraud analysis",
            "alert_generated": True,
            "risk_score": alert.risk_score,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error submitting transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alerts")
async def get_active_alerts():
    """Get all active fraud alerts"""
    alerts = []
    for alert in app_state.active_alerts.values():
        alerts.append({
            "transaction_id": alert.transaction_id,
            "user_id": getattr(alert, 'user_id', None),
            "risk_score": alert.risk_score,
            "risk_factors": alert.risk_factors,
            "severity": alert.severity,
            "recommended_action": alert.recommended_action,
            "timestamp": alert.timestamp.isoformat() if hasattr(alert.timestamp, 'isoformat') else str(alert.timestamp)
        })
    
    return {
        "alerts": alerts,
        "count": len(alerts),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/alerts/{alert_id}/respond")
async def respond_to_alert(alert_id: str, background_tasks: BackgroundTasks):
    """Trigger automated response to a fraud alert"""
    try:
        if alert_id not in app_state.active_alerts:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        alert = app_state.active_alerts[alert_id]
        logger.info(f"Responding to alert: {alert_id}")
        
        # Create alert data for threat response
        alert_data = {
            "transaction_id": alert.transaction_id,
            "risk_score": alert.risk_score,
            "risk_factors": alert.risk_factors,
            "severity": alert.severity,
            "recommended_action": alert.recommended_action,
            "timestamp": alert.timestamp.isoformat() if hasattr(alert.timestamp, 'isoformat') else str(alert.timestamp)
        }
        
        # Execute threat response immediately with new Strands agent
        logger.info(f"Executing threat response for alert: {alert_id}")
        response_result = await asyncio.to_thread(execute_threat_response, alert_id, alert_data)
        
        # Update metrics
        app_state.agent_metrics["threat_response"]["processed"] += 1
        app_state.agent_metrics["threat_response"]["last_activity"] = datetime.now().isoformat()
        
        # Mark alert as responded (you might want to move it to a "responded" state)
        # For now, we'll keep it active but could add a status field
        
        # Broadcast the response to WebSocket clients
        await broadcast_response({
            "alert_id": alert_id,
            "response_result": response_result,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "alert_id": alert_id,
            "message": "Automated threat response executed",
            "response_details": response_result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error responding to alert: {e}")
        app_state.agent_metrics["threat_response"]["errors"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cases/investigate")
async def investigate_case(investigation: CaseInvestigation):
    """Request case investigation assistance"""
    try:
        result = await asyncio.to_thread(
            assist_case_investigation,
            investigation.case_id,
            investigation.request_type,
            investigation.data
        )
        
        # Update metrics
        app_state.agent_metrics["case_manager"]["processed"] += 1
        app_state.agent_metrics["case_manager"]["last_activity"] = datetime.now().isoformat()
        
        return result
        
    except Exception as e:
        logger.error(f"Error investigating case: {e}")
        app_state.agent_metrics["case_manager"]["errors"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics():
    """Get analytics data for the dashboard"""
    # Generate sample analytics data
    # In production, this would query your analytics database
    
    now = datetime.now()
    
    return {
        "transaction_volume": {
            "total_today": 15847,
            "total_this_hour": 1247,
            "average_per_minute": 21
        },
        "fraud_detection": {
            "alerts_today": 23,
            "blocked_transactions": 8,
            "false_positives": 2,
            "detection_rate": 0.145  # 14.5%
        },
        "risk_distribution": {
            "critical": 3,
            "high": 8,
            "medium": 12,
            "low": 15842
        },
        "response_times": {
            "average_detection_ms": 245,
            "average_response_ms": 1200,
            "sla_compliance": 0.987  # 98.7%
        },
        "agent_performance": {
            "fraud_detection_agent": {
                "uptime": 0.999,
                "processed_today": app_state.agent_metrics["fraud_detection"]["processed"],
                "error_rate": 0.001
            },
            "threat_response_agent": {
                "uptime": 0.998,
                "processed_today": app_state.agent_metrics["threat_response"]["processed"],
                "error_rate": 0.002
            },
            "case_manager_agent": {
                "uptime": 1.0,
                "processed_today": app_state.agent_metrics["case_manager"]["processed"],
                "error_rate": 0.0
            }
        },
        "timestamp": now.isoformat()
    }

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time fraud alerts and updates"""
    await websocket.accept()
    app_state.websocket_connections.add(websocket)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif message.get("type") == "subscribe":
                # Client subscribing to specific alert types
                await websocket.send_text(json.dumps({
                    "type": "subscription_confirmed",
                    "subscribed_to": message.get("channels", ["all"])
                }))
                
    except WebSocketDisconnect:
        app_state.websocket_connections.discard(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        app_state.websocket_connections.discard(websocket)

# Simulate some test data endpoints (for development)
@app.post("/api/test/generate-transaction")
async def generate_test_transaction():
    """Generate a test transaction for development purposes"""
    import random
    
    test_transaction = TransactionData(
        id=f"txn_{random.randint(100000, 999999)}",
        user_id=f"user_{random.randint(1000, 9999)}",
        amount=random.uniform(10, 10000),
        merchant=random.choice(["Amazon", "Starbucks", "Shell", "Unknown Merchant", "Foreign Store"]),
        location=random.choice(["New York, NY", "Los Angeles, CA", "Moscow, Russia", "London, UK"]),
        timestamp=datetime.now().isoformat(),
        device_id=random.choice(["device_123", "device_456", "new_device", "unknown"]),
        ip_address=f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
        card_type=random.choice(["credit", "debit"])
    )
    
    # Process immediately and generate alert
    logger.info(f"Generating test transaction: {test_transaction.id}")
    
    # Generate alert immediately - pass the TransactionData object directly
    alert = process_transaction_alert(test_transaction)
    logger.info(f"Generated test alert: {alert}")
    
    # Update metrics
    app_state.agent_metrics["fraud_detection"]["processed"] += 1
    app_state.agent_metrics["fraud_detection"]["last_activity"] = datetime.now().isoformat()
    
    # Store active alert
    app_state.active_alerts[alert.transaction_id] = alert
    logger.info(f"Stored test alert. Total active alerts: {len(app_state.active_alerts)}")
    
    # Broadcast to WebSocket clients
    alert_dict = {
        "transaction_id": alert.transaction_id,
        "user_id": test_transaction.user_id,
        "risk_score": alert.risk_score,
        "risk_factors": alert.risk_factors,
        "severity": alert.severity,
        "recommended_action": alert.recommended_action,
        "timestamp": alert.timestamp.isoformat()
    }
    await broadcast_alert(alert_dict)
    
    # Also submit for background analysis - convert to dict for queue
    await app_state.transaction_queue.put(test_transaction.dict())
    
    return {
        "status": "generated",
        "transaction": test_transaction,
        "alert": {
            "risk_score": alert.risk_score,
            "severity": alert.severity,
            "risk_factors": alert.risk_factors
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
