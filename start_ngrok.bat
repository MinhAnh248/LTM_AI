@echo off
echo ========================================
echo Starting Expense AI with Ngrok (WAN)
echo ========================================
echo.

REM Start backend
start "Backend API" cmd /k "cd /d %~dp0 && python api_server.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak

REM Start ngrok
start "Ngrok Tunnel" cmd /k "ngrok http 5000"

echo.
echo ========================================
echo IMPORTANT: Copy the ngrok URL and update api.js
echo ========================================
echo.
echo 1. Copy the https://xxxxx.ngrok-free.dev URL from Ngrok window
echo 2. Open frontend\src\services\api.js
echo 3. Update: const MODE = 'NGROK'
echo 4. Update: NGROK: 'https://YOUR-NGROK-URL/api'
echo 5. Start frontend: cd frontend && npm start
echo.
pause
