@echo off
title Expense AI - LAN Mode (No Auth)
color 0B

echo.
echo ========================================
echo   EXPENSE AI - LAN MODE (NO LOGIN)
echo ========================================
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set IP=%%a
set IP=%IP:~1%

REM Kill old processes
echo [1/3] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0 && python api_server.py"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend...
start "Frontend React" cmd /k "title Frontend React && cd /d %~dp0frontend && npm install && set BROWSER=none && npm start"
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   LAN MODE STARTED - NO LOGIN REQUIRED
echo ========================================
echo.
echo [+] Frontend:  http://%IP%:3000
echo [+] Backend:   http://%IP%:5000
echo.
echo Khong can dang nhap - Truy cap truc tiep!
echo.
echo ========================================
timeout /t 3 /nobreak >nul

start http://localhost:3000

echo.
echo [+] Browser opened
echo.
echo Press any key to STOP all services...
pause >nul

echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1

echo.
echo All services stopped!
echo.
pause
