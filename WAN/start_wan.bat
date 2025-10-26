@echo off
echo 🌐 Starting WAN Server...
echo.

cd /d C:\LTMang_AI\WAN
C:\LTMang_AI\.venv\Scripts\activate && python wan_server.py

pause