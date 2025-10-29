@echo off
title Expense AI - LAN Network Mode
color 0B

echo.
echo ========================================
echo   EXPENSE AI - LAN NETWORK MODE
echo ========================================
echo.

REM Kill old processes
echo [1/3] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Get local IP
echo [2/3] Getting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set LOCAL_IP=%%a
set LOCAL_IP=%LOCAL_IP:~1%
echo Local IP: %LOCAL_IP%

REM Start Admin Server (LAN only)
echo [3/3] Starting servers...
echo.
echo Starting Admin Server (LAN Access Only)...
start "Admin Server" cmd /k "title Admin Server (LAN) && cd /d %~dp0 && python admin_server.py"
timeout /t 3 /nobreak >nul

echo Starting Public Server (All Devices)...
start "Public Server" cmd /k "title Public Server && cd /d %~dp0 && python public_server.py"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   LAN NETWORK MODE STARTED!
echo ========================================
echo.
echo 🔒 ADMIN SERVER (LAN Only):
echo    - URL: http://%LOCAL_IP%:5000
echo    - Access: Chi may trong LAN
echo    - Features: Full admin control
echo.
echo 🌐 PUBLIC SERVER (All Devices):
echo    - URL: http://%LOCAL_IP%:8000
echo    - Access: Tat ca thiet bi
echo    - Features: Limited access, rate limited
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================
timeout /t 3 /nobreak >nul

start http://localhost:5000

echo.
echo [+] Browser opened
echo.
echo Press any key to STOP all services...
pause >nul

echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1

echo.
echo All services stopped!
echo.
pause
