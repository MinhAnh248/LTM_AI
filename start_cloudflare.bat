@echo off
echo ========================================
echo Starting Cloudflare Tunnel
echo ========================================
echo.
echo Backend must be running on port 5000
echo.
echo Copy the URL (https://xxx.trycloudflare.com)
echo and update frontend/src/services/api.js
echo.
echo ========================================
echo.

cloudflared.exe tunnel --url http://localhost:5000

pause
