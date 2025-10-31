@echo off
title Expense AI - WAN Mode
color 0A

echo.
echo ========================================
echo   EXPENSE AI - WAN MODE
echo ========================================
echo.

REM Kill old processes
echo [1/2] Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start WAN Server
echo [2/2] Starting WAN Server...
cd /d %~dp0
python expense_wan_server.py

pause