@echo off
echo ========================================
echo   Instalacion de Dependencias
echo   Semana de Mecatronica 2025
echo ========================================
echo.

REM Verificar si Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado.
    echo.
    echo Por favor instala Node.js primero:
    echo 1. Visita: https://nodejs.org/
    echo 2. Descarga la version LTS
    echo 3. Ejecuta el instalador
    echo 4. Asegurate de marcar "Add to PATH"
    echo 5. Reinicia la terminal despues de instalar
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detectado
node --version
echo.

REM Verificar si npm esta disponible
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm no esta disponible.
    echo npm deberia venir con Node.js.
    pause
    exit /b 1
)

echo [OK] npm detectado
npm --version
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

echo Instalando dependencias del proyecto...
echo Esto puede tardar unos minutos...
echo.

npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   [EXITO] Dependencias instaladas!
    echo ========================================
    echo.
    echo Ahora puedes iniciar el servidor con:
    echo   npm start
    echo.
    echo O directamente:
    echo   node server.js
    echo.
) else (
    echo.
    echo ========================================
    echo   [ERROR] Error al instalar dependencias
    echo ========================================
    echo.
)

pause
