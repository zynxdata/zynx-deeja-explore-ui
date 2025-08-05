#!/bin/bash

# Zynx AGI Development Script
# Runs both frontend and backend in development mode

set -e

echo "🚀 Starting Zynx AGI Development Environment"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found."
    exit 1
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Install backend dependencies if needed
if [ ! -f "backend/.env" ]; then
    echo "📝 Setting up backend environment..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "⚠️  Backend .env already exists"
fi

# Create logs directory
mkdir -p backend/logs

echo "🔧 Starting backend server..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID