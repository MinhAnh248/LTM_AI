@echo off
echo ========================================
echo Cloudflare Tunnel Setup
echo ========================================
echo.
echo Download cloudflared from:
echo https://github.com/cloudflare/cloudflared/releases
echo.
echo After download, run:
echo   cloudflared tunnel --url http://localhost:5000
echo.
echo Then copy the URL (https://xxx.trycloudflare.com)
echo and update frontend/src/services/api.js
echo.
pause

start https://github.com/cloudflare/cloudflared/releases
