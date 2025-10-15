@echo off
title Test Backend API
color 0B

echo.
echo ========================================
echo   TESTING BACKEND API
echo ========================================
echo.

cd /d %~dp0..

echo [1/3] Starting Backend...
start "Backend Test" cmd /k "python api_server.py"
timeout /t 5 /nobreak >nul

echo [2/3] Testing Endpoints...
echo.

curl -X GET http://localhost:5000/api/health
echo.
echo.

echo [3/3] Testing Login...
curl -X POST http://localhost:5000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"123456\"}"
echo.
echo.

echo ========================================
echo   TEST COMPLETED!
echo ========================================
echo.
echo If you see JSON responses above, backend is working!
echo.
pause
