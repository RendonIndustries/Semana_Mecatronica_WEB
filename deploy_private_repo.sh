#!/bin/bash

# Script de despliegue para repositorio PRIVADO de GitHub
# Requiere Personal Access Token

set -e

echo "🚀 Iniciando despliegue automático (Repositorio Privado)..."
echo "📅 $(date)"

# Variables
GITHUB_TOKEN="tu_personal_access_token_aqui"  # CAMBIAR ESTO
REPO_URL="https://github.com/RendonIndustries/Samana_Mecatr-nica_UPIIZ_WEBPAGE.git"
PROJECT_DIR="/var/www/semana-mecatronica"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
LOGS_DIR="$PROJECT_DIR/logs"

# Crear directorios si no existen
mkdir -p "$PROJECT_DIR" "$FRONTEND_DIR" "$BACKEND_DIR" "$LOGS_DIR"

# Función para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOGS_DIR/deploy.log"
}

log "📂 Verificando directorio del proyecto..."

# Configurar Git con token
git config --global credential.helper store
echo "https://$GITHUB_TOKEN:x-oauth-basic@github.com" > ~/.git-credentials

# Si es la primera vez, clonar el repositorio
if [ ! -d "$PROJECT_DIR/.git" ]; then
    log "🔄 Clonando repositorio privado por primera vez..."
    cd "$PROJECT_DIR"
    git clone "https://$GITHUB_TOKEN@github.com/RendonIndustries/Samana_Mecatr-nica_UPIIZ_WEBPAGE.git" .
    log "✅ Repositorio privado clonado exitosamente"
else
    log "🔄 Actualizando repositorio privado existente..."
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/main
    log "✅ Repositorio privado actualizado exitosamente"
fi

# Copiar archivos HTML al directorio del frontend
log "📁 Copiando archivos del frontend..."
cp -f "$PROJECT_DIR"/*.html "$FRONTEND_DIR/" 2>/dev/null || true
cp -f "$PROJECT_DIR"/*.css "$FRONTEND_DIR/" 2>/dev/null || true
cp -f "$PROJECT_DIR"/*.js "$FRONTEND_DIR/" 2>/dev/null || true

# Ajustar permisos
log "🔐 Ajustando permisos..."
chown -R www-data:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"

# Verificar configuración de Nginx
log "🔍 Verificando configuración de Nginx..."
if nginx -t; then
    log "✅ Configuración de Nginx válida"
    systemctl reload nginx
    log "🔄 Nginx recargado"
else
    log "❌ Error en configuración de Nginx"
    exit 1
fi

# Reiniciar PM2 si existe el backend
if [ -f "$BACKEND_DIR/package.json" ]; then
    log "🔄 Reiniciando aplicación Node.js..."
    cd "$BACKEND_DIR"
    pm2 restart semana-mecatronica-backend || pm2 start ecosystem.config.js
    log "✅ Aplicación Node.js reiniciada"
fi

# Crear archivo de estado
echo "Último despliegue: $(date)" > "$PROJECT_DIR/.last_deploy"

log "🎉 Despliegue completado exitosamente!"
log "🌐 Sitio web disponible en: http://semanameca.upiiz.ipn.mx"

# Limpiar logs antiguos
find "$LOGS_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true

echo "✅ Despliegue finalizado en $(date)"
