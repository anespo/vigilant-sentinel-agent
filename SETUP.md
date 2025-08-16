# Vigilant Sentinel Anti-Fraud Application Setup

This guide will help you set up and run the complete anti-fraud application using Strands Agents and AWS services.

## Prerequisites

### Required Software
- **Node.js** (v18 or higher) - for the React frontend
- **Python** (3.9 or higher) - for the Strands Agents backend
- **AWS CLI** - configured with your credentials
- **Git** - for version control

### AWS Requirements
- AWS Account with appropriate permissions
- Access to Amazon Bedrock (Claude 3.7 Sonnet model)
- AWS credentials configured locally

## Quick Start

### 1. Clone and Setup Frontend

```bash
# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# VITE_API_URL=http://localhost:8000
```

### 2. Setup Python Backend

```bash
# Create Python virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Configure AWS Credentials

```bash
# Configure AWS CLI (if not already done)
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-west-2
```

### 4. Verify Bedrock Access

```bash
# Test Bedrock access
aws bedrock list-foundation-models --region us-west-2

# Request model access if needed (one-time setup)
# Go to AWS Console > Bedrock > Model Access
# Request access to Claude 3.7 Sonnet model
```

### 5. Start the Application

```bash
# Terminal 1: Start the backend
cd backend
python main.py

# Terminal 2: Start the frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Architecture Overview

### Frontend (React + TypeScript)
- **Dashboard**: Real-time fraud monitoring interface
- **WebSocket Integration**: Live updates for alerts and responses
- **API Service**: Communication with backend services
- **UI Components**: Professional security-focused design

### Backend (FastAPI + Strands Agents)
- **Fraud Detection Agent**: Analyzes transactions for fraud patterns
- **Threat Response Agent**: Executes automated responses to threats
- **Case Manager Agent**: Assists human analysts with investigations
- **Real-time Processing**: WebSocket support for live updates

### AI Agents (Strands Agents SDK)
- **Model**: Claude 3.7 Sonnet via Amazon Bedrock
- **Tools**: Custom fraud detection and response tools
- **Integration**: AWS services for scalability and reliability

## Key Features

### Real-time Fraud Detection
- Transaction monitoring with ML-powered risk scoring
- Pattern recognition across user behavior and transaction history
- Cross-channel threat detection (mobile, web, ATM, call center)

### Automated Threat Response
- Immediate transaction blocking for high-risk activities
- Customer notification via multiple channels
- Account freezing and verification workflows
- Escalation to human analysts for complex cases

### Case Management
- Data collation from multiple systems
- Investigation assistance with AI-powered insights
- Pattern analysis across historical cases
- Automated documentation and reporting

### Multi-Agent Coordination
- Specialized agents for different fraud detection aspects
- Shared intelligence across all detection channels
- Coordinated response to multi-step fraud attempts

## Development Features

### Test Controls
- Generate test transactions to see the system in action
- Simulate various fraud scenarios
- Real-time alert generation and response testing

### Monitoring & Analytics
- Agent performance metrics
- System health monitoring
- Real-time transaction volume tracking
- Fraud detection accuracy metrics

## API Endpoints

### Core Endpoints
- `GET /api/status` - System and agent status
- `POST /api/transactions/analyze` - Submit transaction for analysis
- `GET /api/alerts` - Get active fraud alerts
- `POST /api/alerts/{id}/respond` - Trigger automated response
- `POST /api/cases/investigate` - Request case investigation
- `GET /api/analytics/dashboard` - Dashboard analytics data

### WebSocket
- `WS /ws` - Real-time updates for alerts and responses

### Development
- `POST /api/test/generate-transaction` - Generate test transaction

## Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
```

#### Backend
```bash
# AWS Configuration
AWS_DEFAULT_REGION=us-west-2
BEDROCK_MODEL_ID=us.anthropic.claude-3-7-sonnet-20250219-v1:0

# Application
DEBUG=true
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173
```

## Deployment

### Local Development
1. Follow the Quick Start guide above
2. Use the test controls to generate sample data
3. Monitor the dashboard for real-time updates

### Production Deployment
1. **AWS Infrastructure**: Deploy using AWS CDK or CloudFormation
2. **Container Deployment**: Use Docker for consistent environments
3. **Scaling**: Configure auto-scaling for high transaction volumes
4. **Monitoring**: Set up CloudWatch for production monitoring

## Troubleshooting

### Common Issues

#### Backend Won't Start
- Check Python virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check AWS credentials are configured correctly

#### Frontend Can't Connect to Backend
- Verify backend is running on port 8000
- Check CORS configuration in backend
- Ensure VITE_API_URL is set correctly

#### Bedrock Access Issues
- Verify model access is granted in AWS Console
- Check AWS credentials have Bedrock permissions
- Ensure correct region is configured

#### WebSocket Connection Issues
- Check firewall settings for WebSocket connections
- Verify backend WebSocket endpoint is accessible
- Check browser console for connection errors

### Logs and Debugging
- Backend logs: Check console output when running `python main.py`
- Frontend logs: Check browser developer console
- AWS logs: Check CloudWatch logs for Bedrock API calls

## Security Considerations

### Development
- Never commit AWS credentials to version control
- Use environment variables for sensitive configuration
- Keep dependencies updated

### Production
- Use IAM roles instead of access keys
- Enable AWS CloudTrail for audit logging
- Implement proper authentication and authorization
- Use HTTPS for all communications
- Regular security audits and penetration testing

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review AWS Bedrock documentation
3. Check Strands Agents documentation at https://strandsagents.com
4. Review application logs for specific error messages

## Next Steps

1. **Customize Agents**: Modify the fraud detection logic for your specific use case
2. **Add Integrations**: Connect to your existing fraud detection systems
3. **Enhance UI**: Customize the dashboard for your organization's needs
4. **Scale Infrastructure**: Deploy to AWS for production use
5. **Add Features**: Implement additional fraud detection patterns and response workflows
