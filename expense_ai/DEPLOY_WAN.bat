@echo off
title Deploy Expense AI to WAN
color 0E

echo.
echo ========================================
echo   DEPLOY EXPENSE AI TO WAN (INTERNET)
echo ========================================
echo.
echo Chon phuong an deploy:
echo.
echo 1. Render (Khuyên dùng - Miễn phí, ổn định)
echo 2. Ngrok (Test nhanh - Cần giữ máy bật)
echo 3. Railway (Miễn phí, nhanh)
echo 4. Vercel (Miễn phí, rất nhanh)
echo.
set /p choice="Nhap lua chon (1-4): "

if "%choice%"=="1" goto render
if "%choice%"=="2" goto ngrok
if "%choice%"=="3" goto railway
if "%choice%"=="4" goto vercel

:render
echo.
echo ========================================
echo   DEPLOY TO RENDER
echo ========================================
echo.
echo Buoc 1: Push code len GitHub
echo Buoc 2: Truy cap https://render.com
echo Buoc 3: Dang nhap bang GitHub
echo Buoc 4: New Web Service
echo Buoc 5: Chon repo expense-ai
echo Buoc 6: Cau hinh:
echo    - Build: pip install -r requirements.txt
echo    - Start: gunicorn api_server:app
echo Buoc 7: Deploy!
echo.
echo URL: https://expense-ai.onrender.com
echo.
pause
goto end

:ngrok
echo.
echo ========================================
echo   DEPLOY WITH NGROK (QUICK TEST)
echo ========================================
echo.
echo [1/3] Checking ngrok...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo Ngrok chua cai dat!
    echo Download tai: https://ngrok.com/download
    pause
    goto end
)

echo [2/3] Starting backend...
start "Backend" cmd /k "cd /d %~dp0 && python api_server.py"
timeout /t 5 /nobreak >nul

echo [3/3] Creating public URL...
echo.
echo Dang tao URL cong khai...
echo.
ngrok http 5000

goto end

:railway
echo.
echo ========================================
echo   DEPLOY TO RAILWAY
echo ========================================
echo.
echo Buoc 1: Truy cap https://railway.app
echo Buoc 2: Dang nhap GitHub
echo Buoc 3: New Project - Deploy from GitHub
echo Buoc 4: Chon repo expense-ai
echo Buoc 5: Railway tu dong deploy!
echo.
echo URL: https://expense-ai-production.up.railway.app
echo.
pause
goto end

:vercel
echo.
echo ========================================
echo   DEPLOY TO VERCEL
echo ========================================
echo.
echo [1/2] Installing Vercel CLI...
call npm install -g vercel

echo [2/2] Deploying...
cd /d %~dp0
vercel

goto end

:end
echo.
echo ========================================
echo   HOAN THANH!
echo ========================================
echo.
pause
