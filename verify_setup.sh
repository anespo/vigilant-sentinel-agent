#!/bin/bash

echo "🔍 RobinHood - Setup Verification"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Install Node.js: brew install node"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

# Check Python
echo -n "Checking Python 3.12... "
if command -v python3.12 &> /dev/null; then
    PYTHON_VERSION=$(python3.12 --version)
    echo -e "${GREEN}✓${NC} $PYTHON_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Install Python 3.12: brew install python@3.12"
    exit 1
fi

# Check node_modules
echo -n "Checking frontend dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "Run: npm install"
    exit 1
fi

# Check backend venv
echo -n "Checking backend virtual environment... "
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓${NC} Created"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Run: python3.12 -m venv backend/venv"
    exit 1
fi

# Check AWS credentials
echo -n "Checking AWS credentials... "
if aws sts get-caller-identity --region eu-west-1 &> /dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✓${NC} Account: $ACCOUNT"
else
    echo -e "${RED}✗ Not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

# Check .env file
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Present"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Copy .env.example to .env"
    exit 1
fi

# Test backend imports
echo -n "Testing backend setup... "
cd backend
source venv/bin/activate
if python -c "from config import settings; from agents.fraud_detection_agent import fraud_detection_agent" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} All modules OK"
else
    echo -e "${RED}✗ Import errors${NC}"
    echo "Run: pip install -r requirements.txt"
    exit 1
fi
cd ..

echo ""
echo "=============================================="
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "Ready to start the application:"
echo "  ./run.sh"
echo ""
echo "Or start services separately:"
echo "  Backend:  cd backend && source venv/bin/activate && python main.py"
echo "  Frontend: npm run dev"
echo "=============================================="
