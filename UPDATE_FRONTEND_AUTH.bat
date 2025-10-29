@echo off
title Update Frontend with Auth
color 0A

echo.
echo ========================================
echo   UPDATE FRONTEND WITH AUTH
echo ========================================
echo.

cd /d %~dp0\expense_ai\frontend

echo [1/2] Building frontend...
call npm run build

echo.
echo [2/2] Instructions to deploy:
echo.
echo 1. Go to: https://app.netlify.com
echo 2. Select your site: courageous-manatee-534de7
echo 3. Deploys -^> Drag and drop "build" folder
echo 4. Wait 1-2 minutes
echo.
echo Build folder location:
echo %cd%\build
echo.

echo Opening build folder...
start explorer "%cd%\build"

echo.
echo Opening Netlify...
timeout /t 3 /nobreak >nul
start https://app.netlify.com

echo.
pause
