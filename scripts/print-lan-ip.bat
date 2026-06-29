@echo off
setlocal

rem Print LAN URLs for the local Curvoteca dev/preview server.
rem Useful when Chrome DevTools is attached to a phone on the same network.

set "PORT=4321"

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "LAN_IP=%%a"
  goto :got_ip
)
:got_ip

echo.
echo Curvoteca LAN URLs:
echo   http://localhost:%PORT%/
if defined LAN_IP echo   http://%LAN_IP:~1%:%PORT%/
echo.
echo Tip: in desktop Chrome open chrome://inspect to attach DevTools
echo to any Chrome tab on a phone on the same Wi-Fi.
echo.

endlocal
