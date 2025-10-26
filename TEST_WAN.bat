@echo off
title Test WAN
color 0A

echo.
echo ========================================
echo   TESTING WAN BACKEND
echo ========================================
echo.

echo Testing health endpoint...
curl https://ltm-ai.onrender.com/api/health

echo.
echo.
echo Testing root endpoint...
curl https://ltm-ai.onrender.com/

echo.
echo.
echo ========================================
echo   OPENING WAN FRONTEND
echo ========================================
echo.

start https://projectname04.netlify.app

echo.
echo WAN URLs:
echo [+] Frontend: https://projectname04.netlify.app
echo [+] Backend:  https://ltm-ai.onrender.com
echo.
pause
