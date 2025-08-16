#!/bin/bash

# Vigilant Sentinel Anti-Fraud Application Startup Script

set -e

echo "🛡️  Starting Vigilant Sentinel Anti-Fraud Application"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.9 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
    print_success "Python $(python3 --version) is installed"
}

# Check AWS credentials
check_aws() {
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI is not installed. Please install and configure AWS CLI."
        print_warning "You can still run the application, but AWS features may not work."
        return
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_warning "AWS credentials are not configured. Please run 'aws configure'."
        print_warning "You can still run the application, but AWS features may not work."
        return
    fi
    
    print_success "AWS credentials are configured"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please update .env file with your configuration"
    fi
    
    print_success "Frontend setup complete"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found in backend directory"
        exit 1
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    cd ..
    print_success "Backend setup complete"
}

# Start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    source venv/bin/activate
    
    # Set AWS environment variables
    export AWS_DEFAULT_REGION=eu-west-1
    export AWS_PROFILE=default
    export BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
    export BEDROCK_REGION=eu-west-1
    
    # Start backend in background
    python main.py &
    BACKEND_PID=$!
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 5
    
    # Check if backend is running
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend server started (PID: $BACKEND_PID)"
        echo $BACKEND_PID > ../backend.pid
    else
        print_error "Failed to start backend server"
        exit 1
    fi
    
    cd ..
}

# Start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    
    # Start frontend in background
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    print_status "Waiting for frontend to start..."
    sleep 3
    
    # Check if frontend is running
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend server started (PID: $FRONTEND_PID)"
        echo $FRONTEND_PID > frontend.pid
    else
        print_error "Failed to start frontend server"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    print_status "Shutting down servers..."
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend server stopped"
        fi
        rm backend.pid
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend server stopped"
        fi
        rm frontend.pid
    fi
    
    print_success "Cleanup complete"
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    print_status "Checking prerequisites..."
    check_nodejs
    check_python
    check_aws
    
    print_status "Setting up application..."
    setup_frontend
    setup_backend
    
    print_status "Starting services..."
    start_backend
    start_frontend
    
    echo ""
    echo "🎉 Application is now running!"
    echo "================================"
    echo "Frontend: http://localhost:5173"
    echo "Backend:  http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo ""
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Run main function
main
