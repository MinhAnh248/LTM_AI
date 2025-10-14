@echo off
title Expense AI - Complete Setup
color 0A

echo.
echo ========================================
echo   EXPENSE AI - ONE CLICK SETUP
echo ========================================
echo.

REM Kill existing processes
echo [1/6] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/6] Starting Backend (Flask)...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0 && python api_server.py"
timeout /t 5 /nobreak >nul

REM Skip Cloudflare - Use LAN instead
echo [3/6] Configuring for LAN access...
cd frontend\src\services
powershell -Command "(Get-Content api.js) -replace \"const MODE = '[^']*'\", \"const MODE = 'LAN'\" | Set-Content api.js"
cd ..\..\..
timeout /t 1 /nobreak >nul

REM Start Frontend
echo [4/6] Starting Frontend (React)...
start "Frontend React" cmd /k "title Frontend React && cd /d %~dp0frontend && set HOST=0.0.0.0 && npm start"
timeout /t 10 /nobreak >nul

REM Start Load Test UI
echo [5/6] Starting Load Test UI (Locust)...
start "Load Test" cmd /k "title Load Test && cd /d %~dp0 && python -m locust -f load_test.py --host=http://10.67.148.12:5000"
timeout /t 3 /nobreak >nul

echo [6/6] Opening browsers...
timeout /t 5 /nobreak >nul
start http://10.67.148.12:3000
start http://localhost:8089

echo.
echo ========================================
echo   ALL SERVICES STARTED!
echo ========================================
echo.
echo [+] Backend API:     http://10.67.148.12:5000
echo [+] Frontend:        http://10.67.148.12:3000
echo [+] Load Test UI:    http://localhost:8089
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================
echo   LOAD TEST INSTRUCTIONS
echo ========================================
echo.
echo 1. Go to: http://localhost:8089
echo 2. Host is auto-set to: http://10.67.148.12:5000
echo 3. Number of users: 100
echo 4. Spawn rate: 10
echo 5. Click "Start swarming"
echo.
echo ========================================
echo.
echo Press any key to STOP all services...
pause >nul

echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8089') do taskkill /F /PID %%a >nul 2>&1

echo.
echo All services stopped!
echo.
pause
