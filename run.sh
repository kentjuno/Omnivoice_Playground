#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Clear screen
clear

echo "======================================================================"
echo "         STUDIO NOIR - OMNIVOICE PLAYGROUND STANDALONE SYSTEM"
echo "======================================================================"
echo "  Cinematic Audio-Video Automated Orchestration Sandbox Launcher"
echo "======================================================================"
echo ""

# 1. Verify Python Installation
echo "[SYSTEM] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 was not found in your system PATH!"
    echo "Please install Python 3.9 - 3.11 and try again."
    exit 1
fi

# 2. Verify Node.js Installation
echo "[SYSTEM] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js was not found in your system PATH!"
    echo "Please install Node.js (v18+) to compile the premium frontend interface."
    exit 1
fi

# 3. Setup Python Virtual Environment (venv)
echo ""
echo "[VENV] Setting up isolated Python Environment..."
if [ ! -d "backend/.venv" ]; then
    echo "[VENV] Creating new virtual environment at backend/.venv..."
    python3 -m venv backend/.venv
fi

echo "[VENV] Activating virtual environment..."
source backend/.venv/bin/activate

echo "[VENV] Upgrading package manager (pip)..."
python3 -m pip install --upgrade pip

echo "[VENV] Installing backend machine learning dependencies..."
echo "Note: This includes OmniVoice, PyTorch and transformers."
pip install -r backend/requirements.txt

# 4. Build Frontend compiled assets if not already built
echo ""
echo "[FRONTEND] Checking React compiled build..."
if [ ! -d "frontend/dist" ]; then
    echo "[FRONTEND] React production build not found. Initializing setup..."
    cd frontend
    echo "[FRONTEND] Installing node modules..."
    npm install --legacy-peer-deps
    echo "[FRONTEND] Compiling high-fidelity cinematic React code..."
    npm run build
    cd ..
else
    echo "[FRONTEND] Production build is already compiled. Ready to serve!"
fi

# 5. Launch Cinematic Server
echo ""
echo "======================================================================"
echo " OMNIVOICE PLAYGROUND IS READY TO RUN!"
echo "======================================================================"
echo " * Host: http://localhost:8000"
echo " * Models are downloaded automatically using standard HuggingFace Cache."
echo " * Make sure your internet connection is active on first run."
echo "======================================================================"
echo ""

# Open browser automatically in parallel based on OS
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8000" &
elif command -v open &> /dev/null; then
    open "http://localhost:8000" &
fi

# Start Uvicorn backend
cd backend
python main.py
