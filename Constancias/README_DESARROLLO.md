# 🔧 Guía de Desarrollo - Sistema de QR para Constancias

## ⚠️ IMPORTANTE: Desarrollo Local vs Producción

### Problema Común
Cuando generas los QR en desarrollo local, estos apuntan a URLs que no son accesibles desde dispositivos móviles (como tu iPhone) porque:
- `localhost` solo funciona en la misma computadora
- `127.0.0.1` solo funciona en la misma computadora
- Necesitas usar la **IP local de tu computadora** para que tu iPhone pueda acceder

## 🚀 Soluciones para Desarrollo Local

### Opción 1: Detección Automática (RECOMENDADO)
El script ahora detecta automáticamente si estás en desarrollo y usa tu IP local:

```powershell
cd Constancias
node agregar_qr_constancias.js
```

El script automáticamente:
- Detecta tu IP local (ej: `192.168.1.100`)
- Usa `http://192.168.1.100:3000` como URL base
- Los QR funcionarán desde tu iPhone si está en la misma red WiFi

### Opción 2: Especificar URL Manualmente
Si quieres usar una URL específica:

```powershell
# Windows PowerShell
$env:BASE_URL="http://192.168.1.100:3000"
node agregar_qr_constancias.js

# O en una sola línea
$env:BASE_URL="http://192.168.1.100:3000"; node agregar_qr_constancias.js
```

### Opción 3: Usar ngrok (Para pruebas desde cualquier red)
Si quieres que funcione desde cualquier lugar (no solo la misma WiFi):

1. **Instalar ngrok:**
   ```powershell
   # Descargar de https://ngrok.com/download
   # O usar chocolatey:
   choco install ngrok
   ```

2. **Iniciar túnel:**
   ```powershell
   ngrok http 3000
   ```

3. **Usar la URL de ngrok:**
   ```powershell
   $env:BASE_URL="https://tu-url-ngrok.ngrok.io"
   node agregar_qr_constancias.js
   ```

## 📱 Cómo Obtener tu IP Local

### Windows (PowerShell):
```powershell
# Ver todas las IPs
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*"} | Select-Object IPAddress

# O más simple:
ipconfig | findstr IPv4
```

### Ejemplo de salida:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

## ✅ Verificar que Funciona

1. **Asegúrate de que el servidor esté corriendo:**
   ```powershell
   node server.js
   ```

2. **Verifica que puedes acceder desde tu iPhone:**
   - Abre Safari en tu iPhone
   - Ve a: `http://TU-IP:3000/validar_qr.html?hash=TEST`
   - Deberías ver la página de validación

3. **Genera los QR:**
   ```powershell
   cd Constancias
   node agregar_qr_constancias.js
   ```

4. **Escanea un QR desde tu iPhone:**
   - Debería abrir la página de validación correctamente

## 🔄 Para Producción

Cuando subas todo a producción, simplemente:

```powershell
# En el servidor de producción
$env:BASE_URL="https://semanameca.upiiz.ipn.mx"
node agregar_qr_constancias.js
```

O simplemente no especificar `BASE_URL` y el script usará el dominio de producción por defecto.

## 🐛 Solución de Problemas

### "No se puede acceder a la página"
- ✅ Verifica que el servidor Node.js esté corriendo
- ✅ Verifica que tu iPhone esté en la misma red WiFi
- ✅ Verifica que el firewall de Windows permita conexiones en el puerto 3000
- ✅ Prueba acceder manualmente desde Safari: `http://TU-IP:3000`

### "Página en blanco"
- ✅ Verifica que la URL en el QR sea correcta
- ✅ Abre la consola del navegador (Safari en iPhone: Configuración > Safari > Avanzado > Consola Web)
- ✅ Verifica que no haya errores de CORS o JavaScript

### "QR apunta a localhost"
- ✅ El script ahora detecta automáticamente la IP local
- ✅ Si aún así usa localhost, especifica manualmente: `$env:BASE_URL="http://TU-IP:3000"`

## 📝 Notas Importantes

- **Los QR generados son permanentes**: Si cambias la URL base, necesitas regenerar los QR
- **Durante desarrollo**: Usa IP local o ngrok
- **En producción**: Usa el dominio real (`https://semanameca.upiiz.ipn.mx`)
- **Mismo WiFi**: Tu iPhone y tu computadora deben estar en la misma red WiFi para que funcione con IP local
