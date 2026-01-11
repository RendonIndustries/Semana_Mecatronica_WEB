@echo off
echo ========================================
echo   Verificacion de Instalacion Node.js
echo ========================================
echo.

echo Verificando si Node.js esta instalado...
echo.

REM Verificar ruta por defecto
if exist "C:\Program Files\nodejs\node.exe" (
    echo [OK] Node.js encontrado en: C:\Program Files\nodejs\
    echo.
    echo Intentando ejecutar directamente...
    "C:\Program Files\nodejs\node.exe" --version
    echo.
    "C:\Program Files\nodejs\npm.cmd" --version
    echo.
) else (
    echo [ERROR] Node.js no encontrado en la ruta por defecto.
    echo.
)

echo Verificando variables de entorno PATH...
echo.
echo | set /p="PATH actual: "
echo %PATH% | findstr /i "nodejs" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js esta en el PATH
) else (
    echo [ADVERTENCIA] Node.js NO esta en el PATH
    echo.
    echo Necesitas agregar al PATH:
    echo C:\Program Files\nodejs\
)

echo.
echo ========================================
echo.

REM Intentar ejecutar node directamente
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [EXITO] Node.js esta disponible!
    node --version
    npm --version
) else (
    echo [INFO] Node.js no se encuentra en el PATH
    echo.
    echo SOLUCION:
    echo 1. Cierra COMPLETAMENTE esta ventana
    echo 2. Cierra TODAS las ventanas de PowerShell/CMD
    echo 3. Abre una NUEVA terminal
    echo 4. Intenta de nuevo: npm --version
    echo.
    echo Si aun no funciona, reinicia tu computadora.
)

echo.
pause
