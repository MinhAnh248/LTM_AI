@echo off
title Deploy WAN to Render
color 0E

echo.
echo ========================================
echo   DEPLOY WAN MODE TO RENDER
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Checking files...
if not exist "wan_auth_server.py" (
    echo ERROR: wan_auth_server.py not found!
    pause
    exit
)

echo [2/3] Git operations...
git add .
git commit -m "Deploy WAN mode with MFA authentication"
git push origin main

echo.
echo [3/3] Deploy instructions...
echo.
echo ========================================
echo   NEXT STEPS ON RENDER.COM
echo ========================================
echo.
echo 1. Go to: https://render.com
echo 2. New + → Web Service
echo 3. Select repo: LTM_AI
echo 4. Configure:
echo    - Name: expense-ai-wan
echo    - Root Directory: WAN
echo    - Build: pip install -r requirements.txt
echo    - Start: gunicorn wan_auth_server:app
echo    - Instance: Free
echo 5. Deploy!
echo.
echo ========================================
echo.

start https://render.com

pause
