@echo off
title Expense AI - WAN Access
color 0A

echo.
echo ========================================
echo   EXPENSE AI - WAN ACCESS
echo ========================================
echo.

REM Kill old load test
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8090') do taskkill /F /PID %%a >nul 2>&1

echo Starting Load Test Monitor...
start "Load Test" cmd /k "cd /d %~dp0.. && python -m locust -f tools\load_test.py --host=https://ltm-ai.onrender.com --web-port=8090"
timeout /t 3 /nobreak >nul

echo.
echo [+] Frontend WAN:     https://projectname04.netlify.app
echo [+] Backend WAN:      https://ltm-ai.onrender.com
echo [+] Load Test UI:     http://localhost:8090
echo.
echo Login: admin@example.com / 123456
echo.
echo ========================================
echo   OPENING BROWSERS...
echo ========================================

start https://projectname04.netlify.app
start http://localhost:8090

echo.
echo [+] Browsers opened!
echo.
echo Press any key to STOP load test...
pause >nul

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8090') do taskkill /F /PID %%a >nul 2>&1
echo Load test stopped!
pause
