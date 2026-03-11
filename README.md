# 🎓 Semana de Mecatrónica 2025 - Sistema Web

## 🧾 Generación de constancias de posters

### Instalación de dependencias (pip)
```bash
pip install python-pptx pandas qrcode[pil]
```

### Cómo correr el script
```bash
python generar_constancias_posters.py
```

### Requisitos
- `plantilla_constancia.pptx` y `posters.csv` deben estar en el mismo folder que `generar_constancias_posters.py`.

### Nota sobre marcadores
- La plantilla debe contener exactamente `{{NOMBRE}}` y `{{TITULO}}`.

## 🪟 Generador con ventanas (GUI)

### Instalación de dependencias (pip)
```bash
pip install python-pptx pandas
```

### Cómo correr la interfaz
```bash
python generar_constancias_posters_gui.py
```

### Requisitos
- Selecciona la plantilla, el CSV y la carpeta de salida desde la ventana.
- Para exportar a PDF en Windows: instalar `comtypes` y tener PowerPoint.
- Para validación con QR: configura la URL base y un secreto; se genera `hashes_validacion.json` en la carpeta de salida.

Sistema completo de registro y gestión para la **Semana de Mecatrónica 2025** de la UPIIZ IPN Campus Zacatecas.

## 📋 Descripción

Sistema web integral que incluye:
- **Registro de participantes** con validación de pagos
- **Gestión de concursos** (robótica y trivia)
- **Control de acceso** mediante códigos QR
- **Panel de administración** completo
- **Escáner QR móvil** para control de asistencias y entregas

## 🗂️ Estructura del Proyecto

```
Semana_Mecatronica_WEB/
├── 📄 Archivos Principales
│   ├── server.js                      # Servidor Node.js (Backend)
│   ├── package.json                   # Dependencias del proyecto
│   ├── semana_mecatronica_2025.html  # Página principal
│   ├── registro_semana_mecatronica.html  # Formulario de registro
│   ├── concursos_semana_mecatronica.html # Registro de concursos
│   └── admin_registros.html           # Panel de administración
│
├── 📁 assets/                         # Recursos estáticos
│   └── images/
│       ├── logos/                     # Logos (IPN, Gobierno, etc.)
│       ├── posters/                   # Posters del evento
│       └── patrocinadores/            # Logos de patrocinadores
│
├── 📁 components/                     # Componentes modulares
│   ├── navbar.html                    # Barra de navegación
│   └── navbar.js                      # Lógica del navbar
│
├── 📁 docs/                           # Documentación
│   ├── COMANDOS_LOCALES.md           # Guía de comandos locales
│   ├── COMO_TRABAJAR.md              # Instrucciones de trabajo
│   ├── INSTALACION_NODEJS.md         # Guía de instalación
│   └── ...                           # Otros documentos
│
├── 📁 scripts/                        # Scripts de desarrollo y despliegue
│   ├── iniciar_servidor.ps1          # Script PowerShell para iniciar
│   ├── iniciar_servidor.bat          # Script Batch para iniciar
│   ├── instalar_dependencias.bat     # Script de instalación
│   ├── deploy.sh                     # Script de despliegue
│   └── webhook.php                   # Webhook para despliegue automático
│
├── 📁 EscanerQR/                     # Portal de escáner QR
│   ├── index.html                    # Escáner principal
│   ├── login.html                    # Página de login
│   ├── scanner.js                    # Lógica del escáner
│   └── mobile.css                    # Estilos móviles
│
├── 📁 conocenos/                     # Sección "Conócenos"
│   └── directorio.html               # Directorio del personal
│
├── 📁 Docs/                          # Documentos del evento
│   ├── PDFs de reglamentos
│   ├── Programa del evento
│   └── Otros documentos
│
└── 📁 Registros2025/                 # Datos del sistema (generado automáticamente)
    ├── registros_semana_mecatronica_2025.json
    ├── asistencias_entregas_2025.json
    ├── pagos_semana_mecatronica_2025.json
    └── registros_concursos_2025.json
```

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- Navegador web moderno

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   O usar los scripts:
   - Windows: Doble clic en `scripts/iniciar_servidor.bat`
   - PowerShell: `.\scripts/iniciar_servidor.ps1`

3. **Abrir en el navegador:**
   - Página Principal: http://localhost:3000
   - Registro: http://localhost:3000/registro_semana_mecatronica.html
   - Administración: http://localhost:3000/admin_registros.html

## 📚 Documentación

Toda la documentación se encuentra en la carpeta `/docs`:

- **[COMANDOS_LOCALES.md](docs/COMANDOS_LOCALES.md)** - Guía completa de comandos y uso local
- **[COMO_TRABAJAR.md](docs/COMO_TRABAJAR.md)** - Instrucciones para trabajar en el proyecto
- **[INSTALACION_NODEJS.md](docs/INSTALACION_NODEJS.md)** - Guía de instalación de Node.js
- **[SISTEMA_REGISTRO_CONCURSOS.md](docs/SISTEMA_REGISTRO_CONCURSOS.md)** - Documentación del sistema de concursos

## 🔧 Tecnologías Utilizadas

- **Backend:** Node.js + Express
- **Frontend:** HTML5, CSS3, JavaScript (Bootstrap 5)
- **Almacenamiento:** Archivos JSON
- **QR Codes:** Librería `qrcode`
- **Servidor:** Express (desarrollo) / Nginx (producción)

## 📊 APIs Disponibles

### Registro
- `POST /api/registro` - Crear nuevo registro
- `GET /api/registros` - Listar todos los registros
- `GET /api/registro/:id` - Obtener registro específico
- `PUT /api/registro/:id` - Actualizar registro
- `DELETE /api/registro/:id` - Eliminar registro

### Pagos
- `POST /api/verificar-pago` - Verificar pago
- `GET /api/pagos` - Listar todos los pagos
- `POST /api/pagos` - Agregar nuevo pago

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

## 🔐 Credenciales

### Portal de Escáner QR
- **Usuario:** `SemanaMeca2025`
- **Contraseña:** `xhdrbz25`

## 📝 Licencia

MIT License - UPIIZ IPN

## 👥 Autores

Desarrollado para la **Semana de Mecatrónica 2025** - UPIIZ IPN Campus Zacatecas

---

**¡Gracias por participar en la Semana de Mecatrónica 2025!** 🎓🤖
