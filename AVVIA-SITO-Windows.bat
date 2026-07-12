@echo off
echo === UP Immobiliare - avvio sito in locale ===
where node >nul 2>nul || (echo Installa prima Node.js da https://nodejs.org e riavvia questo file. & pause & exit /b)
call npm install
call npm run dev
pause
