#!/bin/bash

# Zynx AGI Backend Test Runner
# This script runs the backend tests with proper setup

set -e

echo "🧪 Running Zynx AGI Backend Tests..."

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run tests with coverage
echo "🚀 Running tests with coverage..."
pytest test_main.py -v --cov=main --cov-report=term-missing --cov-report=html --cov-fail-under=80

echo "✅ Tests completed successfully!"
echo "📊 Coverage report generated in htmlcov/index.html"