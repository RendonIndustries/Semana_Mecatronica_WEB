# Script PowerShell para iniciar el servidor - Semana de Mecatrónica 2025

# Agregar Node.js al PATH de esta sesión
$env:Path += ";C:\Program Files\nodejs\"

# Cambiar al directorio del script
Set-Location $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidor" -ForegroundColor Cyan
Write-Host "  Semana de Mecatronica 2025" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js no encontrado" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "[OK] npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm no encontrado" -ForegroundColor Red
    pause
    exit 1
}

# Verificar dependencias
if (-not (Test-Path "node_modules\express")) {
    Write-Host "[ADVERTENCIA] Dependencias no instaladas" -ForegroundColor Yellow
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Error al instalar dependencias" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "Iniciando servidor en http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener el servidor, presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar el servidor
node server.js
