@echo off
title Deploy to WAN (GitHub + Render)
color 0E

echo.
echo ========================================
echo   DEPLOY TO WAN - GITHUB + RENDER
echo ========================================
echo.

cd /d %~dp0

echo [1/5] Backing up current api_server.py...
copy expense_ai\api_server.py expense_ai\api_server_backup.py >nul 2>&1

echo [2/5] Using simple WAN API server...
copy /Y expense_ai\api_server_wan.py expense_ai\api_server.py

echo [3/5] Adding files to git...
git add .

echo [4/5] Committing changes...
git commit -m "Fix: Simple WAN API server - no dependencies"

echo [5/5] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   PUSH SUCCESSFUL!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://dashboard.render.com
echo 2. Select service: LTM_AI
echo 3. Click "Manual Deploy" button
echo 4. Wait 2-3 minutes for deploy
echo 5. Test: https://ltm-ai.onrender.com/api/health
echo.
echo ========================================
echo.
echo Opening Render Dashboard...
timeout /t 3 /nobreak >nul
start https://dashboard.render.com

echo.
pause
