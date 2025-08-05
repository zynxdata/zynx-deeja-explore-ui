#!/usr/bin/env python3
"""
Test runner for Zynx AGI Backend
Runs pytest with coverage and generates reports
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    """Main test runner function"""
    print("🧪 Running Zynx AGI Backend Tests")
    print("=" * 50)
    
    # Ensure we're in the backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Check if requirements are installed
    print("📦 Checking dependencies...")
    success, stdout, stderr = run_command("python -c 'import fastapi, pytest, loguru'")
    if not success:
        print("❌ Dependencies not installed. Installing...")
        success, stdout, stderr = run_command("pip install -r requirements.txt")
        if not success:
            print(f"❌ Failed to install dependencies: {stderr}")
            return 1
    
    print("✅ Dependencies OK")
    
    # Run linting
    print("\n🔍 Running linting...")
    success, stdout, stderr = run_command("pip install flake8")
    if success:
        success, stdout, stderr = run_command("flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics")
        if not success:
            print(f"⚠️  Linting issues found: {stderr}")
        else:
            print("✅ Linting passed")
    else:
        print("⚠️  Skipping linting (flake8 not available)")
    
    # Run tests
    print("\n🧪 Running tests...")
    success, stdout, stderr = run_command("pytest test_main.py -v --cov=main --cov-report=html --cov-report=term-missing")
    
    if success:
        print("✅ All tests passed!")
        
        # Check coverage
        if "TOTAL" in stdout:
            for line in stdout.split('\n'):
                if "TOTAL" in line:
                    print(f"📊 Coverage: {line}")
                    break
        
        print("\n📚 Coverage report generated in htmlcov/")
        print("🌐 Open htmlcov/index.html to view detailed coverage")
        
        return 0
    else:
        print(f"❌ Tests failed: {stderr}")
        return 1

if __name__ == "__main__":
    sys.exit(main())