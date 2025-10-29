@echo off
title Update Netlify with Auth
color 0A

echo.
echo ========================================
echo   UPDATE NETLIFY WITH AUTH
echo ========================================
echo.

cd /d %~dp0\expense_ai\frontend

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Building frontend with Auth...
call npm run build

echo.
echo [3/3] Deploy to Netlify...
echo.
echo ========================================
echo   DEPLOY INSTRUCTIONS
echo ========================================
echo.
echo 1. Go to: https://app.netlify.com
echo 2. Select: courageous-manatee-534de7
echo 3. Deploys -^> Drag and drop "build" folder
echo 4. Wait 1-2 minutes
echo.
echo Build folder: %cd%\build
echo.
echo ========================================
echo.

echo Opening build folder...
start explorer "%cd%\build"

timeout /t 2 /nobreak >nul

echo Opening Netlify...
start https://app.netlify.com/sites/courageous-manatee-534de7/deploys

echo.
pause
