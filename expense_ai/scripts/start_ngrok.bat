@echo off
echo ========================================
echo   AI EXPENSE MANAGER - NGROK (WAN)
echo ========================================
echo.

echo [1/3] Starting Backend...
start "Backend API" cmd /k "python api_server.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Ngrok tunnel...
start "Ngrok Tunnel" cmd /k "ngrok http 5000"
timeout /t 3 /nobreak >nul

echo [3/3] Opening Ngrok dashboard...
start http://localhost:4040

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo   1. Check Ngrok URL at: http://localhost:4040
echo   2. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
echo   3. Update frontend API URL with that URL
echo ========================================
echo.
echo Press any key to exit...
pause >nul
