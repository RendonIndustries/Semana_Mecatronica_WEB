# 📦 Guía Completa de Instalación - Semana de Mecatrónica 2025

## ⚠️ Error Actual

Si ves este error:
```
npm : El término 'npm' no se reconoce...
```

Significa que **Node.js NO está instalado** en tu sistema. Sigue estos pasos:

---

## 🔽 PASO 1: Descargar Node.js

1. **Abre tu navegador web** (Chrome, Edge, Firefox, etc.)
2. **Visita:** https://nodejs.org/
3. **Descarga la versión LTS** (recomendada - botón verde)
   - Actualmente es Node.js 20.x LTS
   - El archivo será algo como: `node-v20.18.0-x64.msi`

---

## 📥 PASO 2: Instalar Node.js

1. **Ejecuta el instalador** que descargaste
   - Puede pedir permisos de administrador → Acepta
   
2. **Sigue el asistente de instalación:**
   - ✅ Haz clic en "Next"
   - ✅ Acepta los términos de licencia → "Next"
   - ✅ Deja la ruta de instalación por defecto → "Next"
   - ✅ **MUY IMPORTANTE:** Asegúrate de que esté marcada la opción:
     **"Automatically install the necessary tools"** o **"Add to PATH"**
   - ✅ Haz clic en "Install"
   - ✅ Espera a que termine (puede tardar 1-2 minutos)
   - ✅ Haz clic en "Finish"

---

## 🔄 PASO 3: CERRAR Y ABRIR NUEVA TERMINAL

**⚠️ MUY IMPORTANTE:** Después de instalar Node.js:

1. **CIERRA completamente** la ventana de PowerShell/CMD actual
2. **Abre una nueva terminal:**
   - Presiona `Win + X`
   - Selecciona "Windows PowerShell" o "Terminal"
   - O busca "PowerShell" en el menú inicio

3. **Navega a la carpeta del proyecto:**
   ```powershell
   cd D:\Repositorios_Git\Semana_Mecatronica_WEB
   ```

---

## ✅ PASO 4: Verificar Instalación

En la **nueva terminal**, ejecuta:

```powershell
node --version
```

Deberías ver algo como: `v20.18.0`

Luego ejecuta:

```powershell
npm --version
```

Deberías ver algo como: `10.8.2`

**Si ves las versiones, ¡Node.js está instalado correctamente!** 🎉

---

## 📦 PASO 5: Instalar Dependencias del Proyecto

Ahora que Node.js está instalado, instala las dependencias:

```powershell
npm install
```

Esto instalará:
- `express` - Servidor web
- `cors` - Permisos CORS
- `multer` - Manejo de archivos
- `qrcode` - Generación de códigos QR

**Puede tardar 1-2 minutos.** Verás muchos mensajes mientras descarga los paquetes.

---

## 🚀 PASO 6: Iniciar el Servidor

Una vez que `npm install` termine sin errores, inicia el servidor:

```powershell
npm start
```

O también puedes usar:

```powershell
node server.js
```

Deberías ver:
```
🚀 Servidor de la Semana de Mecatrónica 2025 corriendo en:
   📱 Página Principal: http://localhost:3000
   ...
```

---

## 🌐 PASO 7: Abrir en el Navegador

Abre tu navegador y visita:

- **Página Principal:** http://localhost:3000
- **Registro:** http://localhost:3000/registro_semana_mecatronica.html
- **Administración:** http://localhost:3000/admin_registros.html

---

## 🔧 Scripts de Ayuda Incluidos

También puedes usar estos scripts (haz doble clic):

- **`instalar_dependencias.bat`** - Instala las dependencias automáticamente
- **`iniciar_servidor.bat`** - Inicia el servidor automáticamente

---

## ❓ Solución de Problemas

### Si `node` o `npm` aún no funcionan después de instalar:

1. **Reinicia tu computadora** (a veces Windows necesita reiniciarse)
2. **Verifica que Node.js esté instalado:**
   - Busca en: `C:\Program Files\nodejs\`
   - Deberías ver `node.exe` y `npm.cmd`

3. **Verifica las variables de entorno:**
   - Presiona `Win + R`
   - Escribe: `sysdm.cpl` y presiona Enter
   - Ve a "Opciones avanzadas" → "Variables de entorno"
   - En "Variables del sistema", busca "Path"
   - Debe incluir: `C:\Program Files\nodejs\`

### Si `npm install` da errores:

- Verifica tu conexión a internet
- Intenta ejecutar PowerShell como administrador
- Intenta: `npm install --verbose` para ver más detalles

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema durante la instalación, comparte:
1. El mensaje de error exacto
2. La salida de `node --version`
3. La salida de `npm --version`

---

**¡Buena suerte con la instalación!** 🚀
