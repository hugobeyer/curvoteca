@echo off
setlocal

REM Curvoteca Lighthouse runner.
REM Usage: scripts\lh.bat
REM Output: dist\..\lh.json + lh-report.html

if not exist dist\index.html (
    echo [lh] dist\index.html not found. Run: npm run build
    exit /b 1
)

REM Start static server on 4321 if not already listening.
netstat -aon | findstr :4321 | findstr LISTENING >nul
if errorlevel 1 (
    echo [lh] starting static server on :4321
    start "curvoteca-serve" /min cmd /c "npx --yes serve dist -l 4321 -L"
    timeout /t 3 /nobreak >nul
) else (
    echo [lh] :4321 already in use, assuming static server
)

REM Wait for server.
echo [lh] waiting for http://127.0.0.1:4321 ...
:waitloop
curl -s -o nul -w "" http://127.0.0.1:4321
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop
)

echo [lh] running Lighthouse (desktop)...
npx --yes lighthouse http://127.0.0.1:4321 ^
  --only-categories=performance ^
  --preset=desktop ^
  --output=json --output=html ^
  --output-path=./lh ^
  --chrome-flags="--headless=new --no-sandbox" ^
  --no-enable-error-reporting ^
  --quiet

if exist lh.report.html (
    echo [lh] done. Open lh.report.html in a browser.
) else (
    echo [lh] done. Read lh.report.json with: node scripts\read-lh.mjs
)

endlocal
