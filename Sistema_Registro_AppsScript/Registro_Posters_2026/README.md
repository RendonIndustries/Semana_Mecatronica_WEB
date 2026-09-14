# Sistema de Registro y Recepción de Pósters 2026
## 8va Semana de Mecatrónica UPIIZ-IPN & 1a Semana Estatal de Ingeniería Mecatrónica

**Exhibición Académica de Pósters 2026**  
**Fecha:** Martes 10 de noviembre de 2026  
**Modalidad:** Exhibición académica y divulgación científica  
**Costo:** Gratuito (Sin fines competitivos ni premiación)  
**Formato oficial:** 90 cm × 120 cm, vertical (PDF)  

---

## 1. Arquitectura y Componentes

El sistema está desarrollado para ejecutarse de forma autocontenida en **Google Workspace (Google Apps Script + Google Forms + Google Sheets + Gmail Service)**.

```
                  [ Google Form Oficial ]
            (6 Secciones / 15 Campos Normados)
                         │
              [ onFormSubmit Trigger ]
             (Único disparador activo)
                         │
             [ Concurrencia: LockService ]
                         │
           [ Generador Atómico: SM26-P### ]
                         │
         ┌───────────────┴───────────────┐
         │                               │
[ Google Sheets Maestro ]       [ Servicio de Notificación ]
- Pestaña: RESPUESTAS_POSTERS   - Confirmación a Autor
  (Preserva cols nativas +        (Dictamen condicional a revisión)
   5 cols administrativas)      - Notificación a Comité:
- Pestaña: LOG_POSTERS            semana_meca_UPIIZ@ipn.mx
```

### Estructura de Archivos del Proyecto
* `Config.gs`: Parámetros institucionales, líneas temáticas normadas, estados y textos oficiales.
* `FormBuilder.gs`: Construcción modular del formulario en 6 secciones sin page-breaks excesivos.
* `SubmissionHandler.gs`: Procesamiento atómico de envíos, asignación de folio `SM26-P###` y envío de correos.
* `TriggerManager.gs`: Gestión de disparador único instalable y remoción de duplicados.
* `Validation.gs`: Función de auditoría normativa e inspección técnica (`inspectPosterSystem`).
* `Code.gs`: Orquestador principal (`setupPosterRegistrationSystem`), utilidades y pruebas controladas.
* `CODIGO_CONSOLIDADO_POSTERS_2026.js`: Versión unificada en un solo archivo para despliegue rápido.
* `appsscript.json`: Manifiesto de configuración de entorno, zona horaria y scopes OAuth requeridos.

---

## 2. Guía Oficial de Despliegue en Google Apps Script

Siga estrictamente los siguientes pasos para desplegar el sistema en producción:

### Paso 1: Crear el Proyecto en Google Apps Script
1. Abra su navegador e ingrese a [script.google.com](https://script.google.com/).
2. Haga clic en el botón **"Nuevo proyecto"**.
3. En la esquina superior izquierda, asigne el nombre del proyecto:  
   `SM2026 — Registro de Pósters`.

### Paso 2: Cargar el Código Fuente
Dispone de dos alternativas equivalentes:
* **Opción A (Recomendada / Despliegue Rápido):**
  1. Abra el archivo `CODIGO_CONSOLIDADO_POSTERS_2026.js` de esta carpeta.
  2. Copie todo su contenido y reemplácelo dentro del archivo `Código.gs` en Apps Script.
* **Opción B (Modular):**
  1. Cree los archivos correspondientes en Apps Script con la extensión `.gs`:
     - `Config.gs`
     - `FormBuilder.gs`
     - `SubmissionHandler.gs`
     - `TriggerManager.gs`
     - `Validation.gs`
     - `Code.gs`
  2. Pegue el código de cada archivo respectivo.

### Paso 3: Configurar el Manifiesto (`appsscript.json`)
1. En el editor de Apps Script, diríjase al engranaje lateral izquierdo **"Configuración del proyecto"** (⚙️).
2. Marque la casilla **"Mostrar el archivo de manifiesto 'appsscript.json' en el editor"**.
3. Regrese al editor de código (`<>`), abra `appsscript.json` y pegue el contenido de nuestro archivo `appsscript.json`:
   ```json
   {
     "timeZone": "America/Mexico_City",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "oauthScopes": [
       "https://www.googleapis.com/auth/forms",
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/script.send_mail",
       "https://www.googleapis.com/auth/script.scriptapp"
     ]
   }
   ```
4. Guarde los cambios (`Ctrl + S`).

### Paso 4: Ejecutar la Función de Inicialización (`setupPosterRegistrationSystem`)
1. En la barra de herramientas superior, seleccione del menú desplegable de funciones:
   ```javascript
   setupPosterRegistrationSystem
   ```
2. Haga clic en **"Ejecutar"**.

### Paso 5: Autorizar Permisos de Google Workspace
1. Google mostrará un cuadro de diálogo solicitando autorización: **"Autorización obligatoria"**.
2. Haga clic en **"Revisar permisos"**.
3. Seleccione su cuenta institucional o la cuenta administradora de Google Workspace.
4. Si aparece la advertencia *"Google no ha verificado esta app"*, haga clic en **"Configuración avanzada"** $\rightarrow$ **"Ir a SM2026 — Registro de Pósters (no seguro)"**.
5. Conceda los permisos requeridos (Drive, Formularios, Hojas de cálculo, Correo y Disparadores).

### Paso 6: Confirmar la Creación de Recursos
En la consola inferior **"Registro de ejecución"** observará la confirmación de:
- Creación y estructuración del Google Form (6 secciones y 15 campos).
- Creación de la hoja de cálculo maestro (`SM2026 — Registro de Pósters`).
- Vinculación del Formulario hacia la hoja de cálculo como destino de respuestas.
- Preparación de las columnas administrativas: `POSTER_ID`, `ESTATUS`, `OBSERVACIONES`, `FECHA_REVISION`, `REVISOR`.
- Las URLs generadas:
  - **URL de Edición del Formulario**
  - **URL Pública de Respuestas**
  - **URL del Spreadsheet Maestro**

### Paso 7: Verificar Disparador Único (Trigger)
La función de setup instala automáticamente el disparador único `onPosterFormSubmit` y elimina cualquier duplicado.  
Puede corroborarlo en el menú lateral izquierdo de Apps Script: icono de reloj **"Activadores"** (⏰). Debe figurar **exactamente 1 activador** para `onPosterFormSubmit`.

### Paso 8: Ejecutar Inspección Técnica Normativa
1. En el menú desplegable de funciones, seleccione:
   ```javascript
   inspectPosterSystem
   ```
2. Haga clic en **"Ejecutar"**.
3. Verifique que la salida en consola reporte `PASS` en todos los criterios.

### Paso 9: Realizar Prueba Controlada
1. En el menú de funciones, ejecute:
   ```javascript
   testPosterSubmission
   ```
2. Compruebe en el Spreadsheet que se añadió una fila simulada con folio `SM26-P001` y estatus `RECIBIDO`.
3. Verifique que llegó el correo de confirmación de recepción a la dirección de prueba.

### Paso 10: Limpiar Registros de Prueba
Ejecute la función:
```javascript
cleanPosterTestEntries
```
Esta función eliminará las filas que contengan marcas `PRUEBA DUMMY` del spreadsheet, dejando la base de datos limpia para producción.

### Paso 11: Obtener la URL Pública del Formulario
1. Ejecute la función `getPosterSystemUrls` o abra la URL de edición del formulario.
2. En el editor de Google Forms, haga clic en **"Enviar"** $\rightarrow$ Icono de enlace (🔗) $\rightarrow$ **"Acortar URL"**.
3. Copie la URL pública oficial.

### Paso 12: Integración en la Página Web Oficial
* **REGLA DE ORO:** La URL pública obtenida en el paso anterior será integrada en el repositorio web **únicamente después** de concluir la validación de producción en Google Apps Script.

---

## 3. Limitación Oficial de Google Forms: Subida de Archivos (File Upload)

> [!WARNING]
> ### RESTRICCIÓN DE SEGURIDAD DE GOOGLE FORMS
> Por diseño de Google Workspace, **toda pregunta de tipo "Subir archivos" (File Upload) en Google Forms exige que el participante inicie sesión con una cuenta de Google activa** (cuenta Gmail o Google Workspace institucional/educativo). Esta restricción es mandatoria a nivel de infraestructura de Google para garantizar la cuota de almacenamiento y el escaneo antivirus en Google Drive.

### Alternativa Institucional Documentada
Si el Comité Organizador determina que exigir cuenta de Google a los participantes resulta restrictivo:
* **Mecanismo Desacoplado:** El formulario solicita todos los metadatos institucionales y el resumen en texto, y permite al autor ingresar un enlace de descarga directa en la nube (OneDrive, Google Drive, Dropbox, Box) con permisos públicos de lectura para el archivo PDF del póster (Campo 14 en modo enlace).
* **Seguridad:** **NO** implemente scripts web no autenticados (`doPost` públicos sin autenticación) para subida de archivos binarios, ya que exponen el almacenamiento a ataques de denegación de servicio (DoS) o inyección de malware.

---

## 4. Diagnóstico y Resolución de Problemas (Troubleshooting)

### A. Permisos de Drive / File Upload
* **Síntoma:** Error `Cannot use FileUpload item without authorization` o el ítem no se crea automáticamente mediante script.
* **Causa:** La API pública de Apps Script `FormApp` no expone de forma universal el método `addFileUploadItem` debido a políticas de cuota del dominio.
* **Solución:** `FormBuilder.gs` genera automáticamente la pregunta formal en la Sección 4. Si desea almacenar los archivos en Drive directamente, abra el Formulario en modo edición, diríjase a la Sección 4 ("Archivo del póster"), y en el tipo de respuesta seleccione "Subir archivos". Google creará automáticamente una carpeta vinculada en su Drive.

### B. Permisos de Envío de Correo (Gmail / MailApp)
* **Síntoma:** Error `Exception: Service invoked too many times for one day: email`.
* **Causa:** Las cuentas gratuitas de Gmail tienen una cuota de 100 correos/día; las cuentas institucionales de Google Workspace (como IPN) disponen de 1,500 correos/día.
* **Solución:** Utilice una cuenta institucional oficial (`@ipn.mx`) para el despliegue del script.

### C. Disparadores Duplicados
* **Síntoma:** Un participante recibe dos o más correos de confirmación idénticos tras un solo envío.
* **Solución:** Ejecute en Apps Script la función `removeDuplicatePosterTriggers()`, y luego ejecute `installPosterSubmitTrigger()`. La función de auditoría `inspectPosterSystem()` reportará el recuento exacto de triggers activos.

### D. Hoja de Cálculo Desvinculada o Desincronizada
* **Síntoma:** Las respuestas entran al Formulario pero no se registran en el Spreadsheet.
* **Solución:** En el editor de Google Forms, vaya a la pestaña **"Respuestas"** $\rightarrow$ Menú de tres puntos (⋮) $\rightarrow$ **"Seleccionar destino de las respuestas"** $\rightarrow$ Vincule con la hoja existente `SM2026 — Registro de Pósters`. Luego ejecute `ensurePosterAdminColumns(sheet)`.

---

## 5. Matriz de Control de Metadatos

| Clave | Valor Normativo |
|---|---|
| **PROMPT ID** | `SMREG-P01` |
| **VERSIÓN** | `v1.0.0` |
| **SISTEMA** | `Poster Registration 2026` |
| **ESTADO** | `SOURCE_READY_FOR_APPS_SCRIPT_DEPLOYMENT` |
| **FECHA DEL EVENTO** | Martes 10 de noviembre de 2026 |
| **CORREO OFICIAL** | `semana_meca_UPIIZ@ipn.mx` |
| **FORMATO DE ID** | `SM26-P001`, `SM26-P002`, `SM26-P003`... |
| **DIMENSIONES DEL PÓSTER** | 90 cm ancho × 120 cm alto (Vertical) |
| **FORMATO DE ARCHIVO** | Exclusivamente PDF (máximo 10 MB) |
| **LÍNEAS TEMÁTICAS** | Exactamente 10 áreas oficiales |
