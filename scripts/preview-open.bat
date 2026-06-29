@echo off
setlocal

set "PROJECT_DIR=%~dp0.."
cd /d "%PROJECT_DIR%"

if not exist node_modules (
  echo Installing packages...
  call npm.cmd install
)

echo Building Curvoteca...
call npm.cmd run build
if errorlevel 1 exit /b %errorlevel%

echo Starting Curvoteca preview server...
start "Curvoteca Preview Server" cmd /k "cd /d ""%PROJECT_DIR%"" && npm.cmd run preview -- --port 4321"

timeout /t 3 /nobreak >nul
start "" "http://localhost:4321/"

endlocal
