@echo off
echo ========================================
echo   AI EXPENSE MANAGER - STARTING...
echo ========================================
echo.

echo [1/2] Starting Backend (Flask API)...
start "Backend API" cmd /k "cd /d %~dp0 && python api_server.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (React)...
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
