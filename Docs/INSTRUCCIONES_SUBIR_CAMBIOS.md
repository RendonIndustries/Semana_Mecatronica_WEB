# 📤 Instrucciones para Subir Cambios al Servidor

## 📋 Proceso Completo

### **Paso 1: Subir cambios a GitHub (AQUÍ - tu máquina local)**

Ejecuta estos comandos en PowerShell desde la carpeta del proyecto:

```powershell
# 1. Agregar todos los cambios (modificados, nuevos y eliminados)
git add .

# 2. Hacer commit con un mensaje descriptivo
git commit -m "Actualización: Reorganización de documentación y mejoras"

# 3. Subir cambios a GitHub
git push origin main
```

**Si te pide autenticación:**
- Usuario: tu usuario de GitHub
- Contraseña: usa un **Personal Access Token** (no tu contraseña normal)
  - Cómo crear un token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic)
  - Permisos necesarios: `repo` (Full control of private repositories)

---

### **Paso 2: Actualizar el servidor (EN EL SERVIDOR - 148.204.142.27)**

Una vez que los cambios estén en GitHub, conecta al servidor y ejecuta:

```bash
# Conectar al servidor
ssh rootupiiz@148.204.142.27

# Actualizar el sitio web
cd /var/www/semana-mecatronica
sudo git stash
sudo git pull origin main
pm2 restart semana-mecatronica
curl http://148.204.142.27
```

---

## 🔄 Flujo Visual

```
┌─────────────────┐
│  Tu Computadora │
│   (Local)       │
└────────┬────────┘
         │
         │ 1. git add .
         │ 2. git commit -m "..."
         │ 3. git push origin main
         │
         ▼
┌─────────────────┐
│     GitHub      │
│  (Repositorio)  │
└────────┬────────┘
         │
         │ 4. Los cambios están en GitHub
         │
         ▼
┌─────────────────┐
│    Servidor     │
│ 148.204.142.27  │
└────────┬────────┘
         │
         │ 5. ssh rootupiiz@148.204.142.27
         │ 6. cd /var/www/semana-mecatronica
         │ 7. sudo git pull origin main
         │ 8. pm2 restart semana-mecatronica
         │
         ▼
┌─────────────────┐
│  Página Web     │
│  Actualizada    │
└─────────────────┘
```

---

## 📝 Ejemplo Completo

### En tu computadora (PowerShell):

```powershell
# Navegar a la carpeta del proyecto
cd D:\Repositorios_Git\Semana_Mecatronica_WEB

# Ver qué cambios hay
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Reorganización de archivos y mejoras en documentación"

# Subir a GitHub
git push origin main
```

### En el servidor (SSH):

```bash
# Conectar
ssh rootupiiz@148.204.142.27

# Actualizar
cd /var/www/semana-mecatronica
sudo git stash
sudo git pull origin main
pm2 restart semana-mecatronica

# Verificar que funciona
curl http://148.204.142.27
```

---

## ⚠️ Notas Importantes

1. **Siempre ejecuta `git status` primero** para ver qué cambios hay
2. **Usa mensajes de commit descriptivos** para saber qué cambios se hicieron
3. **Verifica que el push fue exitoso** antes de actualizar el servidor
4. **Los cambios en el servidor** solo actualizan archivos, no reinician servicios automáticamente (por eso usas `pm2 restart`)

---

## 🐛 Solución de Problemas

### Error: "remote: Support for password authentication was removed"
- **Solución:** Usa un Personal Access Token en lugar de tu contraseña

### Error: "Permission denied (publickey)"
- **Solución:** Verifica que tengas acceso SSH al servidor

### Error: "Your branch is ahead of 'origin/main'"
- **Solución:** Ejecuta `git push origin main` para subir tus commits

### Los cambios no se reflejan en el servidor
- **Solución:** 
  1. Verifica que el push fue exitoso en GitHub
  2. Verifica que ejecutaste `git pull` en el servidor
  3. Verifica que reiniciaste PM2: `pm2 restart semana-mecatronica`
