@echo off
title Expense AI - WAN Mode (Internet Access)
color 0A

echo.
echo ========================================
echo   EXPENSE AI - WAN MODE
echo ========================================
echo.
echo Chay tren Internet (WAN)
echo Moi nguoi co the truy cap qua Internet
echo.

REM Kill old processes
echo [1/4] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Check ngrok
echo [2/4] Checking ngrok...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [!] Ngrok chua duoc cai dat!
    echo.
    echo De chay WAN mode, ban can:
    echo 1. Tai ngrok: https://ngrok.com/download
    echo 2. Giai nen va them vao PATH
    echo 3. Dang ky tai khoan: https://dashboard.ngrok.com/signup
    echo 4. Chay: ngrok config add-authtoken YOUR_TOKEN
    echo.
    pause
    exit /b 1
)

REM Start Backend
echo [3/4] Starting Backend...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0.. && python api_server.py"
timeout /t 5 /nobreak >nul

REM Start ngrok tunnel
echo [4/4] Starting ngrok tunnel...
start "Ngrok Tunnel" cmd /k "title Ngrok Tunnel && ngrok http 5000"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   WAN MODE STARTED!
echo ========================================
echo.
echo Backend dang chay tren: http://localhost:5000
echo.
echo De lay URL WAN:
echo 1. Mo cua so "Ngrok Tunnel"
echo 2. Tim dong "Forwarding"
echo 3. Copy URL (vi du: https://xxxx-xx-xx-xx-xx.ngrok-free.app)
echo 4. Cap nhat URL nay vao frontend
echo.
echo Hoac truy cap: http://localhost:4040 (Ngrok Dashboard)
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
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4040') do taskkill /F /PID %%a >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1

echo.
echo All services stopped!
echo.
pause