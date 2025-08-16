#!/usr/bin/env python3
"""
Test script to demonstrate agent interactions
Generates multiple test transactions to show the fraud detection pipeline
"""

import requests
import time
import json

def generate_test_transaction():
    """Generate a test transaction"""
    try:
        response = requests.post(
            "http://localhost:8000/api/test/generate-transaction",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error generating transaction: {e}")
        return None

def main():
    print("🛡️ Vigilant Sentinel Agent Interaction Demo")
    print("=" * 50)
    print("This script will generate test transactions to demonstrate")
    print("real-time agent interactions and fraud detection pipeline.")
    print("=" * 50)
    
    # Generate 3 test transactions with delays
    for i in range(1, 4):
        print(f"\n🚀 Generating test transaction #{i}...")
        
        result = generate_test_transaction()
        
        if result:
            transaction = result.get('transaction', {})
            alert = result.get('alert', {})
            
            print(f"✅ Transaction generated: {transaction.get('id', 'unknown')}")
            print(f"📊 Risk Level: {alert.get('severity', 'unknown')}")
            print(f"🎯 Risk Score: {alert.get('risk_score', 0):.3f}")
        else:
            print(f"❌ Failed to generate transaction #{i}")
        
        if i < 3:  # Don't wait after the last transaction
            print(f"⏳ Waiting 5 seconds before next transaction...")
            time.sleep(5)
    
    print(f"\n✅ Demo complete! Check the terminal output for detailed agent interactions.")
    print(f"🔍 You should see:")
    print(f"   • Fraud Detection Agent analyzing each transaction")
    print(f"   • Multiple analysis modules working together")
    print(f"   • AI reasoning from Claude 3 Haiku")
    print(f"   • Threat Response Agent taking actions")
    print(f"   • Agent coordination and communication")

if __name__ == "__main__":
    main()
