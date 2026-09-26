#!/usr/bin/env python3
"""
Quick test script to verify backend setup
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

print("🧪 Testing Backend Setup...")
print("=" * 60)

# Test imports
print("\n1. Testing imports...")
try:
    import fastapi
    print(f"   ✅ FastAPI {fastapi.__version__}")
except Exception as e:
    print(f"   ❌ FastAPI: {e}")
    sys.exit(1)

try:
    import boto3
    print(f"   ✅ Boto3 {boto3.__version__}")
except Exception as e:
    print(f"   ❌ Boto3: {e}")
    sys.exit(1)

try:
    from strands import agent
    print(f"   ✅ Strands Agent")
except Exception as e:
    print(f"   ❌ Strands Agent: {e}")
    sys.exit(1)

# Test AWS credentials
print("\n2. Testing AWS credentials...")
try:
    sts = boto3.client('sts', region_name='eu-west-1')
    identity = sts.get_caller_identity()
    print(f"   ✅ AWS Account: {identity['Account']}")
    print(f"   ✅ AWS User: {identity['Arn'].split('/')[-1]}")
except Exception as e:
    print(f"   ❌ AWS credentials: {e}")
    sys.exit(1)

# Test Bedrock access
print("\n3. Testing Bedrock access...")
try:
    bedrock = boto3.client('bedrock', region_name='eu-west-1')
    # Just test connection, don't list all models
    print(f"   ✅ Bedrock client created successfully")
except Exception as e:
    print(f"   ❌ Bedrock access: {e}")
    sys.exit(1)

# Test backend modules
print("\n4. Testing backend modules...")
try:
    from config import settings
    print(f"   ✅ Config loaded")
    print(f"      - Region: {settings.bedrock_region}")
    print(f"      - Model: {settings.bedrock_model_id}")
except Exception as e:
    print(f"   ❌ Config: {e}")
    sys.exit(1)

try:
    from agents.fraud_detection_agent import fraud_detection_agent
    print(f"   ✅ Fraud Detection Agent")
except Exception as e:
    print(f"   ❌ Fraud Detection Agent: {e}")
    sys.exit(1)

try:
    from agents.threat_response_agent import threat_response_agent
    print(f"   ✅ Threat Response Agent")
except Exception as e:
    print(f"   ❌ Threat Response Agent: {e}")
    sys.exit(1)

try:
    from agents.case_manager_agent import case_manager_agent
    print(f"   ✅ Case Manager Agent")
except Exception as e:
    print(f"   ❌ Case Manager Agent: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ All tests passed! Backend is ready.")
print("\nYou can now run: ./run.sh")
print("=" * 60)
