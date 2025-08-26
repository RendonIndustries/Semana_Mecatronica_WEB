# 🔒 Configuración de Webhook para Repositorio PRIVADO

## ⚠️ Problemas con repositorios privados

Los repositorios privados requieren autenticación especial para:
- Clonar/actualizar desde el servidor
- Recibir webhooks de GitHub
- Acceder a los archivos

## 🛠️ Soluciones

### **Opción 1: Hacer el repositorio público (RECOMENDADO)**

```bash
# En GitHub:
1. Ve a tu repositorio
2. Settings → General
3. Scroll down a "Danger Zone"
4. "Change repository visibility"
5. Selecciona "Make public"
```

**Ventajas:**
- ✅ Configuración más simple
- ✅ Webhook funciona inmediatamente
- ✅ No problemas de autenticación
- ✅ Otros pueden ver el código (bueno para proyectos académicos)

### **Opción 2: Mantener privado con Personal Access Token**

#### **Paso 1: Crear Personal Access Token**

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)**
3. Configura:
   - **Note**: `Semana Mecatronica Deploy`
   - **Expiration**: `No expiration` (o 90 days)
   - **Scopes**: ✅ `repo` (Full control of private repositories)
4. **Generate token**
5. **Copia el token** (es la única vez que lo verás)

#### **Paso 2: Configurar el servidor**

```bash
# Conectar al servidor
ssh rootupiiz@148.204.142.27

# Crear directorio del proyecto
sudo mkdir -p /var/www/semana-mecatronica
cd /var/www/semana-mecatronica

# Editar el script de despliegue
sudo nano deploy_private_repo.sh

# Cambiar esta línea:
GITHUB_TOKEN="tu_personal_access_token_aqui"
# Por tu token real:
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Dar permisos
sudo chmod +x deploy_private_repo.sh
sudo chown www-data:www-data deploy_private_repo.sh
```

#### **Paso 3: Configurar webhook en GitHub**

1. Ve a tu repositorio → Settings → Webhooks
2. **Add webhook**
3. Configura:
   - **Payload URL**: `http://semanameca.upiiz.ipn.mx/webhook.php`
   - **Content type**: `application/json`
   - **Secret**: `semana_mecatronica_2025_secret_key`
   - **Events**: Solo **push events**
   - **Active**: ✅ Marcar como activo

#### **Paso 4: Configurar Nginx**

```bash
sudo nano /etc/nginx/sites-available/semanameca.upiiz.ipn.mx
```

Agregar:
```nginx
# Webhook para GitHub (Repositorio Privado)
location /webhook.php {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

#### **Paso 5: Instalar PHP**

```bash
sudo apt update
sudo apt install php-fpm php-cli
sudo systemctl reload nginx
```

#### **Paso 6: Probar**

```bash
# Probar el webhook
curl -X POST http://semanameca.upiiz.ipn.mx/webhook.php \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{"ref":"refs/heads/main"}'

# Ver logs
sudo tail -f /var/www/semana-mecatronica/logs/webhook.log
sudo tail -f /var/www/semana-mecatronica/logs/deploy.log
```

## 🔐 Seguridad con repositorio privado

### **Ventajas:**
- ✅ Código no visible públicamente
- ✅ Control total de acceso
- ✅ Ideal para proyectos internos

### **Desventajas:**
- ❌ Configuración más compleja
- ❌ Tokens pueden expirar
- ❌ Más puntos de falla
- ❌ Requiere gestión de credenciales

## 🎯 Recomendación

**Para tu proyecto de la Semana de Mecatrónica, recomiendo hacer el repositorio público** porque:

1. **Es un proyecto académico** - Es normal que sea público
2. **Facilita la colaboración** - Otros estudiantes pueden ver el código
3. **Configuración más simple** - Menos problemas técnicos
4. **Mejor para el portafolio** - Muestra tu trabajo públicamente

## 📊 Comparación

| Aspecto | Repositorio Público | Repositorio Privado |
|---------|-------------------|-------------------|
| **Configuración** | Simple | Compleja |
| **Webhook** | Funciona inmediatamente | Requiere token |
| **Seguridad** | Código visible | Código oculto |
| **Mantenimiento** | Bajo | Alto |
| **Colaboración** | Fácil | Limitada |

## 🚀 Próximos pasos

1. **Decide** si quieres hacer el repositorio público o privado
2. **Sigue** la guía correspondiente
3. **Prueba** el webhook
4. **Haz un cambio** y verifica que se despliega automáticamente
