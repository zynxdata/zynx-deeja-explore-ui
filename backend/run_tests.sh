#!/bin/bash

# Zynx AGI Backend Test Runner
# This script runs all backend tests with coverage reporting

set -e

echo "🧪 Running Zynx AGI Backend Tests..."

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
pytest test_main.py -v --cov=main --cov-report=html --cov-report=xml --cov-fail-under=80

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
    echo "📊 Coverage report generated in htmlcov/index.html"
    echo "📈 Coverage XML generated in coverage.xml"
else
    echo "❌ Some tests failed!"
    exit 1
fi

echo "🎉 Test run completed successfully!"