@echo off
title Expense AI - Complete System
color 0A

echo.
echo ========================================
echo   EXPENSE AI - ONE CLICK START
echo ========================================
echo.

REM Kill old processes
echo [1/4] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8090') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/4] Starting Backend...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0 && python api_server.py"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/4] Starting Frontend...
start "Frontend React" cmd /k "title Frontend React && cd /d %~dp0frontend && npm start"
timeout /t 10 /nobreak >nul

REM Start Load Test Monitor
echo [4/4] Starting Load Test Monitor...
start "Load Test Monitor" cmd /k "title Load Test Monitor && cd /d %~dp0 && python -m locust -f load_test.py --host=https://ltm-ai.onrender.com --web-port=8090"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   ALL SERVICES STARTED!
echo ========================================
echo.
echo [+] Backend API:      http://10.67.148.12:5000
echo [+] Frontend Web:     http://10.67.148.12:3000
echo [+] Load Test UI:     http://localhost:8090
echo [+] Backend WAN:      https://ltm-ai.onrender.com
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================
echo   OPENING BROWSERS...
echo ========================================
timeout /t 5 /nobreak >nul

start http://10.67.148.12:3000
start http://localhost:8090

echo.
echo [+] Frontend opened
echo [+] Load Test Monitor opened
echo.
echo Press any key to STOP all services...
pause >nul

echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8090') do taskkill /F /PID %%a >nul 2>&1

echo.
echo All services stopped!
echo.
pause
