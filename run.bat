@echo off
title Studio Noir - OmniVoice Playground Launcher
chcp 65001 > nul
cls

echo ======================================================================
echo          STUDIO NOIR - OMNIVOICE PLAYGROUND STANDALONE SYSTEM
echo ======================================================================
echo  Cinematic Audio-Video Automated Orchestration Sandbox Launcher
echo ======================================================================
echo.

:: 1. Verify Python Installation
echo [SYSTEM] Checking Python installation...
set "PYTHON_EXE="
if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe" (
    set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe"
    echo [SYSTEM] Found local stable Python 3.12 at %USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe
) else if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python310\python.exe" (
    set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Programs\Python\Python310\python.exe"
    echo [SYSTEM] Found local stable Python 3.10 at %USERPROFILE%\AppData\Local\Programs\Python\Python310\python.exe
) else (
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        set "PYTHON_EXE=python"
        echo [SYSTEM] Using default system Python.
    )
)

if not defined PYTHON_EXE (
    echo [ERROR] Python was not found on your system!
    echo Please install Python 3.10 or 3.12 and ensure it is available.
    echo Cai Python vo, khong biet cai thi hoi A.I cai Python lam sao, nho la 2 ban 3.10 hoac 3.12 nha.
    pause
    exit /b 1
)

:: 2. Verify Node.js Installation
echo [SYSTEM] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found in your system PATH!
    echo Please install Node.js v18+ to compile the premium frontend interface.
    pause
    exit /b 1
)

:: 3. Setup Python Virtual Environment (venv)
echo.
echo [VENV] Setting up isolated Python Environment...
if not exist "backend\.venv" (
    echo [VENV] Creating new virtual environment at backend\.venv using: "%PYTHON_EXE%"
    "%PYTHON_EXE%" -m venv backend\.venv
)

echo [VENV] Activating virtual environment...
call backend\.venv\Scripts\activate.bat

echo [VENV] Upgrading package manager (pip)...
python -m pip install --upgrade pip

echo [VENV] Installing backend machine learning dependencies...
echo Note: This includes OmniVoice, PyTorch and transformers.
pip install -r backend/requirements.txt

:: 4. Build Frontend compiled assets if not already built
echo.
echo [FRONTEND] Checking React compiled build...
if not exist "frontend\dist" (
    echo [FRONTEND] React production build not found. Initializing setup...
    cd frontend
    echo [FRONTEND] Installing node modules...
    call npm install --legacy-peer-deps
    echo [FRONTEND] Compiling high-fidelity cinematic React code...
    call npm run build
    cd ..
) else (
    echo [FRONTEND] Production build is already compiled. Ready to serve!
)

:: 5. Launch Cinematic Server
echo.
echo ======================================================================
echo  OMNIVOICE PLAYGROUND IS READY TO RUN!
echo ======================================================================
echo  * Host: http://localhost:8000
echo  * Models are downloaded automatically using standard HuggingFace Cache.
echo  * Make sure your internet connection is active on first run.
echo ======================================================================
echo.

:: Open browser automatically in parallel
start "" "http://localhost:8000"

:: Start Uvicorn backend
cd backend
python main.py

pause
