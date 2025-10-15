@echo off
title Deploy Backend to Render
color 0E

echo.
echo ========================================
echo   DEPLOY BACKEND TO RENDER.COM
echo ========================================
echo.

cd /d %~dp0..

echo [1/4] Checking Git status...
git status
echo.

echo [2/4] Adding all changes...
git add .
echo.

echo [3/4] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update backend with full features

git commit -m "%commit_msg%"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   PUSH COMPLETED!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://dashboard.render.com
echo 2. Select service: expense-ai
echo 3. Click: Manual Deploy ^> Deploy latest commit
echo 4. Wait 2-3 minutes for deployment
echo.
echo Backend URL: https://ltm-ai.onrender.com
echo.
pause
