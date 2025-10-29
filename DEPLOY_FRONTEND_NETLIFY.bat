@echo off
title Deploy Frontend to Netlify
color 0A

echo.
echo ========================================
echo   DEPLOY FRONTEND TO NETLIFY
echo ========================================
echo.

cd /d %~dp0\expense_ai\frontend

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Creating .env.production...
echo REACT_APP_API_URL=https://ltm-ai.onrender.com > .env.production

echo.
echo [3/3] Building frontend...
call npm run build

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://app.netlify.com
echo 2. Login with GitHub
echo 3. Click "Add new site" - "Deploy manually"
echo 4. Drag and drop the "build" folder
echo 5. Wait 1-2 minutes
echo 6. Get your URL!
echo.
echo Build folder location:
echo %cd%\build
echo.
echo Opening build folder...
start explorer "%cd%\build"

echo.
echo Opening Netlify...
timeout /t 3 /nobreak >nul
start https://app.netlify.com/drop

echo.
pause
