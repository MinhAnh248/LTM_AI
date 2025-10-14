@echo off
echo ========================================
echo Starting Expense AI - Full Stack
echo ========================================
echo.
echo Backend: http://10.67.148.12:5000
echo Frontend: http://10.67.148.12:3000
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

REM Kill existing processes on ports 5000 and 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul

timeout /t 2 /nobreak

REM Start backend in new window
start "Backend API" cmd /k "cd /d %~dp0 && python api_server.py"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
start "Frontend React" cmd /k "cd /d %~dp0frontend && set HOST=0.0.0.0 && npm start"

echo.
echo Both services are starting...
echo Check the new windows for logs
echo.
pause
