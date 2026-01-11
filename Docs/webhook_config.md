# 🔗 Configuración de Webhook para Despliegue Automático

## 📋 Pasos para conectar el servidor con GitHub

### 1. **Subir archivos al servidor**

```bash
# Conectar al servidor
ssh rootupiiz@148.204.142.27

# Crear directorio del proyecto
sudo mkdir -p /var/www/semana-mecatronica
cd /var/www/semana-mecatronica

# Clonar el repositorio
sudo git clone https://github.com/RendonIndustries/Samana_Mecatr-nica_UPIIZ_WEBPAGE.git .

# Dar permisos al script de despliegue
sudo chmod +x deploy.sh
sudo chown www-data:www-data deploy.sh
```

### 2. **Configurar el webhook en GitHub**

1. Ve a tu repositorio: `https://github.com/RendonIndustries/Samana_Mecatr-nica_UPIIZ_WEBPAGE`
2. Ve a **Settings** → **Webhooks**
3. Haz clic en **Add webhook**
4. Configura:
   - **Payload URL**: `http://semanameca.upiiz.ipn.mx/webhook.php`
   - **Content type**: `application/json`
   - **Secret**: `semana_mecatronica_2025_secret_key`
   - **Events**: Selecciona **Just the push event**
   - **Active**: ✅ Marcar como activo

### 3. **Configurar Nginx para el webhook**

```bash
# Editar configuración de Nginx
sudo nano /etc/nginx/sites-available/semanameca.upiiz.ipn.mx
```

Agregar esta sección dentro del bloque `server`:

```nginx
# Webhook para GitHub
location /webhook.php {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

### 4. **Instalar PHP si no está instalado**

```bash
# Verificar si PHP está instalado
php -v

# Si no está instalado:
sudo apt update
sudo apt install php-fpm php-cli

# Reiniciar Nginx
sudo systemctl reload nginx
```

### 5. **Probar el webhook**

```bash
# Verificar que el webhook funciona
curl -X POST http://semanameca.upiiz.ipn.mx/webhook.php \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{"ref":"refs/heads/main"}'
```

### 6. **Verificar logs**

```bash
# Ver logs del webhook
sudo tail -f /var/www/semana-mecatronica/logs/webhook.log

# Ver logs del despliegue
sudo tail -f /var/www/semana-mecatronica/logs/deploy.log
```

## 🔄 Flujo de trabajo

1. **Haces cambios** en tu código local
2. **Haces commit y push** a GitHub
3. **GitHub envía webhook** al servidor
4. **El servidor ejecuta** el script de despliegue automáticamente
5. **Los cambios se reflejan** inmediatamente en el sitio web

## 📊 Monitoreo

- **Estado del webhook**: GitHub → Settings → Webhooks
- **Logs del servidor**: `/var/www/semana-mecatronica/logs/`
- **Último despliegue**: `/var/www/semana-mecatronica/.last_deploy`

## 🛠️ Comandos útiles

```bash
# Verificar estado del webhook
sudo systemctl status nginx
sudo systemctl status php8.1-fpm

# Reiniciar servicios si es necesario
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/www/semana-mecatronica/logs/webhook.log
```

## ⚠️ Notas importantes

- El webhook solo responde a cambios en la rama `main`
- Los logs se mantienen por 7 días
- El script de despliegue se ejecuta en background
- Si hay errores, se registran en los logs
