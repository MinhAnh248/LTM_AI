@echo off
title Expense AI - WAN Mode (Cloudflare)
color 0E

echo.
echo ========================================
echo   EXPENSE AI - WAN MODE (CLOUDFLARE)
echo ========================================
echo.

REM Kill old processes
echo [1/3] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Check cloudflared
echo [2/3] Checking cloudflared...
where cloudflared >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [!] Cloudflared chua duoc cai dat!
    echo.
    echo De cai dat:
    echo 1. Tai: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
    echo 2. Cai dat cloudflared
    echo 3. Chay lai script nay
    echo.
    pause
    exit /b 1
)

REM Start Backend
echo [3/3] Starting Backend...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0.. && python api_server.py"
timeout /t 5 /nobreak >nul

REM Start Cloudflare Tunnel
echo Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "title Cloudflare Tunnel && cloudflared tunnel --url http://localhost:5000"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   WAN MODE STARTED!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo.
echo Cloudflare Tunnel dang chay!
echo Mo cua so "Cloudflare Tunnel" de lay URL
echo URL se co dang: https://xxxx.trycloudflare.com
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================

echo.
echo Press any key to STOP all services...
pause >nul

echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1

echo.
echo All services stopped!
echo.
pause