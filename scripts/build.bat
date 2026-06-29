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

endlocal
