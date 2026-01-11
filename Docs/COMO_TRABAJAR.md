# 🚀 CÓMO TRABAJAR EN EL PROYECTO - Semana de Mecatrónica 2025

## ✅ ESTADO ACTUAL

**✅ TODO INSTALADO Y FUNCIONANDO:**
- ✅ Node.js v24.12.0
- ✅ npm 11.6.2
- ✅ Dependencias instaladas
- ✅ Servidor funcionando en: **http://localhost:3000**

---

## 🎯 INICIAR EL SERVIDOR

### Opción 1: Script PowerShell (RECOMENDADO)

**Haz doble clic en:**
```
iniciar_servidor.ps1
```

Si te pide permisos, ejecuta en PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Opción 2: Script Batch

**Haz doble clic en:**
```
iniciar_servidor.bat
```

### Opción 3: Desde PowerShell/CMD

1. **Abre PowerShell o CMD**
2. **Navega al proyecto:**
   ```powershell
   cd D:\Repositorios_Git\Semana_Mecatronica_WEB
   ```
3. **Agrega Node.js al PATH (si es necesario):**
   ```powershell
   $env:Path += ";C:\Program Files\nodejs\"
   ```
4. **Inicia el servidor:**
   ```powershell
   node server.js
   ```
   O también:
   ```powershell
   npm start
   ```

---

## 🌐 ACCESO A LA APLICACIÓN

Una vez que el servidor esté corriendo, abre tu navegador en:

### Páginas Principales:
- **🏠 Página Principal:** http://localhost:3000
- **📝 Registro:** http://localhost:3000/registro_semana_mecatronica.html
- **🏆 Concursos:** http://localhost:3000/concursos_semana_mecatronica.html
- **👥 Administración:** http://localhost:3000/admin_registros.html

### Portal de Administración (Escáner QR):
- **🔐 Login:** http://localhost:3000/EscanerQR/login.html
- **📱 Escáner:** http://localhost:3000/EscanerQR/index.html

**Credenciales:**
- Usuario: `SemanaMeca2025`
- Contraseña: `xhdrbz25`

---

## 📝 TRABAJAR CON EL PROYECTO

### Estructura de Archivos Principales:

```
Semana_Mecatronica_WEB/
├── server.js                    # Servidor Node.js (Backend)
├── semana_mecatronica_2025.html # Página principal
├── registro_semana_mecatronica.html  # Formulario de registro
├── concursos_semana_mecatronica.html # Registro de concursos
├── admin_registros.html         # Panel de administración
├── EscanerQR/                   # Portal de escáner QR
│   ├── index.html              # Escáner principal
│   ├── login.html              # Login
│   └── scanner.js              # Lógica del escáner
├── components/                  # Componentes modulares
│   ├── navbar.html             # Barra de navegación
│   └── navbar.js               # Script del navbar
└── Registros2025/              # Datos (se crea automáticamente)
    ├── registros_semana_mecatronica_2025.json
    ├── asistencias_entregas_2025.json
    ├── pagos_semana_mecatronica_2025.json
    └── registros_concursos_2025.json
```

### Flujo de Trabajo:

1. **Edita los archivos HTML/CSS/JS** según necesites
2. **Guarda los cambios**
3. **Recarga la página en el navegador** (F5 o Ctrl+R)
4. **Si modificas server.js**, reinicia el servidor:
   - Detén: `Ctrl+C` en la terminal
   - Reinicia: `node server.js` o `npm start`

---

## 🔧 COMANDOS ÚTILES

### Verificar que todo funciona:
```powershell
node --version    # Debe mostrar: v24.12.0
npm --version     # Debe mostrar: 11.6.2
```

### Instalar/Actualizar dependencias:
```powershell
npm install
```

### Iniciar servidor:
```powershell
node server.js
# O
npm start
```

### Detener servidor:
Presiona `Ctrl+C` en la terminal donde está corriendo

### Verificar que el servidor está corriendo:
Abre: http://localhost:3000

---

## 📊 APIS DISPONIBLES

### Registro
- `POST /api/registro` - Crear nuevo registro
- `GET /api/registros` - Listar todos los registros
- `GET /api/registro/:id` - Obtener un registro específico
- `PUT /api/registro/:id` - Actualizar registro
- `DELETE /api/registro/:id` - Eliminar registro

### Pagos
- `POST /api/verificar-pago` - Verificar pago
- `GET /api/pagos` - Listar todos los pagos
- `POST /api/pagos` - Agregar nuevo pago
- `PUT /api/pagos/:idPago` - Actualizar pago
- `DELETE /api/pagos/:idPago` - Eliminar pago

### Asistencias y Entregas
- `POST /api/asistencia` - Registrar asistencia
- `POST /api/entrega` - Registrar entrega
- `GET /api/asistencias` - Obtener asistencias

### Concursos
- `POST /api/registro-concurso` - Registrar equipo en concurso
- `GET /api/concursos` - Listar todos los concursos
- `GET /api/concursos/:tipo` - Listar concursos de un tipo

### QR Codes
- `GET /api/qr/:id` - Generar código QR (imagen)
- `GET /api/qr-data/:id` - Obtener datos del QR (JSON)

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### El servidor no inicia:

1. **Verifica que Node.js esté en el PATH:**
   ```powershell
   $env:Path += ";C:\Program Files\nodejs\"
   node --version
   ```

2. **Verifica que el puerto 3000 esté libre:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
   ```
   Si hay algo usando el puerto, cierra ese proceso.

3. **Revisa los errores en la terminal** donde intentas iniciar el servidor

### Los cambios no se reflejan:

1. **Guarda el archivo** (Ctrl+S)
2. **Recarga la página** en el navegador (F5)
3. **Si modificaste server.js**, reinicia el servidor (Ctrl+C y luego `node server.js`)

### npm no se reconoce:

Agrega Node.js al PATH de la sesión actual:
```powershell
$env:Path += ";C:\Program Files\nodejs\"
```

O cierra y abre una nueva terminal.

---

## 📁 DATOS DEL SISTEMA

El sistema guarda todos los datos en archivos JSON en:
```
Registros2025/
```

Estos archivos se crean automáticamente cuando:
- Se hace el primer registro
- Se registra la primera asistencia
- Se crea el primer pago
- Se registra el primer concurso

---

## 🎯 RESUMEN RÁPIDO

1. ✅ **Inicia el servidor:** `node server.js` o haz doble clic en `iniciar_servidor.ps1`
2. ✅ **Abre el navegador:** http://localhost:3000
3. ✅ **Edita los archivos** según necesites
4. ✅ **Recarga la página** para ver cambios
5. ✅ **Reinicia el servidor** solo si modificaste `server.js`

---

## 🚀 ¡TODO LISTO PARA TRABAJAR!

El proyecto está completamente configurado y funcionando. Puedes empezar a hacer cambios y verlos reflejados en tiempo real.

**¡Disfruta trabajando en el proyecto!** 🎉
