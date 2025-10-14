@echo off
echo ========================================
echo Configuring Windows Firewall
echo ========================================
echo.
echo This will allow Flask (port 5000) and React (port 3000) through firewall
echo.

REM Allow Flask backend port 5000
netsh advfirewall firewall add rule name="Expense AI Backend" dir=in action=allow protocol=TCP localport=5000

REM Allow React frontend port 3000
netsh advfirewall firewall add rule name="Expense AI Frontend" dir=in action=allow protocol=TCP localport=3000

echo.
echo Firewall rules added successfully!
echo.
pause
