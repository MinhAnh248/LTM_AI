@echo off
echo Starting LAN Network Servers...
echo.

echo Starting Admin Server (LAN)...
start "Admin Server" cmd /k "cd /d C:\LTMang_AI\LAN && python admin_server.py"

timeout /t 3

echo Starting Public Server...
start "Public Server" cmd /k "cd /d C:\LTMang_AI\LAN && python public_server.py"

echo.
echo Servers started!
echo Admin (LAN): http://localhost:5000
echo Public: http://localhost:8000
pause