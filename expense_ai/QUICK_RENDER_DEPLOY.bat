@echo off
title Quick Deploy to Render
color 0A

echo.
echo ========================================
echo   QUICK DEPLOY TO RENDER
echo ========================================
echo.

echo [1/5] Checking files...
if not exist "api_server.py" (
    echo ERROR: api_server.py not found!
    pause
    exit
)
if not exist "requirements.txt" (
    echo ERROR: requirements.txt not found!
    pause
    exit
)
echo Files OK!

echo.
echo [2/5] Testing locally...
start "Test Backend" cmd /k "python api_server.py"
timeout /t 5 /nobreak >nul
curl http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo WARNING: Local test failed!
    pause
)

echo.
echo [3/5] Git status...
git status

echo.
echo [4/5] Commit and push...
git add .
git commit -m "Deploy to Render - %date% %time%"
git push origin main

echo.
echo [5/5] Deploy instructions...
echo.
echo ========================================
echo   NEXT STEPS ON RENDER.COM
echo ========================================
echo.
echo 1. Go to: https://render.com
echo 2. Login with GitHub
echo 3. New + → Web Service
echo 4. Select repo: expense-ai
echo 5. Configure:
echo    - Name: expense-ai-backend
echo    - Region: Singapore
echo    - Build: pip install -r requirements.txt
echo    - Start: gunicorn api_server:app
echo    - Instance: Free
echo 6. Click "Create Web Service"
echo 7. Wait 3-5 minutes
echo 8. Get URL: https://expense-ai-backend.onrender.com
echo.
echo ========================================
echo.

start https://render.com

echo Browser opened to Render.com
echo.
pause
