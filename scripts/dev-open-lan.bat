@echo off
setlocal

set "PROJECT_DIR=%~dp0.."
cd /d "%PROJECT_DIR%"

if not exist node_modules (
  echo Installing packages...
  call npm.cmd install
)

rem Get the first non-loopback IPv4 address.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "LAN_IP=%%a"
  goto :got_ip
)
:got_ip

echo.
echo Starting Curvoteca dev server on the LAN...
echo Open one of these in any browser on the same network:
echo   http://localhost:4321/
if defined LAN_IP echo   http://%LAN_IP:~1%:4321/
echo.

start "Curvoteca Dev Server (LAN)" cmd /k "cd /d ""%PROJECT_DIR%"" && npm.cmd run dev -- --host 0.0.0.0 --port 4321"

timeout /t 3 /nobreak >nul
start "" "http://localhost:4321/"

endlocal
