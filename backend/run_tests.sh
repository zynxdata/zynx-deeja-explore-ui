#!/bin/bash

# Zynx AGI Backend Test Runner
# Runs tests with coverage and generates reports

set -e

echo "🧪 Running Zynx AGI Backend Tests..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run linting
echo "🔍 Running linting..."
python -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics || true
python -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

# Run tests with coverage
echo "🧪 Running tests with coverage..."
python -m pytest tests/ -v --cov=main --cov-report=term-missing --cov-report=html --cov-report=xml --cov-fail-under=80

# Show coverage summary
echo "📊 Coverage Summary:"
python -m coverage report

# Open coverage report in browser (if available)
if command -v xdg-open &> /dev/null; then
    echo "🌐 Opening coverage report..."
    xdg-open htmlcov/index.html
elif command -v open &> /dev/null; then
    echo "🌐 Opening coverage report..."
    open htmlcov/index.html
fi

echo "✅ Tests completed successfully!"
echo "📁 Coverage report available in: htmlcov/index.html"