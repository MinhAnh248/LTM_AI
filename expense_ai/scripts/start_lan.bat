@echo off
echo ========================================
echo   AI EXPENSE MANAGER - LAN MODE
echo ========================================
echo.

echo [*] Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set IP=%%a
set IP=%IP:~1%
echo [+] Your IP: %IP%

echo.
echo [1/2] Starting Backend on %IP%:5000...
start "Backend API" cmd /k "python api_server.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "Frontend React" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo   Backend:  http://%IP%:5000
echo   Frontend: http://%IP%:3000
echo ========================================
echo.
echo Share this URL with your team:
echo   http://%IP%:3000
echo.
echo Press any key to exit...
pause >nul
