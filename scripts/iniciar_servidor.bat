@echo off
echo ========================================
echo   Iniciando Servidor
echo   Semana de Mecatronica 2025
echo ========================================
echo.

REM Verificar si Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Por favor instala Node.js primero.
    pause
    exit /b 1
)

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si las dependencias estan instaladas
if not exist "node_modules\" (
    echo [ADVERTENCIA] Las dependencias no estan instaladas.
    echo Ejecutando npm install...
    echo.
    npm install
    echo.
)

echo Iniciando servidor en http://localhost:3000
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.
echo ========================================
echo.

node server.js
