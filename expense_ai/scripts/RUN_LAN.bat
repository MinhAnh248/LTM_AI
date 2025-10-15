@echo off
title Expense AI - LAN Mode
color 0B

echo.
echo ========================================
echo   EXPENSE AI - LAN MODE
echo ========================================
echo.
echo Chay tren mang noi bo (LAN)
echo Moi nguoi trong cung WiFi co the truy cap
echo.

REM Kill old processes
echo [1/3] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend...
start "Backend API" cmd /k "title Backend API && cd /d %~dp0.. && python api_server.py"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend...
start "Frontend React" cmd /k "title Frontend React && cd /d %~dp0..\frontend && npm start"
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   LAN MODE STARTED!
echo ========================================
echo.
echo Truy cap tu bat ky thiet bi nao trong mang:
echo.
echo [+] Frontend:  http://10.67.148.12:3000
echo [+] Backend:   http://10.67.148.12:5000
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================
timeout /t 3 /nobreak >nul

start http://10.67.148.12:3000

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
