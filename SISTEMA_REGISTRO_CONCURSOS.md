# 🏆 Sistema de Registro de Concursos - Semana de Mecatrónica 2025

## 📋 Descripción General

Sistema completo para el registro de equipos en los concursos de la Semana de Mecatrónica 2025. Permite inscribir equipos de robótica y trivia, validando que los participantes estén registrados en el evento principal.

## 🎯 Tipos de Concursos

### Concursos de Robótica (Requieren 1 participante)
1. **Mini Sumo** (`minisumo`)
2. **Seguidor de Línea** (`seguidorlinea`)
3. **Boxeo Humanoide** (`boxeohumanoide`)
4. **Robot de Combate 3 lb** (`robotcombate`)

**Datos requeridos:**
- ID de registro del participante (generado en registro principal)
- Nombre del robot
- Nombre del equipo
- Teléfono de contacto del equipo

### Concurso Académico (Requiere 4 participantes)
5. **"100 Burros Dijeron"** (`trivia`)

**Datos requeridos:**
- Nombre del equipo
- ID de registro de cada uno de los 4 integrantes
- Teléfono de contacto del equipo

## 🔧 Arquitectura del Sistema

### Frontend (`concursos_semana_mecatronica.html`)

#### Modales de Registro
1. **Modal de Robótica** (`registroConcursoModal`)
   - Formulario para concursos individuales
   - Validación en tiempo real del ID del participante
   - Campos: ID, nombre robot, nombre equipo, contacto

2. **Modal de Trivia** (`registroTriviaModal`)
   - Formulario para equipos de 4 personas
   - Validación de cada integrante
   - Prevención de IDs duplicados
   - Campos: nombre equipo, 4 IDs de integrantes, contacto

#### Funciones JavaScript Principales

```javascript
// Abrir modal de robótica
abrirRegistroConcurso(tipoConcurso, nombreConcurso)

// Abrir modal de trivia
abrirRegistroTrivia()

// Verificar participante (robótica)
verificarParticipante()

// Verificar integrantes (trivia)
verificarIntegrante(numero)

// Guardar registro de robótica
guardarRegistroConcurso()

// Guardar registro de trivia
guardarRegistroTrivia()
```

### Backend (`server.js`)

#### Archivos JSON
- **Archivo:** `Registros2025/registros_concursos_2025.json`
- **Estructura:**
```json
{
  "metadata": {
    "version": "1.0",
    "evento": "Semana de Mecatrónica 2025",
    "fechaCreacion": "ISO-8601",
    "ultimaActualizacion": "ISO-8601"
  },
  "concursos": {
    "minisumo": [],
    "seguidorlinea": [],
    "boxeohumanoide": [],
    "robotcombate": [],
    "trivia": []
  }
}
```

#### Endpoints API

**POST /api/registro-concurso**
- Registra un equipo en un concurso
- Valida que los IDs de participantes existan
- Genera ID único para el equipo
- Guarda en el archivo JSON correspondiente

**Validaciones:**
- Verifica que el ID del participante exista en `registros_semana_mecatronica_2025.json`
- Para trivia: verifica los 4 IDs y que no haya duplicados
- Valida que el tipo de concurso sea válido

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Equipo registrado exitosamente en el concurso",
  "idEquipo": "generado_automaticamente",
  "tipoConcurso": "tipo_de_concurso",
  "nombreEquipo": "nombre_del_equipo"
}
```

**GET /api/concursos**
- Obtiene todos los registros de todos los concursos
- Usado por el panel de administración

**GET /api/concursos/:tipo**
- Obtiene registros de un concurso específico
- Parámetro: minisumo, seguidorlinea, boxeohumanoide, robotcombate, trivia

### Panel de Administración (`EscanerQR/index.html`)

#### Nueva Funcionalidad: Gestión de Concursos

**Menú Principal:**
- Nueva tarjeta "Gestión de Concursos"
- Icono de trofeo
- Abre modal con pestañas por concurso

**Modal de Gestión:**
- 5 pestañas (una por concurso)
- Tablas con información de equipos registrados
- Botón de actualizar datos
- Botón de exportar a CSV

**Funciones JavaScript:**
```javascript
// Abrir modal de gestión
abrirGestionConcursos()

// Actualizar listas
actualizarListaConcursos()

// Actualizar tabla de robótica
actualizarTablaConcurso(tipo, equipos, tablaId)

// Actualizar tabla de trivia
actualizarTablaTrivia(equipos)

// Exportar a CSV
exportarConcursos()
```

## 📊 Estructura de Datos

### Registro de Concurso de Robótica
```json
{
  "idEquipo": "1696969696969abc123",
  "metadata": {
    "fechaRegistro": "2025-10-10T12:00:00.000Z",
    "version": "1.0",
    "tipoConcurso": "minisumo"
  },
  "equipo": {
    "idRegistroParticipante": "abc123def456",
    "nombreParticipante": "Juan Pérez",
    "nombreRobot": "Thunderbot 3000",
    "nombreEquipo": "Team Robotix",
    "contactoEquipo": "4921234567"
  },
  "fechaGuardado": "2025-10-10T12:00:00.000Z"
}
```

### Registro de Trivia
```json
{
  "idEquipo": "1696969696969xyz789",
  "metadata": {
    "fechaRegistro": "2025-10-10T12:00:00.000Z",
    "version": "1.0",
    "tipoConcurso": "trivia"
  },
  "equipo": {
    "nombreEquipo": "Los Burros Sabios",
    "contactoEquipo": "4921234567",
    "integrantes": [
      "id1abc123",
      "id2def456",
      "id3ghi789",
      "id4jkl012"
    ],
    "nombresIntegrantes": [
      "María García",
      "Juan Pérez",
      "Ana López",
      "Carlos Ruiz"
    ]
  },
  "fechaGuardado": "2025-10-10T12:00:00.000Z"
}
```

## 🚀 Flujo de Uso

### Para Participantes

1. **Registro Principal**
   - Primero deben registrarse en `registro_semana_mecatronica.html`
   - Obtienen su ID de registro único

2. **Registro en Concurso**
   - Van a `concursos_semana_mecatronica.html`
   - Hacen clic en "📝 Inscribirse" del concurso deseado
   - Llenan el formulario con:
     - Su ID de registro (se valida automáticamente)
     - Nombre del robot/equipo
     - Datos de contacto
   - Aceptan el reglamento
   - Envían el formulario

3. **Confirmación**
   - Reciben un ID de equipo único
   - Confirmación con datos del registro

### Para Administradores

1. **Acceso**
   - Inician sesión en `EscanerQR/login.html`
   - Acceden al panel de administración

2. **Ver Registros**
   - Hacen clic en "Gestión de Concursos"
   - Ven pestañas por cada concurso
   - Consultan equipos registrados

3. **Exportar Datos**
   - Botón "Exportar CSV"
   - Descarga archivo con todos los registros
   - Formato compatible con Excel/Google Sheets

## 🔒 Validaciones

### Al Registrar Concurso de Robótica
✅ El ID del participante debe existir en el sistema
✅ El nombre del robot no puede estar vacío
✅ El nombre del equipo no puede estar vacío
✅ El teléfono debe ser válido
✅ Debe aceptar el reglamento

### Al Registrar Trivia
✅ Todos los 4 IDs deben existir en el sistema
✅ Los 4 IDs deben ser diferentes (no duplicados)
✅ El nombre del equipo no puede estar vacío
✅ El teléfono debe ser válido
✅ Deben aceptar el reglamento

## 📂 Archivos Modificados

1. **concursos_semana_mecatronica.html**
   - Botones de registro actualizados
   - Modales de formularios agregados
   - JavaScript de validación y envío

2. **server.js**
   - Endpoint POST /api/registro-concurso
   - Endpoint GET /api/concursos
   - Endpoint GET /api/concursos/:tipo
   - Funciones cargarConcursos() y guardarConcursos()

3. **EscanerQR/index.html**
   - Nueva tarjeta "Gestión de Concursos"
   - Modal con pestañas por concurso
   - Funciones de actualización y exportación

4. **Registros2025/registros_concursos_2025.json**
   - Archivo JSON para almacenar registros
   - Estructura organizada por tipo de concurso

## 🎨 Características

✅ **Validación en tiempo real** - Los IDs se verifican al perder foco
✅ **Feedback visual** - Indicadores de carga y validación
✅ **Prevención de duplicados** - No permite IDs repetidos en trivia
✅ **Exportación CSV** - Descarga datos para análisis
✅ **Interfaz amigable** - Modales responsivos con Bootstrap
✅ **Almacenamiento JSON** - Datos estructurados y fáciles de leer
✅ **Integración completa** - Conectado con sistema principal de registro

## 📞 Soporte

Para cualquier duda o problema con el sistema de registro de concursos:
- Email: semana_meca_UPIIZ@ipn.mx
- Teléfono: (492) 124 0410

---

**Desarrollado con ❤️ para la Semana de Mecatrónica 2025 - UPIIZ IPN**

