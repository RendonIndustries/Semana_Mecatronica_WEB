# 📦 Guía de Instalación de Node.js - Windows

## 🔍 Paso 1: Descargar Node.js

1. **Abre tu navegador web** y visita:
   ```
   https://nodejs.org/
   ```

2. **Descarga la versión LTS (Long Term Support)**
   - Se recomienda la versión LTS (más estable)
   - Actualmente: Node.js 20.x o superior
   - Haz clic en el botón verde que dice "Download Node.js (LTS)"

3. **Se descargará un archivo `.msi`** (por ejemplo: `node-v20.x.x-x64.msi`)

## 📥 Paso 2: Instalar Node.js

1. **Ejecuta el instalador descargado**
   - Haz doble clic en el archivo `.msi` descargado
   - Puede pedir permisos de administrador

2. **Sigue el asistente de instalación:**
   - ✅ **Acepta los términos de licencia**
   - ✅ **Mantén la ruta de instalación predeterminada** (recomendado)
   - ✅ **Asegúrate de que esté marcada la opción "Add to PATH"** (muy importante)
   - ✅ Haz clic en "Install"
   - ✅ Espera a que termine la instalación
   - ✅ Haz clic en "Finish"

## ✅ Paso 3: Verificar la Instalación

**IMPORTANTE:** Después de instalar Node.js, **CIERRA Y VUELVE A ABRIR** la terminal/consola para que reconozca los nuevos comandos.

Luego ejecuta estos comandos en una nueva terminal:

```powershell
node --version
npm --version
```

Deberías ver algo como:
```
v20.x.x
10.x.x
```

## 🎉 ¡Listo!

Una vez que veas las versiones, Node.js está correctamente instalado.

## ⚠️ Solución de Problemas

### Si los comandos no funcionan después de instalar:

1. **Cierra completamente** la terminal/consola
2. **Abre una nueva terminal**
3. Si aún no funciona:
   - Reinicia tu computadora
   - Verifica que Node.js esté instalado en: `C:\Program Files\nodejs\`
   - Verifica las variables de entorno PATH

### Verificar manualmente si Node.js está instalado:

1. Presiona `Win + R`
2. Escribe: `C:\Program Files\nodejs\node.exe --version`
3. Si muestra una versión, está instalado pero falta agregarlo al PATH

---

**Una vez instalado Node.js, vuelve a esta carpeta y ejecuta:**
```powershell
npm install
```
