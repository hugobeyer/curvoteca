@echo off
setlocal

set "PROJECT_DIR=%~dp0.."
cd /d "%PROJECT_DIR%"

if not exist node_modules (
  echo Installing packages...
  call npm.cmd install
)

echo Starting Curvoteca dev server...
start "Curvoteca Dev Server" cmd /k "cd /d ""%PROJECT_DIR%"" && npm.cmd run dev -- --port 4321"

timeout /t 3 /nobreak >nul
start "" "http://localhost:4321/"

endlocal
