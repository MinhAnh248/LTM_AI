@echo off
title Deploy to Render (FREE)
color 0A

echo ========================================
echo   Deploy to Render - 100%% FREE
echo ========================================
echo.

REM Initialize git if needed
if not exist .git (
    echo [1/3] Initializing git...
    git init
    git add .
    git commit -m "Deploy to Render"
    git branch -M main
    echo.
)

echo [2/3] Opening GitHub and Render...
echo.
echo STEP 1: Create GitHub repo
echo   - Go to: https://github.com/new
echo   - Name: expense-ai
echo   - Click "Create repository"
echo.
echo STEP 2: Push code to GitHub
echo   Run these commands:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/expense-ai.git
echo   git push -u origin main
echo.
echo STEP 3: Deploy on Render
echo   - Go to: https://render.com
echo   - Sign up with GitHub
echo   - Click "New +" -^> "Web Service"
echo   - Connect your GitHub repo
echo   - Settings:
echo     * Name: expense-ai
echo     * Build Command: pip install -r requirements.txt
echo     * Start Command: python api_server.py
echo   - Click "Create Web Service"
echo.
echo STEP 4: Get your URL
echo   - Wait 2-3 minutes for deployment
echo   - Copy URL: https://expense-ai.onrender.com
echo.
echo STEP 5: Update frontend
echo   - Open: frontend\src\services\api.js
echo   - Change: NGROK: 'https://expense-ai.onrender.com/api'
echo   - Change: const MODE = 'NGROK'
echo.
echo [3/3] Opening browsers...
timeout /t 2 /nobreak >nul

start https://github.com/new
timeout /t 2 /nobreak >nul
start https://render.com

echo.
echo ========================================
echo   Follow the steps above!
echo ========================================
echo.
pause
