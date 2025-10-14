@echo off
title Fix and Test
color 0C

echo ========================================
echo   FIXING ISSUES
echo ========================================
echo.

REM Kill all
echo [1/4] Stopping all services...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Start backend
echo [2/4] Starting backend...
start "Backend" cmd /k "cd /d %~dp0 && python api_server.py"
timeout /t 5 /nobreak >nul

REM Test backend
echo [3/4] Testing backend...
curl -s http://localhost:5000/api/summary
echo.

REM Start frontend on LAN
echo [4/4] Starting frontend (LAN mode)...
cd frontend\src\services
powershell -Command "(Get-Content api.js) -replace \"const MODE = '[^']*'\", \"const MODE = 'LAN'\" | Set-Content api.js"
cd ..\..\..
start "Frontend" cmd /k "cd /d %~dp0frontend && set HOST=0.0.0.0 && npm start"

timeout /t 10 /nobreak >nul
start http://10.67.148.12:3000

echo.
echo ========================================
echo   READY FOR LOAD TEST
echo ========================================
echo.
echo Test URL: http://10.67.148.12:5000
echo Frontend: http://10.67.148.12:3000
echo.
echo Run load test with:
echo   python -m locust -f load_test.py --host=http://10.67.148.12:5000
echo.
echo Or open: http://localhost:8089
echo   Host: http://10.67.148.12:5000
echo   Users: 100
echo   Spawn rate: 10
echo.
pause
