# Vigilant Sentinel - AI-Powered Anti-Fraud Application

A comprehensive fraud detection and response system built with **Strands Agents**, **AWS Bedrock**, and **React**. This application provides real-time transaction monitoring, automated threat response, and intelligent case management for financial institutions.

![Vigilant Sentinel Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange)
![Strands Agents](https://img.shields.io/badge/AI-Strands%20Agents-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)
![License](https://img.shields.io/badge/License-Commercial-red)


## 🚀 Quick Start

There are several ways of editing your application.


**Use your preferred IDE**

You can work locally using your preferred IDE and push changes to the repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

This will automatically:
- Check prerequisites (Node.js, Python, AWS CLI)
- Install all dependencies
- Set up the backend and frontend
- Start both servers
- Open the application in your browser

### Manual Setup
If you prefer manual setup, see [SETUP.md](SETUP.md) for detailed instructions.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Real-time Dashboard**: Live fraud monitoring with WebSocket updates
- **Professional UI**: Security-focused design with shadcn/ui components
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Backend (FastAPI + Strands Agents)
- **Fraud Detection Agent**: ML-powered transaction analysis
- **Threat Response Agent**: Automated fraud response actions
- **Case Manager Agent**: Investigation assistance for human analysts
- **Real-time Processing**: WebSocket support for live updates

### AI Integration (AWS Bedrock + Strands Agents)
- **Claude 3.7 Sonnet**: Advanced reasoning for fraud detection
- **Custom Tools**: Specialized fraud analysis and response functions
- **Scalable Infrastructure**: AWS-native deployment ready

## 🛡️ Key Features



## 📊 Dashboard Features

### Live Monitoring
- **Transaction Volume**: Real-time processing statistics
- **Fraud Alerts**: Live feed of suspicious activities
- **Agent Status**: Monitor AI agent performance and health
- **System Metrics**: Response times, accuracy, and SLA compliance

### Analytics & Reporting
- **Risk Distribution**: Breakdown of threats by severity level
- **Detection Accuracy**: False positive rates and model performance
- **Response Metrics**: Average response times and resolution rates
- **Trend Analysis**: Historical patterns and fraud evolution

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Recharts** for data visualization
- **WebSocket** for real-time updates

### Backend
- **FastAPI** for high-performance API
- **Strands Agents SDK** for AI agent orchestration
- **WebSocket** support for real-time communication
- **Async/await** for concurrent processing
- **Pydantic** for data validation

### AI & Cloud
- **AWS Bedrock** with Claude 3.7 Sonnet
- **Strands Agents** for agent framework
- **Custom Tools** for fraud-specific operations
- **AWS SDK** for cloud service integration

## 🚦 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.9+
- **AWS Account** with Bedrock access
- **AWS CLI** configured with credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vigilant-sentinel-agent
   ```

2. **Run the setup script**
   ```bash
   ./start.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Configuration

1. **AWS Setup**
   ```bash
   aws configure
   # Enter your AWS credentials and region (us-west-2 recommended)
   ```

2. **Bedrock Model Access**
   - Go to AWS Console > Bedrock > Model Access
   - Request access to Claude 3.7 Sonnet model
   - Wait for approval (usually immediate)

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Update with your specific configuration
   ```

## 🧪 Testing the Application

### Generate Test Transactions
1. Open the dashboard at http://localhost:5173
2. Click "Generate Test Transaction" in the development panel
3. Watch real-time fraud detection in action
4. See automated responses and alerts

### Test Scenarios
- **High-value transactions** (>$5,000) trigger enhanced monitoring
- **Foreign locations** increase risk scores
- **New devices** require additional verification
- **Rapid transactions** indicate potential fraud

## 📈 Monitoring & Analytics

### Real-time Metrics
- Transaction processing rate
- Fraud detection accuracy
- Response time performance
- Agent health and status

### Dashboard Insights
- Risk score distribution
- Alert severity breakdown
- Geographic threat patterns
- Temporal fraud trends

## 🔒 Security Features

### Data Protection
- Secure WebSocket connections
- Input validation and sanitization
- Error handling without data exposure
- Audit logging for compliance

### Fraud Prevention
- Multi-factor risk assessment
- Behavioral pattern analysis
- Device fingerprinting
- Geolocation verification

## 🚀 Deployment

### Development
```bash
./start.sh
```

### Production
See [SETUP.md](SETUP.md) for production deployment instructions including:
- AWS infrastructure setup
- Container deployment
- Auto-scaling configuration
- Monitoring and alerting

## 📚 Documentation

- **[Setup Guide](SETUP.md)**: Detailed installation and configuration
- **[API Documentation](http://localhost:8000/docs)**: Interactive API explorer
- **[Strands Agents Docs](https://strandsagents.com)**: AI agent framework documentation
- **[AWS Bedrock Guide](https://docs.aws.amazon.com/bedrock/)**: Cloud AI service documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under a Commercial License - see the [LICENSE](LICENSE) file for details.

**This is proprietary software. All rights reserved.**

For commercial licensing, distribution rights, or custom development services, please contact Antonio Esposito.

## 👨‍💻 Author

**Antonio Esposito**
- GitHub: [@anespo](https://github.com/anespo)
- Project: [Vigilant Sentinel Agent](https://github.com/anespo/vigilant-sentinel-agent)

## 🆘 Support

### Troubleshooting
- Check [SETUP.md](SETUP.md) for common issues
- Verify AWS credentials and Bedrock access
- Ensure all dependencies are installed correctly

### Getting Help
- Review application logs for error details
- Check AWS CloudWatch for service issues
- Consult Strands Agents documentation for AI-related questions

---

**Built with ❤️ by Antonio Esposito using Strands Agents, AWS Bedrock, and modern web technologies**
