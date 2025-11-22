@echo off
echo ===================================
echo Starting Backend + Frontend
echo ===================================

REM ===== BACKEND =====
cd /d "C:\Users\IKBEL\Documents\GitHub\Projet_Web\backend"
start cmd /k "python manage.py runserver"

timeout /t 3 > nul

REM ===== FRONTEND =====
cd /d "C:\Users\IKBEL\Documents\GitHub\Projet_Web\frontend"
start cmd /k "npm run dev"

timeout /t 2 > nul

REM ===== OPEN BROWSER =====
start http://localhost:5173
