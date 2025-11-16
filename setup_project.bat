@echo off
rem ===========================================
rem Projet_Web full setup: backend + frontend
rem ===========================================

rem -------- Backend setup --------
echo.
echo ===============================
echo Setting up backend...
echo ===============================
echo.

cd backend

rem Activate virtual environment
call ..\.venv\Scripts\activate.bat

rem Install Python dependencies
echo Installing Python packages...
pip install -r requirements.txt

rem Apply database migrations
echo Applying migrations...
python manage.py migrate

rem Create superuser (interactive)
echo.
echo Creating superuser (if you already have one, just skip)
python manage.py createsuperuser

rem Start Django backend server in new window
echo.
echo Starting Django backend server at http://127.0.0.1:8000/
start cmd /k "python manage.py runserver"

rem -------- Frontend setup --------
echo.
echo ===============================
echo Setting up frontend...
echo ===============================
echo.

cd ..\frontend

rem Install Node.js dependencies
echo Installing Node.js packages...
npm install

rem Start frontend dev server in new window
echo.
echo Starting frontend dev server (Vite) at http://localhost:5173/
start cmd /k "npm run dev"

rem Wait a few seconds for server to start
timeout /t 5 /nobreak > NUL

rem Open default browser automatically to frontend URL
start http://localhost:5173/

echo.
echo Projet_Web setup complete! Backend and frontend are running.
pause
