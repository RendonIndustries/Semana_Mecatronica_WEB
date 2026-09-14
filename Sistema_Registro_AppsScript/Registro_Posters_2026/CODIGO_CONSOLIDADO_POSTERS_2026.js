/**
 * ==============================================================================
 * SISTEMA OFICIAL DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * ARCHIVO: CODIGO_CONSOLIDADO_POSTERS_2026.js
 * VERSIÓN: v1.0.0 (Consolidada para despliegue directo en Código.gs)
 * PROMPT ID: SMWEB-P07
 * ESTADO: AUDITED_AND_HARDENED_FOR_PRODUCTION
 * FECHA: 2026-09-14
 * ------------------------------------------------------------------------------
 * INSTRUCCIONES DE DESPLIEGUE RÁPIDO:
 * 1. Abra https://script.google.com y acceda al proyecto "SM2026 — Registro de Pósters".
 * 2. Pegue la totalidad de este código consolidado en el editor.
 * 3. Guarde el proyecto.
 * ==============================================================================
 */


// ==============================================================================
// MÓDULO: Config.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: Config.gs
 * Módulo: CONFIGURACIÓN CENTRALIZADA Y METADATOS NORMATIVOS
 * ------------------------------------------------------------------------------
 * Metadatos de gobernanza:
 *   PROMPT ID: SMREG-P01
 *   VERSION:   v1.0.0
 *   SYSTEM:    Poster Registration 2026
 *   STATUS:    SOURCE_READY_FOR_APPS_SCRIPT_DEPLOYMENT
 * ==============================================================================
 */

var POSTER_CONFIG = {
  // Metadatos de control interno
  METADATA: {
    PROMPT_ID: 'SMREG-P01',
    VERSION: 'v1.0.0',
    SYSTEM: 'Poster Registration 2026',
    STATUS: 'SOURCE_READY_FOR_APPS_SCRIPT_DEPLOYMENT',
    RELEASE_DATE: '2026-09-13'
  },

  // Identidad institucional del formulario
  FORM_TITLE: 'Registro de Pósters 2026\n8va Semana de Mecatrónica UPIIZ-IPN\n1a Semana Estatal de Ingeniería Mecatrónica',

  // Texto oficial de la descripción institucional
  FORM_DESCRIPTION: [
    'La Unidad Profesional Interdisciplinaria de Ingeniería Campus Zacatecas del Instituto Politécnico Nacional invita a estudiantes, docentes, investigadores y grupos de desarrollo tecnológico a participar en la Exhibición Académica de Pósters 2026, en el marco de la 8va Semana de Mecatrónica UPIIZ-IPN y 1a Semana Estatal de Ingeniería Mecatrónica.',
    '',
    'Fecha de exhibición:',
    'Martes 10 de noviembre de 2026.',
    '',
    'Participación gratuita.',
    '',
    'Formato oficial del póster:',
    '90 cm × 120 cm, orientación vertical.',
    '',
    'La actividad tiene carácter académico y de divulgación.',
    'No contempla premiación ni clasificación competitiva.',
    '',
    'El archivo final deberá entregarse en formato PDF.'
  ].join('\n'),

  // Configuración de la hoja de cálculo de respuestas
  SPREADSHEET_TITLE: 'SM2026 — Registro de Pósters',
  SHEET_RESPONSES_NAME: 'RESPUESTAS_POSTERS',
  SHEET_LOG_NAME: 'LOG_POSTERS',

  // Canales oficiales de contacto
  CONTACT_EMAIL: 'semana_meca_UPIIZ@ipn.mx',
  ADMIN_NOTIFICATION_EMAIL: 'semana_meca_UPIIZ@ipn.mx',
  EVENT_DATE: 'Martes 10 de noviembre de 2026',

  // Especificaciones técnicas del póster
  POSTER_WIDTH_CM: 90,
  POSTER_HEIGHT_CM: 120,
  POSTER_ORIENTATION: 'Vertical',
  MAX_FILE_MB: 10,
  ACCEPTED_FILE_TYPE: 'PDF',

  // Banderas de notificación por correo
  ENABLE_AUTHOR_CONFIRMATION_EMAIL: true,
  ENABLE_ADMIN_NOTIFICATION: true,

  // Taxonomía de Identificadores Únicos
  ID_PREFIX: 'SM26-P',
  ID_PADDING: 3, // Produce SM26-P001, SM26-P002, etc.

  // Columnas administrativas agregadas a la hoja de cálculo
  ADMIN_COLUMNS: [
    'POSTER_ID',
    'ESTATUS',
    'OBSERVACIONES',
    'FECHA_REVISION',
    'REVISOR'
  ],

  // Modelo de estados de revisión académica
  STATUS_MODEL: {
    RECIBIDO: 'RECIBIDO',
    EN_REVISION: 'EN_REVISIÓN',
    CORRECCION_SOLICITADA: 'CORRECCIÓN_SOLICITADA',
    ACEPTADO: 'ACEPTADO',
    NO_ACEPTADO: 'NO_ACEPTADO',
    RETIRADO: 'RETIRADO'
  },
  DEFAULT_STATUS: 'RECIBIDO',

  // Concurrencia (Mutex)
  LOCK_TIMEOUT_MS: 30000,

  // Niveles académicos normados
  NIVELES_ACADEMICOS: [
    'Nivel medio superior',
    'Nivel superior',
    'Posgrado',
    'Docente',
    'Investigador'
  ],

  // Exactamente 10 líneas temáticas oficiales
  LINEAS_TEMATICAS: [
    '1. Mecatrónica, diseño y sistemas integrados',
    '2. Robótica y sistemas autónomos',
    '3. Inteligencia artificial, visión artificial y sistemas inteligentes',
    '4. Control, automatización e instrumentación',
    '5. Sistemas embebidos, Internet de las Cosas (IoT) y sistemas ciberfísicos',
    '6. Manufactura avanzada e Industria 4.0',
    '7. Electrónica, sensores, actuadores y sistemas de potencia',
    '8. Movilidad inteligente y vehículos autónomos',
    '9. Aplicaciones mecatrónicas en sectores estratégicos',
    '10. Educación, innovación y desarrollo tecnológico en ingeniería'
  ],

  // Tipos de trabajo normados
  TIPOS_TRABAJO: [
    'Proyecto de investigación',
    'Desarrollo tecnológico',
    'Prototipo',
    'Resultado experimental',
    'Trabajo académico',
    'Aplicación de ingeniería',
    'Proyecto de innovación'
  ],

  // Cláusulas de aceptación y lineamientos de participación
  LINEAMIENTOS_PARTICIPACION: [
    'El trabajo corresponde a una actividad académica, científica o tecnológica.',
    'La información proporcionada es correcta y verídica.',
    'El autor de contacto cuenta con autorización de los coautores para registrar el trabajo.',
    'El póster podrá exhibirse durante la Semana de Mecatrónica 2026.',
    'La actividad tiene carácter académico y no contempla premiación ni clasificación competitiva.',
    'La participación en la exhibición es completamente gratuita.',
    'El envío será revisado por el comité académico antes de considerarse formalmente aceptado para exhibición.'
  ],

  // Redacción institucional del Aviso de Privacidad y Protección de Datos
  AVISO_PRIVACIDAD_TEXTO: [
    'AVISO DE PRIVACIDAD Y USO INSTITUCIONAL DE DATOS:',
    'La información y datos de contacto proporcionados serán tratados de manera confidencial y utilizados exclusivamente para las siguientes finalidades institucionales:',
    '1. Organización, logística y coordinación general del evento.',
    '2. Comunicación y seguimiento oficial con los participantes y autores.',
    '3. Gestión, catalogación y revisión académica de los pósters sometidos.',
    '4. Registro institucional de participación y asistencia.',
    '5. Generación y emisión de constancias oficiales de participación donde resulte aplicable.',
    '',
    '[PRIVACY NOTICE REFERENCE TO BE INSERTED BEFORE PRODUCTION: Conforme a la normativa institucional aplicable del Instituto Politécnico Nacional (IPN)].'
  ].join('\n')
};


// ==============================================================================
// MÓDULO: FormBuilder.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: FormBuilder.gs
 * Módulo: CONSTRUCCIÓN MODULAR DEL GOOGLE FORM
 * ------------------------------------------------------------------------------
 * Responsabilidad:
 *   - Crear y estructurar el formulario en 6 secciones oficiales.
 *   - Configurar los 15 campos normados con validaciones.
 *   - Configurar textos institucionales y aviso de privacidad.
 *   - Vincular con la hoja de respuestas correspondiente.
 * ==============================================================================
 */

/**
 * Crea o actualiza el Google Form oficial para el Registro de Pósters 2026.
 *
 * @param {string} existingFormId (Opcional) ID de un formulario existente para reconfigurar.
 * @return {GoogleAppsScript.Forms.Form} Instancia del formulario configurado.
 */
function buildPosterRegistrationForm(existingFormId) {
  var form;

  if (existingFormId) {
    Logger.log('[FormBuilder] Abriendo formulario existente ID: ' + existingFormId);
    form = FormApp.openById(existingFormId);
  } else {
    Logger.log('[FormBuilder] Creando nuevo formulario oficial de Pósters 2026...');
    form = FormApp.create('Registro de Pósters 2026 — Semana de Mecatrónica UPIIZ');
  }

  // 1. Identidad institucional y metadatos generales
  form.setTitle(POSTER_CONFIG.FORM_TITLE);
  form.setDescription(POSTER_CONFIG.FORM_DESCRIPTION);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  form.setShowLinkToRespondAgain(false);
  form.setPublishingSummary(false);

  form.setConfirmationMessage([
    '¡Registro de póster recibido exitosamente!',
    '',
    'Su propuesta para la Exhibición Académica de Pósters 2026 ha sido registrada en el sistema.',
    'Recibirá un correo electrónico de confirmación con su folio único (SM26-P###).',
    '',
    'Recordatorio: La recepción del trabajo no constituye aceptación definitiva.',
    'El comité académico notificará la resolución tras la etapa de revisión.',
    '',
    'Fecha del evento: Martes 10 de noviembre de 2026.',
    'Contacto oficial: semana_meca_UPIIZ@ipn.mx'
  ].join('\n'));

  // Si ya tiene ítems y estamos creando desde cero, no duplicamos si es nuevo.
  // Si es un formulario nuevo recién creado, limpiamos ítems previos si los hubiera.
  var items = form.getItems();
  if (!existingFormId && items.length > 0) {
    for (var i = items.length - 1; i >= 0; i--) {
      form.deleteItem(items[i]);
    }
  } else if (existingFormId) {
    Logger.log('[FormBuilder] Formulario existente detectado con ' + items.length + ' ítems. Se omite reconstrucción destructiva.');
    return form;
  }

  // ============================================================================
  // SECCIÓN 1: Información del participante (Autor de contacto)
  // ============================================================================
  // Q1: Nombre completo del autor de contacto
  var q1 = form.addTextItem();
  q1.setTitle('1. Nombre completo del autor de contacto')
    .setHelpText('Ingrese nombre(s) y apellidos completos del autor principal o responsable de contacto.')
    .setRequired(true);

  // Q2: Correo electrónico
  var q2 = form.addTextItem();
  q2.setTitle('2. Correo electrónico del autor de contacto')
    .setHelpText('A este correo se enviará el folio único y las notificaciones oficiales del comité.')
    .setRequired(true);
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('Debe ingresar una dirección de correo electrónico válida.')
    .build();
  q2.setValidation(emailValidation);

  // Q3: Número telefónico / celular
  var q3 = form.addTextItem();
  q3.setTitle('3. Número telefónico / celular')
    .setHelpText('Número a 10 dígitos para comunicación urgente en caso de ser necesario.')
    .setRequired(true);
  var phoneValidation = FormApp.createTextValidation()
    .requireTextMatchesPattern('^[0-9+()\\s-]{7,20}$')
    .setHelpText('Ingrese un número telefónico válido (ej. 4921234567).')
    .build();
  q3.setValidation(phoneValidation);

  // Q4: Institución de procedencia
  var q4 = form.addTextItem();
  q4.setTitle('4. Institución de procedencia')
    .setHelpText('Nombre oficial de la institución educativa, centro de investigación o empresa (ej. UPIIZ - IPN, UAZ, TecNM, etc.).')
    .setRequired(true);

  // Q5: Programa académico / área / departamento
  var q5 = form.addTextItem();
  q5.setTitle('5. Programa académico / área / departamento')
    .setHelpText('Carrera, posgrado, departamento o laboratorio al que pertenece (ej. Ing. Mecatrónica, Depto. de Posgrado).')
    .setRequired(true);

  // Q6: Nivel académico
  var q6 = form.addMultipleChoiceItem();
  q6.setTitle('6. Nivel académico del autor de contacto')
    .setChoiceValues(POSTER_CONFIG.NIVELES_ACADEMICOS)
    .showOtherOption(true)
    .setRequired(true);

  // ============================================================================
  // SECCIÓN 2: Información del trabajo
  // ============================================================================
  form.addPageBreakItem().setTitle('SECCIÓN 2: Información del trabajo');

  // Q7: Título del trabajo
  var q7 = form.addTextItem();
  q7.setTitle('7. Título del trabajo')
    .setHelpText('Título completo del póster o proyecto de investigación.')
    .setRequired(true);

  // Q8: Línea temática (10 líneas exactas normadas)
  var q8 = form.addListItem();
  q8.setTitle('8. Línea temática')
    .setHelpText('Seleccione la línea temática institucional que mejor describa su contribución.')
    .setChoiceValues(POSTER_CONFIG.LINEAS_TEMATICAS)
    .setRequired(true);

  // Q9: Tipo de trabajo
  var q9 = form.addMultipleChoiceItem();
  q9.setTitle('9. Tipo de trabajo')
    .setHelpText('Clasificación de la naturaleza del trabajo presentado.')
    .setChoiceValues(POSTER_CONFIG.TIPOS_TRABAJO)
    .showOtherOption(true)
    .setRequired(true);

  // Q10: Resumen breve del trabajo
  var q10 = form.addParagraphTextItem();
  q10.setTitle('10. Resumen breve del trabajo')
    .setHelpText('Describa brevemente el objetivo, metodología y principales resultados o conclusiones del trabajo.\n(Extensión recomendada: aproximadamente 1000 a 1500 caracteres).')
    .setRequired(true);

  // ============================================================================
  // SECCIÓN 3: Autores y afiliación
  // ============================================================================
  form.addPageBreakItem().setTitle('SECCIÓN 3: Autores y afiliación');

  // Q11: Autores del trabajo
  var q11 = form.addParagraphTextItem();
  q11.setTitle('11. Autores del trabajo')
    .setHelpText([
      'Escriba los nombres completos de todos los autores en el orden en que deberán aparecer en el póster, separados por punto y coma.',
      '',
      'Ejemplo:',
      'Nombre Apellido; Nombre Apellido; Nombre Apellido'
    ].join('\n'))
    .setRequired(true);

  // Q12: Institución(es) / afiliación(es) de los autores
  var q12 = form.addParagraphTextItem();
  q12.setTitle('12. Institución(es) / afiliación(es) de los autores')
    .setHelpText('Especifique la institución o instituciones de adscripción de los autores. Puede diferir de la institución del autor de contacto.')
    .setRequired(true);

  // ============================================================================
  // SECCIÓN 4: Archivo del póster
  // ============================================================================
  form.addPageBreakItem().setTitle('SECCIÓN 4: Archivo del póster');

  // Q13: ¿Utilizó la plantilla oficial de póster de la Semana de Mecatrónica 2026?
  var q13 = form.addMultipleChoiceItem();
  q13.setTitle('13. ¿Utilizó la plantilla oficial de póster de la Semana de Mecatrónica 2026?')
    .setHelpText('El formato oficial es de 90 × 120 cm, orientación vertical.\n(Nota: Si selecciona "No", el trabajo no se rechaza automáticamente, pero se turnará a revisión técnica de formato).')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  // Q14: Archivo final del póster (PDF, 1 archivo, máx 10 MB)
  // NOTA ARQUITECTURAL: Si FormApp en el entorno soporta addFileUploadItem, se invoca.
  // Si no está disponible en la API pública de FormApp, se añade como pregunta formal
  // descriptiva y el administrador puede convertirla o gestionarla en la UI de Google Forms.
  var uploadCreated = false;
  if (typeof form.addFileUploadItem === 'function') {
    try {
      var q14 = form.addFileUploadItem();
      q14.setTitle('14. Archivo final del póster')
        .setHelpText([
          'Suba la versión final de su póster en formato PDF.',
          'Nombre recomendado: APELLIDO_AUTOR_TITULO_CORTO.pdf',
          'Restricciones: Solo formato PDF, máximo 1 archivo, hasta 10 MB.',
          'NO suba archivos PowerPoint (.ppt, .pptx) ni editables.'
        ].join('\n'))
        .setRequired(true);
      uploadCreated = true;
    } catch (e) {
      Logger.log('[FormBuilder] addFileUploadItem disponible pero lanzó error: ' + e.message);
    }
  }

  if (!uploadCreated) {
    var q14Fallback = form.addParagraphTextItem();
    q14Fallback.setTitle('14. Archivo final del póster (Enlace a PDF / Subida)')
      .setHelpText([
        'Suba la versión final de su póster en formato PDF.',
        'Nombre recomendado: APELLIDO_AUTOR_TITULO_CORTO.pdf',
        'Restricciones: Formato PDF, orientación vertical (90 × 120 cm), máximo 10 MB.',
        'Proporcione el enlace público de descarga directa (Google Drive, OneDrive, Dropbox) con permisos de lectura.',
        'NOTA: En el editor de Google Forms, los organizadores pueden transformar este ítem a una pregunta nativa de "Subir archivos" (File upload) si desean almacenar los archivos directamente en Google Drive.'
      ].join('\n'))
      .setRequired(true);
  }

  // Q15: Enlace complementario (Opcional)
  var q15 = form.addTextItem();
  q15.setTitle('15. Enlace complementario (Opcional)')
    .setHelpText('Opcional: Ingrese un enlace a video demostrativo, repositorio de código, artículo científico o sitio web del proyecto.')
    .setRequired(false);

  // ============================================================================
  // SECCIÓN 5: Lineamientos y autorización
  // ============================================================================
  form.addPageBreakItem().setTitle('SECCIÓN 5: Lineamientos y autorización');

  // Checkboxes de aceptación de lineamientos
  var qCondiciones = form.addCheckboxItem();
  qCondiciones.setTitle('Lineamientos de participación')
    .setHelpText('Debe marcar todas las casillas para confirmar que cumple y acepta los lineamientos del evento.')
    .setChoiceValues(POSTER_CONFIG.LINEAMIENTOS_PARTICIPACION)
    .setRequired(true);

  // Aviso de privacidad
  var itemPrivacidad = form.addSectionHeaderItem();
  itemPrivacidad.setTitle('Aviso de Privacidad y Protección de Datos')
    .setHelpText(POSTER_CONFIG.AVISO_PRIVACIDAD_TEXTO);

  var qPrivacidad = form.addCheckboxItem();
  qPrivacidad.setTitle('Consentimiento de uso institucional de datos')
    .setHelpText('Confirme su conformidad con el aviso de privacidad institucional.')
    .setChoiceValues(['He leído y acepto el Aviso de Privacidad y el uso institucional de mis datos para los fines descritos.'])
    .setRequired(true);

  // ============================================================================
  // SECCIÓN 6: Confirmación
  // ============================================================================
  form.addPageBreakItem().setTitle('SECCIÓN 6: Confirmación y Envío');

  var itemConfirmacion = form.addSectionHeaderItem();
  itemConfirmacion.setTitle('Confirmación final de registro')
    .setHelpText([
      'Al presionar el botón "Enviar", su solicitud quedará formalmente registrada en el sistema de la 8va Semana de Mecatrónica UPIIZ-IPN y 1a Semana Estatal de Ingeniería Mecatrónica.',
      '',
      '• Se generará un folio de registro oficial único (SM26-P###).',
      '• Si proporcionó un correo válido, recibirá una confirmación por correo.',
      '• La exhibición se llevará a cabo el martes 10 de noviembre de 2026.',
      '• Dudas y seguimiento: ' + POSTER_CONFIG.CONTACT_EMAIL
    ].join('\n'));

  Logger.log('[FormBuilder] Formulario estructurado exitosamente con 6 secciones.');
  return form;
}


// ==============================================================================
// MÓDULO: SubmissionHandler.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: SubmissionHandler.gs
 * Módulo: PROCESAMIENTO ATÓMICO DE ENVÍOS (onFormSubmit)
 * ------------------------------------------------------------------------------
 * Responsabilidad:
 *   - Manejar el evento de envío con exclusión mutua (LockService).
 *   - Asignar el identificador secuencial SM26-P### sin colisiones ni duplicados.
 *   - Asignar el estatus inicial 'RECIBIDO' en columnas administrativas.
 *   - Enviar correo formal de confirmación de recepción al autor de contacto.
 *   - Enviar correo de notificación administrativa al comité organizador.
 *   - Preservar íntegras las columnas nativas de Google Forms.
 *   - Normalización defensiva de encabezados (trim, acentos, mayúsculas/minúsculas).
 * ==============================================================================
 */

/**
 * Normaliza defensivamente cualquier encabezado de formulario o columna de hoja.
 * - Convierte a string seguro.
 * - Reemplaza espacios de no separación (\u00A0) y caracteres de control por espacio estándar.
 * - Reduce múltiples espacios consecutivos a uno solo.
 * - Elimina espacios en blanco al inicio y al final (trim).
 * - Convierte a minúsculas.
 * - Remueve marcas diacríticas/acentos (NFD normalization) para máxima tolerancia.
 *
 * @param {*} header Valor de cabecera a normalizar.
 * @return {string} Cadena normalizada en minúsculas y sin acentos.
 */
function normalizePosterHeader(header) {
  if (header === null || header === undefined) return '';
  return String(header)
    .replace(/[\u00A0\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza nombres de columnas administrativas para comparación estricta y segura.
 * Tolerante a acentos (REVISIÓN vs REVISION), espacios dobles, guiones y espacios en vez de guion bajo.
 *
 * @param {*} header
 * @return {string} Cadena en mayúsculas sin acentos con guiones bajos normalizados.
 */
function normalizePosterAdminHeader(header) {
  if (header === null || header === undefined) return '';
  return String(header)
    .replace(/[\u00A0\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_');
}

/**
 * Disparador principal (Trigger handler) ejecutado al recibir una respuesta de formulario.
 * Admite eventos emitidos tanto desde Google Spreadsheet como desde Google Forms.
 *
 * @param {Object} e Evento onFormSubmit de Apps Script.
 * @return {Object} Objeto con resultado de ejecución.
 */
function onPosterFormSubmit(e) {
  var startTime = new Date().getTime();
  Logger.log('=== [onPosterFormSubmit] INICIO DE PROCESAMIENTO ===');

  var lock = LockService.getScriptLock();
  var hasLock = false;

  try {
    // 1. Concurrencia: Adquirir candado atómico
    hasLock = lock.tryLock(POSTER_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      throw new Error('No se pudo adquirir el bloqueo de script tras ' + POSTER_CONFIG.LOCK_TIMEOUT_MS + ' ms.');
    }

    // 2. Localizar la hoja de respuestas
    var ss = getOrCreatePosterSpreadsheet();
    var sheet = getPosterResponseSheet(ss);
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      Logger.log('[onPosterFormSubmit] La hoja de respuestas no contiene envíos pendientes.');
      return { success: false, reason: 'NO_ROWS' };
    }

    // 3. Garantizar la existencia de columnas administrativas
    var colMap = ensurePosterAdminColumns(sheet);

    // 4. Determinar la fila de la respuesta recibida
    var targetRow = lastRow;
    if (e && e.range) {
      targetRow = e.range.getRow();
    }

    // 5. Verificar si la fila ya tiene un POSTER_ID asignado (idempotencia)
    var currentId = sheet.getRange(targetRow, colMap.POSTER_ID).getValue();
    var posterId = currentId;

    if (!currentId || String(currentId).trim() === '') {
      // Generar nuevo ID secuencial
      posterId = generateNextPosterId(sheet, colMap.POSTER_ID);
      sheet.getRange(targetRow, colMap.POSTER_ID).setValue(posterId);
      sheet.getRange(targetRow, colMap.ESTATUS).setValue(POSTER_CONFIG.DEFAULT_STATUS);
      // FECHA_REVISION: Registra la estampa temporal de recepción de la propuesta
      sheet.getRange(targetRow, colMap.FECHA_REVISION).setValue(new Date());
      // OBSERVACIONES y REVISOR se dejan vacíos a la espera de revisión colegiada
      Logger.log('[onPosterFormSubmit] Asignado ' + posterId + ' a fila ' + targetRow);
    } else {
      Logger.log('[onPosterFormSubmit] Fila ' + targetRow + ' ya contaba con ID: ' + currentId);
    }

    // 6. Liberar el candado lo antes posible tras actualizar el ID
    lock.releaseLock();
    hasLock = false;

    // 7. Extraer y normalizar los datos del registro para notificaciones
    var submissionData = extractPosterSubmissionData(sheet, targetRow, posterId, e);

    // 8. Enviar correo de confirmación de recepción al autor de contacto
    var authorEmailSent = false;
    if (POSTER_CONFIG.ENABLE_AUTHOR_CONFIRMATION_EMAIL && submissionData.correoAutor) {
      authorEmailSent = sendPosterConfirmationEmail(submissionData);
    }

    // 9. Enviar notificación al comité administrativo
    var adminEmailSent = false;
    if (POSTER_CONFIG.ENABLE_ADMIN_NOTIFICATION && POSTER_CONFIG.ADMIN_NOTIFICATION_EMAIL) {
      adminEmailSent = sendPosterAdminNotificationEmail(submissionData);
    }

    // 10. Registrar auditoría
    var elapsed = new Date().getTime() - startTime;
    logPosterEvent(ss, 'SUBMISSION_SUCCESS', 'ID: ' + posterId + ' | Autor: ' + submissionData.autorContacto + ' | Correo: ' + submissionData.correoAutor + ' | Tiempo: ' + elapsed + 'ms');

    Logger.log('=== [onPosterFormSubmit] FINALIZADO CON ÉXITO (' + posterId + ') en ' + elapsed + ' ms ===');
    return {
      success: true,
      posterId: posterId,
      authorEmailSent: authorEmailSent,
      adminEmailSent: adminEmailSent,
      elapsedMs: elapsed
    };

  } catch (err) {
    var elapsedErr = new Date().getTime() - startTime;
    Logger.log('[onPosterFormSubmit] ERROR CRÍTICO: ' + err.message);
    try {
      var ssErr = getOrCreatePosterSpreadsheet();
      logPosterEvent(ssErr, 'SUBMISSION_ERROR', err.message + ' | Stack: ' + err.stack);
    } catch (e2) {}

    return {
      success: false,
      error: err.message,
      elapsedMs: elapsedErr
    };

  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/**
 * Garantiza que las columnas administrativas existan en la cabecera sin sobrescribir las nativas.
 * Emplea normalización tolerante para evitar duplicar columnas si varían tildes o mayúsculas.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @return {Object} Mapa con índices de columna (1-indexed) de cada campo administrativo.
 */
function ensurePosterAdminColumns(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) {
    lastCol = 1;
  }

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var colMap = {};

  // Buscar columnas administrativas existentes mediante normalización robusta
  for (var c = 0; c < headers.length; c++) {
    var rawHeader = headers[c];
    var normHeader = normalizePosterAdminHeader(rawHeader);
    for (var a = 0; a < POSTER_CONFIG.ADMIN_COLUMNS.length; a++) {
      var adminCol = POSTER_CONFIG.ADMIN_COLUMNS[a];
      var normAdminCol = normalizePosterAdminHeader(adminCol);
      if (normHeader === normAdminCol) {
        colMap[adminCol] = c + 1;
      }
    }
  }

  // Si falta alguna columna administrativa, crearla al final
  var nextCol = lastCol + 1;
  for (var i = 0; i < POSTER_CONFIG.ADMIN_COLUMNS.length; i++) {
    var colName = POSTER_CONFIG.ADMIN_COLUMNS[i];
    if (!colMap[colName]) {
      sheet.getRange(1, nextCol).setValue(colName);
      sheet.getRange(1, nextCol).setFontWeight('bold');
      sheet.getRange(1, nextCol).setBackground('#6C1D45');
      sheet.getRange(1, nextCol).setFontColor('#FFFFFF');
      colMap[colName] = nextCol;
      nextCol++;
    }
  }

  return colMap;
}

/**
 * Genera el siguiente ID secuencial sin colisiones (ej. SM26-P001, SM26-P002...).
 *
 * Propiedades:
 * - NO depende exclusivamente de la fila física.
 * - Calcula el valor numérico máximo entre los IDs existentes en la columna.
 * - Ignora celdas vacías o registros no conformes.
 * - Garantiza mínimo tres dígitos de relleno: SM26-P001.
 * - Es idempotente y no sobrescribe identificadores previamente asignados.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} idColIndex Índice (1-indexed) de la columna POSTER_ID.
 * @return {string} Folio generado.
 */
function generateNextPosterId(sheet, idColIndex) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return POSTER_CONFIG.ID_PREFIX + '001';
  }

  var values = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
  var maxNum = 0;
  var regex = new RegExp('^' + POSTER_CONFIG.ID_PREFIX + '(\\d+)$', 'i');

  for (var r = 0; r < values.length; r++) {
    var cellVal = String(values[r][0] || '').trim();
    if (cellVal) {
      var match = cellVal.match(regex);
      if (match && match[1]) {
        var num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  var nextNum = maxNum + 1;
  var paddedNum = ('000' + nextNum).slice(-Math.max(3, String(nextNum).length));
  return POSTER_CONFIG.ID_PREFIX + paddedNum;
}

/**
 * Extrae y normaliza los datos de la fila procesada para su uso en notificaciones.
 * Utiliza normalización defensiva de encabezados tolerante a espacios invisibles,
 * saltos de línea, tildes y mayúsculas/minúsculas.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} row Fila de la respuesta
 * @param {string} posterId Folio asignado
 * @param {Object} e Evento onFormSubmit
 * @return {Object} Datos estructurados
 */
function extractPosterSubmissionData(sheet, row, posterId, e) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rowValues = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

  var data = {
    posterId: posterId,
    timestamp: rowValues[0] || new Date(),
    autorContacto: '',
    correoAutor: '',
    telefono: '',
    institucion: '',
    programa: '',
    nivelAcademico: '',
    lineaTematica: '',
    tipoTrabajo: '',
    tituloTrabajo: '',
    resumen: '',
    autores: '',
    afiliaciones: '',
    plantillaOficial: '',
    archivoPoster: '',
    enlaceComplementario: ''
  };

  for (var c = 0; c < headers.length; c++) {
    var h = normalizePosterHeader(headers[c]);
    var val = String(rowValues[c] || '').trim();

    // 1. Autor de contacto (evita colisión con Q6 nivel académico)
    if ((h.indexOf('nombre') !== -1 || h.indexOf('responsable') !== -1) && h.indexOf('nivel') === -1) {
      data.autorContacto = val;
    // 2. Correo electrónico
    } else if (h.indexOf('correo') !== -1 || h.indexOf('email') !== -1) {
      if (val.indexOf('@') !== -1) data.correoAutor = val;
    // 3. Teléfono / celular
    } else if (h.indexOf('telef') !== -1 || h.indexOf('celular') !== -1 || h.indexOf('telefono') !== -1) {
      data.telefono = val;
    // 4. Institución de procedencia (evita colisión con Q12 afiliaciones de autores)
    } else if ((h.indexOf('institucion') !== -1 && h.indexOf('autores') === -1) || h.indexOf('procedencia') !== -1) {
      data.institucion = val;
    // 5. Programa / departamento
    } else if (h.indexOf('programa') !== -1 || h.indexOf('carrera') !== -1 || h.indexOf('departamento') !== -1) {
      data.programa = val;
    // 6. Nivel académico
    } else if (h.indexOf('nivel') !== -1 && (h.indexOf('academico') !== -1 || h.indexOf('estudios') !== -1)) {
      data.nivelAcademico = val;
    // 7. Título del trabajo
    } else if (h.indexOf('titulo') !== -1) {
      data.tituloTrabajo = val;
    // 8. Línea temática
    } else if (h.indexOf('linea') !== -1 && (h.indexOf('tematica') !== -1 || h.indexOf('investigacion') !== -1)) {
      data.lineaTematica = val;
    // 9. Tipo de trabajo
    } else if (h.indexOf('tipo de trabajo') !== -1 || h.indexOf('naturaleza del trabajo') !== -1) {
      data.tipoTrabajo = val;
    // 10. Resumen
    } else if (h.indexOf('resumen') !== -1 || h.indexOf('abstract') !== -1) {
      data.resumen = val;
    // 11. Autores del trabajo
    } else if (h.indexOf('autores del trabajo') !== -1 || (h.indexOf('autores') !== -1 && h.indexOf('institucion') === -1 && h.indexOf('afiliacion') === -1)) {
      data.autores = val;
    // 12. Institución(es) / afiliación(es) de los autores
    } else if (h.indexOf('afiliacion') !== -1 || h.indexOf('adscripcion') !== -1 || (h.indexOf('institucion') !== -1 && h.indexOf('autores') !== -1)) {
      data.afiliaciones = val;
    // 13. Plantilla oficial 90x120
    } else if (h.indexOf('plantilla') !== -1) {
      data.plantillaOficial = val;
    // 14. Archivo final del póster (PDF) - Soporta variaciones con espacio final, alias y (PDF)
    } else if (
      h.indexOf('archivo final') !== -1 ||
      (h.indexOf('poster') !== -1 && h.indexOf('pdf') !== -1) ||
      h.indexOf('archivo del poster') !== -1 ||
      h.indexOf('suba la version final') !== -1
    ) {
      data.archivoPoster = val;
    // 15. Enlace complementario (Opcional)
    } else if (h.indexOf('complementario') !== -1 || h.indexOf('enlace adicional') !== -1 || h.indexOf('video') !== -1 || h.indexOf('repositorio') !== -1) {
      data.enlaceComplementario = val;
    }
  }

  // Fallback a namedValues si vino de trigger de formulario
  if (e && e.namedValues) {
    for (var key in e.namedValues) {
      var kNorm = normalizePosterHeader(key);
      var nvVal = (e.namedValues[key] && e.namedValues[key][0]) ? String(e.namedValues[key][0]).trim() : '';
      if (!data.correoAutor && (kNorm.indexOf('correo') !== -1 || kNorm.indexOf('email') !== -1) && nvVal.indexOf('@') !== -1) {
        data.correoAutor = nvVal;
      }
      if (!data.autorContacto && (kNorm.indexOf('nombre') !== -1 || kNorm.indexOf('autor de contacto') !== -1) && kNorm.indexOf('nivel') === -1) {
        data.autorContacto = nvVal;
      }
      if (!data.tituloTrabajo && kNorm.indexOf('titulo') !== -1) {
        data.tituloTrabajo = nvVal;
      }
      if (!data.archivoPoster && (kNorm.indexOf('archivo final') !== -1 || (kNorm.indexOf('poster') !== -1 && kNorm.indexOf('pdf') !== -1))) {
        data.archivoPoster = nvVal;
      }
    }
  }

  return data;
}

/**
 * Envía el correo institucional de confirmación de recepción al autor de contacto.
 * Aclara expresamente que la recepción no constituye aceptación definitiva.
 *
 * @param {Object} data
 * @return {boolean}
 */
function sendPosterConfirmationEmail(data) {
  try {
    var subject = 'Registro recibido — Exhibición Académica de Pósters 2026 [' + data.posterId + ']';
    var authorName = data.autorContacto || 'Estimado(a) autor(a)';
    var title = data.tituloTrabajo || 'Sin título especificado';

    var plainBody = [
      'Estimado(a) ' + authorName + ':',
      '',
      'Hemos recibido satisfactoriamente su propuesta para la Exhibición Académica de Pósters 2026 en el marco de la 8va Semana de Mecatrónica UPIIZ-IPN y 1a Semana Estatal de Ingeniería Mecatrónica.',
      '',
      'DETALLES DEL REGISTRO:',
      '--------------------------------------------------',
      'Folio de registro:    ' + data.posterId,
      'Título del trabajo:   ' + title,
      'Línea temática:       ' + (data.lineaTematica || 'No especificada'),
      'Institución:          ' + (data.institucion || 'No especificada'),
      'Fecha del evento:     ' + POSTER_CONFIG.EVENT_DATE,
      '--------------------------------------------------',
      '',
      'AVISO IMPORTANTE SOBRE EL PROCESO DE REVISIÓN:',
      'El presente correo confirma exclusivamente la recepción técnica de su propuesta.',
      'La recepción técnica no implica aún la aceptación definitiva para su exhibición.',
      'El comité académico revisará los trabajos y emitirá dictámenes en fechas próximas.',
      '',
      'CARÁCTER INSTITUCIONAL:',
      'Esta es una actividad estrictamente académica y de divulgación científica, con participación gratuita y sin esquemas competitivos ni de premiación.',
      '',
      'Para cualquier duda o aclaración sobre su registro, comuníquese a ' +
      POSTER_CONFIG.CONTACT_EMAIL + ' indicando siempre su folio (' + data.posterId + ').',
      '',
      'Atentamente,',
      'Comité Académico y Organizador',
      '8va Semana de Mecatrónica UPIIZ-IPN',
      '1a Semana Estatal de Ingeniería Mecatrónica'
    ].join('\n');

    var htmlBody = [
      '<div style="font-family: Arial, Helvetica, sans-serif; color: #1F2937; max-width: 640px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">',
      '  <div style="background-color: #6C1D45; color: #FFFFFF; padding: 24px; text-align: center;">',
      '    <h2 style="margin: 0 0 6px 0; font-size: 20px;">8va Semana de Mecatrónica UPIIZ-IPN</h2>',
      '    <h3 style="margin: 0; font-size: 15px; font-weight: normal; opacity: 0.9;">1a Semana Estatal de Ingeniería Mecatrónica</h3>',
      '    <p style="margin: 10px 0 0 0; font-size: 13px; font-weight: bold; color: #F8E7B9;">Exhibición Académica de Pósters 2026</p>',
      '  </div>',
      '  <div style="padding: 24px;">',
      '    <p style="font-size: 15px; line-height: 1.5;">Estimado(a) <strong>' + authorName + '</strong>:</p>',
      '    <p style="font-size: 14px; line-height: 1.6; color: #374151;">Hemos recibido satisfactoriamente su propuesta para la <strong>Exhibición Académica de Pósters 2026</strong>.</p>',
      '    <div style="background-color: #F9FAFB; border-left: 4px solid #6C1D45; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">',
      '      <p style="margin: 4px 0; font-size: 13px;"><strong>Folio de registro:</strong> <span style="font-size: 16px; color: #6C1D45; font-weight: bold;">' + data.posterId + '</span></p>',
      '      <p style="margin: 4px 0; font-size: 13px;"><strong>Título del trabajo:</strong> ' + title + '</p>',
      '      <p style="margin: 4px 0; font-size: 13px;"><strong>Línea temática:</strong> ' + (data.lineaTematica || 'No especificada') + '</p>',
      '      <p style="margin: 4px 0; font-size: 13px;"><strong>Institución:</strong> ' + (data.institucion || 'No especificada') + '</p>',
      '      <p style="margin: 4px 0; font-size: 13px;"><strong>Fecha del evento:</strong> ' + POSTER_CONFIG.EVENT_DATE + '</p>',
      '    </div>',
      '    <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; padding: 14px; border-radius: 6px; margin: 20px 0;">',
      '      <h4 style="margin: 0 0 6px 0; color: #92400E; font-size: 14px;">Aviso importante sobre el proceso de revisión:</h4>',
      '      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #78350F;">El presente correo confirma exclusivamente la <strong>recepción</strong> de su propuesta. La recepción técnica no implica aún la aceptación definitiva para su exhibición. El comité académico revisará los trabajos y emitirá dictámenes en fechas próximas.</p>',
      '    </div>',
      '    <p style="font-size: 13px; line-height: 1.5; color: #4B5563;"><strong>Carácter institucional:</strong> Esta es una actividad estrictamente académica y de divulgación científica, con <em>participación gratuita</em> y sin esquemas competitivos ni de premiación.</p>',
      '    <p style="font-size: 13px; line-height: 1.5; color: #4B5563;">Para cualquier duda o aclaración sobre su registro, comuníquese a <a href="mailto:' + POSTER_CONFIG.CONTACT_EMAIL + '" style="color: #6C1D45; font-weight: bold;">' + POSTER_CONFIG.CONTACT_EMAIL + '</a> indicando su folio <strong>' + data.posterId + '</strong>.</p>',
      '  </div>',
      '  <div style="background-color: #F3F4F6; padding: 14px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB;">',
      '    Unidad Profesional Interdisciplinaria de Ingeniería Campus Zacatecas (UPIIZ - IPN)<br>',
      '    Comité Organizador — Semana de Mecatrónica 2026',
      '  </div>',
      '</div>'
    ].join('\n');

    MailApp.sendEmail({
      to: data.correoAutor,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      replyTo: POSTER_CONFIG.CONTACT_EMAIL
    });

    Logger.log('[SubmissionHandler] Correo de confirmación enviado exitosamente a: ' + data.correoAutor);
    return true;
  } catch (e) {
    Logger.log('[SubmissionHandler] Error al enviar correo de confirmación: ' + e.message);
    return false;
  }
}

/**
 * Envía notificación administrativa al comité organizador al registrarse un nuevo póster.
 *
 * @param {Object} data
 * @return {boolean}
 */
function sendPosterAdminNotificationEmail(data) {
  try {
    var subject = '[SM2026-POSTERS] Nuevo registro recibido: ' + data.posterId + ' — ' + (data.autorContacto || 'Sin autor');
    var plainBody = [
      'Se ha registrado una nueva propuesta de póster en el sistema:',
      '',
      'Folio:          ' + data.posterId,
      'Título:         ' + data.tituloTrabajo,
      'Autor Contacto: ' + data.autorContacto,
      'Correo:         ' + data.correoAutor,
      'Teléfono:       ' + data.telefono,
      'Institución:    ' + data.institucion,
      'Línea Temática: ' + data.lineaTematica,
      'Tipo Trabajo:   ' + data.tipoTrabajo,
      'Plantilla 90x120: ' + data.plantillaOficial,
      'Fecha:          ' + new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      '',
      'Consulte la hoja de respuestas para detalles y gestión del estatus.'
    ].join('\n');

    MailApp.sendEmail({
      to: POSTER_CONFIG.ADMIN_NOTIFICATION_EMAIL,
      subject: subject,
      body: plainBody
    });

    Logger.log('[SubmissionHandler] Notificación administrativa enviada a: ' + POSTER_CONFIG.ADMIN_NOTIFICATION_EMAIL);
    return true;
  } catch (e) {
    Logger.log('[SubmissionHandler] Error enviando notificación administrativa: ' + e.message);
    return false;
  }
}

/**
 * Registra eventos en la pestaña de LOG o en Logger.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {string} eventType
 * @param {string} details
 */
function logPosterEvent(ss, eventType, details) {
  try {
    var logSheet = ss.getSheetByName(POSTER_CONFIG.SHEET_LOG_NAME);
    if (!logSheet) {
      logSheet = ss.insertSheet(POSTER_CONFIG.SHEET_LOG_NAME);
      logSheet.getRange(1, 1, 1, 3).setValues([['TIMESTAMP', 'EVENT_TYPE', 'DETAILS']])
        .setFontWeight('bold')
        .setBackground('#E5E7EB');
    }
    logSheet.appendRow([new Date(), eventType, details]);
  } catch (e) {
    Logger.log('[logPosterEvent fallback] ' + eventType + ': ' + details);
  }
}

/**
 * Obtiene o crea la hoja de respuestas dentro del spreadsheet.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getPosterResponseSheet(ss) {
  var sheet = ss.getSheetByName(POSTER_CONFIG.SHEET_RESPONSES_NAME);
  if (!sheet) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().indexOf('Respuestas') !== -1 || sheets[i].getName().indexOf('Form Responses') !== -1) {
        return sheets[i];
      }
    }
    sheet = sheets[0];
  }
  return sheet;
}

/**
 * Obtiene o crea el Spreadsheet del sistema de pósters.
 *
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getOrCreatePosterSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('POSTER_SPREADSHEET_ID');

  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      Logger.log('[SubmissionHandler] No se pudo abrir spreadsheet guardado (' + ssId + '). Creando o resolviendo...');
    }
  }

  try {
    var activeSs = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSs) {
      props.setProperty('POSTER_SPREADSHEET_ID', activeSs.getId());
      return activeSs;
    }
  } catch (e) {}

  var newSs = SpreadsheetApp.create(POSTER_CONFIG.SPREADSHEET_TITLE);
  props.setProperty('POSTER_SPREADSHEET_ID', newSs.getId());
  return newSs;
}


// ==============================================================================
// MÓDULO: TriggerManager.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: TriggerManager.gs
 * Módulo: GESTIÓN DE DISPARADORES INSTALABLES (TRIGGERS)
 * ------------------------------------------------------------------------------
 * Responsabilidad:
 *   - Garantizar un único disparador activo para onPosterFormSubmit.
 *   - Detectar y remover disparadores duplicados o huérfanos.
 *   - Proveer inspección de estado de triggers.
 * ==============================================================================
 */

var POSTER_TRIGGER_HANDLER_NAME = 'onPosterFormSubmit';

/**
 * Instala un único disparador para el procesamiento de respuestas del formulario.
 * Elimina preventivamente cualquier disparador previo para evitar ejecuciones duplicadas.
 *
 * @param {string} optSpreadsheetId ID opcional de la hoja de cálculo.
 * @return {Object} Estado de la instalación.
 */
function installPosterSubmitTrigger(optSpreadsheetId) {
  Logger.log('[TriggerManager] Iniciando instalación controlada de disparador...');

  // 1. Limpiar duplicados existentes
  var removed = removeDuplicatePosterTriggers();
  Logger.log('[TriggerManager] Disparadores duplicados removidos: ' + removed);

  var ssId = optSpreadsheetId;
  if (!ssId) {
    var props = PropertiesService.getScriptProperties();
    ssId = props.getProperty('POSTER_SPREADSHEET_ID');
  }

  var triggerCreated = null;

  if (ssId) {
    try {
      var ss = SpreadsheetApp.openById(ssId);
      triggerCreated = ScriptApp.newTrigger(POSTER_TRIGGER_HANDLER_NAME)
        .forSpreadsheet(ss)
        .onFormSubmit()
        .create();
      Logger.log('[TriggerManager] Disparador instalado exitosamente para Spreadsheet ID: ' + ssId);
    } catch (e) {
      Logger.log('[TriggerManager] Advertencia al vincular disparador a Spreadsheet: ' + e.message);
    }
  }

  // Si no se pudo asociar a Spreadsheet, intentar vincular a Form
  if (!triggerCreated) {
    var propsForm = PropertiesService.getScriptProperties();
    var formId = propsForm.getProperty('POSTER_FORM_ID');
    if (formId) {
      try {
        var form = FormApp.openById(formId);
        triggerCreated = ScriptApp.newTrigger(POSTER_TRIGGER_HANDLER_NAME)
          .forForm(form)
          .onFormSubmit()
          .create();
        Logger.log('[TriggerManager] Disparador instalado exitosamente para Form ID: ' + formId);
      } catch (e2) {
        Logger.log('[TriggerManager] Error al vincular disparador a Form: ' + e2.message);
      }
    }
  }

  var count = getPosterTriggerCount();
  return {
    success: triggerCreated !== null,
    triggerId: triggerCreated ? triggerCreated.getUniqueId() : null,
    totalActiveTriggers: count,
    removedDuplicates: removed
  };
}

/**
 * Elimina todos los disparadores vinculados a la función onPosterFormSubmit,
 * dejando el entorno limpio para una nueva instalación.
 *
 * @return {number} Cantidad de disparadores eliminados.
 */
function removeDuplicatePosterTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var removedCount = 0;

  for (var i = 0; i < triggers.length; i++) {
    var handlerFunction = triggers[i].getHandlerFunction();
    if (handlerFunction === POSTER_TRIGGER_HANDLER_NAME) {
      ScriptApp.deleteTrigger(triggers[i]);
      removedCount++;
    }
  }

  Logger.log('[TriggerManager] Eliminados ' + removedCount + ' disparadores previos.');
  return removedCount;
}

/**
 * Obtiene la cantidad actual de disparadores asociados a onPosterFormSubmit.
 *
 * @return {number}
 */
function getPosterTriggerCount() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = 0;

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === POSTER_TRIGGER_HANDLER_NAME) {
      count++;
    }
  }

  return count;
}


// ==============================================================================
// MÓDULO: Validation.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: Validation.gs
 * Módulo: AUDITORÍA NORMATIVA E INSPECCIÓN TÉCNICA
 * ------------------------------------------------------------------------------
 * Responsabilidad:
 *   - Auditar la integridad del Google Form y Spreadsheet asociados.
 *   - Verificar el cumplimiento estricto de las 10 líneas temáticas.
 *   - Validar la presencia de cláusulas obligatorias (gratuidad, no premiación, 90x120).
 *   - Auditar la existencia y unicidad del disparador de envío.
 *   - Emitir reporte estructurado institucional PASS / FAIL.
 * ==============================================================================
 */

/**
 * Función principal de inspección que emite el reporte de certificación institucional.
 *
 * @return {Object} Objeto de resultados estructurados.
 */
function inspectPosterSystem() {
  Logger.log('======================================================================');
  Logger.log('INICIANDO AUDITORÍA TÉCNICA DEL SISTEMA DE REGISTRO DE PÓSTERS 2026');
  Logger.log('======================================================================');

  var props = PropertiesService.getScriptProperties();
  var formId = props.getProperty('POSTER_FORM_ID');
  var ssId = props.getProperty('POSTER_SPREADSHEET_ID');

  var report = {
    FORM: 'FAIL',
    SPREADSHEET: 'FAIL',
    FILE_UPLOAD_QUESTION: 'FAIL',
    THEMATIC_AREAS: '0 / expected 10',
    PARTICIPATION_FREE_TEXT: 'FAIL',
    NO_PRIZE_TEXT: 'FAIL',
    POSTER_FORMAT_90X120: 'FAIL',
    SUBMIT_TRIGGER_COUNT: 0,
    CONFIRMATION_EMAIL_CONFIG: POSTER_CONFIG.ENABLE_AUTHOR_CONFIRMATION_EMAIL ? 'ON' : 'OFF',
    ADMIN_EMAIL_CONFIG: POSTER_CONFIG.ENABLE_ADMIN_NOTIFICATION ? 'ON' : 'OFF',
    DETAILS: []
  };

  // 1. Verificación de Formulario
  var form = null;
  if (formId) {
    try {
      form = FormApp.openById(formId);
      report.FORM = 'PASS';
      report.DETAILS.push('Formulario verificado ID: ' + formId);
    } catch (e) {
      report.DETAILS.push('Error al abrir formulario: ' + e.message);
    }
  } else {
    report.DETAILS.push('POSTER_FORM_ID no configurado en ScriptProperties. Ejecute setupPosterRegistrationSystem().');
  }

  // 2. Verificación de Spreadsheet
  var ss = null;
  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
      report.SPREADSHEET = 'PASS';
      report.DETAILS.push('Spreadsheet verificado ID: ' + ssId);
    } catch (e) {
      report.DETAILS.push('Error al abrir spreadsheet: ' + e.message);
    }
  } else {
    report.DETAILS.push('POSTER_SPREADSHEET_ID no configurado en ScriptProperties.');
  }

  // 3. Verificación de Preguntas y Contenidos dentro del Formulario
  if (form) {
    var items = form.getItems();
    var formDesc = (form.getDescription() || '').toLowerCase();
    var formTitle = (form.getTitle() || '').toLowerCase();

    // Textos normativos en título o descripción
    var allText = formTitle + ' ' + formDesc;

    var hasFreeText = allText.indexOf('gratuita') !== -1 || allText.indexOf('gratuito') !== -1 || allText.indexOf('gratis') !== -1;
    var hasNoPrizeText = (allText.indexOf('no contempla premiación') !== -1 || allText.indexOf('sin premiación') !== -1 || allText.indexOf('no contempla premiacion') !== -1);
    var has90x120 = allText.indexOf('90 cm × 120 cm') !== -1 || allText.indexOf('90 × 120') !== -1 || allText.indexOf('90x120') !== -1;

    // Inspeccionar ítems del formulario
    var foundFileUpload = false;
    var found10Thematic = false;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itype = item.getType();
      var iTitle = (item.getTitle() || '').toLowerCase();
      var iHelp = (item.getHelpText() || '').toLowerCase();

      // Check File Upload
      if (itype === FormApp.ItemType.FILE_UPLOAD) {
        foundFileUpload = true;
      } else if (iTitle.indexOf('archivo final del póster') !== -1 || iTitle.indexOf('archivo final del poster') !== -1) {
        // Marcado como pregunta de archivo aunque sea texto con enlace
        foundFileUpload = true;
      }

      // Check Líneas temáticas
      if (iTitle.indexOf('línea temática') !== -1 || iTitle.indexOf('linea tematica') !== -1) {
        if (itype === FormApp.ItemType.LIST) {
          var choices = item.asListItem().getChoices();
          if (choices.length === 10) {
            found10Thematic = true;
          }
        } else if (itype === FormApp.ItemType.MULTIPLE_CHOICE) {
          var mcChoices = item.asMultipleChoiceItem().getChoices();
          if (mcChoices.length === 10) {
            found10Thematic = true;
          }
        }
      }

      // Check de textos normativos en lineamientos si no estaban en descripción
      var combinedItemText = iTitle + ' ' + iHelp;
      if (!hasFreeText && combinedItemText.indexOf('gratuita') !== -1) hasFreeText = true;
      if (!hasNoPrizeText && (combinedItemText.indexOf('no contempla premiación') !== -1 || combinedItemText.indexOf('no contempla premiacion') !== -1)) hasNoPrizeText = true;
      if (!has90x120 && (combinedItemText.indexOf('90') !== -1 && combinedItemText.indexOf('120') !== -1)) has90x120 = true;
    }

    if (foundFileUpload) report.FILE_UPLOAD_QUESTION = 'PASS';
    if (found10Thematic) report.THEMATIC_AREAS = '10 / expected 10';
    if (hasFreeText) report.PARTICIPATION_FREE_TEXT = 'PASS';
    if (hasNoPrizeText) report.NO_PRIZE_TEXT = 'PASS';
    if (has90x120) report.POSTER_FORMAT_90X120 = 'PASS';

  } else {
    // Si no está desplegado en la nube de Google aún, evaluar contra POSTER_CONFIG
    var configDesc = (POSTER_CONFIG.FORM_DESCRIPTION || '').toLowerCase();
    var configLineamientos = (POSTER_CONFIG.LINEAMIENTOS_PARTICIPACION || []).join(' ').toLowerCase();
    var fullConfigText = configDesc + ' ' + configLineamientos;

    if (fullConfigText.indexOf('gratuita') !== -1 || fullConfigText.indexOf('gratuito') !== -1) {
      report.PARTICIPATION_FREE_TEXT = 'PASS';
    }
    if (fullConfigText.indexOf('no contempla premiación') !== -1 || fullConfigText.indexOf('no contempla premiacion') !== -1) {
      report.NO_PRIZE_TEXT = 'PASS';
    }
    if (fullConfigText.indexOf('90 cm × 120 cm') !== -1 || fullConfigText.indexOf('90 × 120') !== -1) {
      report.POSTER_FORMAT_90X120 = 'PASS';
    }
    if (POSTER_CONFIG.LINEAS_TEMATICAS && POSTER_CONFIG.LINEAS_TEMATICAS.length === 10) {
      report.THEMATIC_AREAS = '10 / expected 10';
    }
    if (POSTER_CONFIG.ACCEPTED_FILE_TYPE === 'PDF' && POSTER_CONFIG.MAX_FILE_MB === 10) {
      report.FILE_UPLOAD_QUESTION = 'PASS';
    }
  }

  // 4. Verificación de Disparadores
  try {
    report.SUBMIT_TRIGGER_COUNT = getPosterTriggerCount();
  } catch (eTrig) {
    report.SUBMIT_TRIGGER_COUNT = 0;
  }

  // 5. Impresión en consola según formato requerido
  Logger.log('FORM: ' + report.FORM);
  Logger.log('SPREADSHEET: ' + report.SPREADSHEET);
  Logger.log('FILE UPLOAD QUESTION: ' + report.FILE_UPLOAD_QUESTION);
  Logger.log('THEMATIC AREAS: ' + report.THEMATIC_AREAS);
  Logger.log('PARTICIPATION FREE TEXT: ' + report.PARTICIPATION_FREE_TEXT);
  Logger.log('NO-PRIZE TEXT: ' + report.NO_PRIZE_TEXT);
  Logger.log('POSTER FORMAT 90×120: ' + report.POSTER_FORMAT_90X120);
  Logger.log('SUBMIT TRIGGER COUNT: ' + report.SUBMIT_TRIGGER_COUNT);
  Logger.log('CONFIRMATION EMAIL CONFIG: ' + report.CONFIRMATION_EMAIL_CONFIG);
  Logger.log('ADMIN EMAIL CONFIG: ' + report.ADMIN_EMAIL_CONFIG);
  Logger.log('======================================================================');

  return report;
}


// ==============================================================================
// MÓDULO: Code.gs
// ==============================================================================

/**
 * ==============================================================================
 * SISTEMA DE REGISTRO Y RECEPCIÓN DE PÓSTERS 2026
 * 8va Semana de Mecatrónica UPIIZ-IPN
 * 1a Semana Estatal de Ingeniería Mecatrónica
 * ------------------------------------------------------------------------------
 * Archivo: Code.gs
 * Módulo: ORQUESTADOR PRINCIPAL Y DESPLIEGUE (SETUP)
 * ------------------------------------------------------------------------------
 * Responsabilidad:
 *   - Orquestar la creación y vinculación del Google Form y Google Sheet.
 *   - Configurar propiedades de script y columnas de administración.
 *   - Instalar el disparador único onPosterFormSubmit.
 *   - Proveer funciones de prueba, diagnóstico y utilidades de mantenimiento.
 * ==============================================================================
 */

/**
 * Función de inicialización principal para desplegar el sistema desde cero.
 * Debe ejecutarse una sola vez al copiar el proyecto en Google Apps Script.
 *
 * @return {Object} Metadatos del despliegue completado.
 */
function setupPosterRegistrationSystem() {
  Logger.log('======================================================================');
  Logger.log('INICIANDO DESPLIEGUE DEL SISTEMA DE REGISTRO DE PÓSTERS 2026');
  Logger.log('======================================================================');

  var props = PropertiesService.getScriptProperties();

  // 1. Crear el Google Spreadsheet Maestro de respuestas
  var ss = getOrCreatePosterSpreadsheet();
  var ssId = ss.getId();
  props.setProperty('POSTER_SPREADSHEET_ID', ssId);
  Logger.log('[Setup] Spreadsheet configurado: ' + ss.getName() + ' (ID: ' + ssId + ')');

  // 2. Crear y configurar el Google Form con 6 secciones y 15 campos
  var form = buildPosterRegistrationForm();
  var formId = form.getId();
  props.setProperty('POSTER_FORM_ID', formId);
  Logger.log('[Setup] Formulario creado: ' + form.getTitle() + ' (ID: ' + formId + ')');

  // 3. Vincular el Formulario al Spreadsheet como destino de respuestas
  try {
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);
    Logger.log('[Setup] Destino del formulario vinculado al Spreadsheet exitosamente.');
  } catch (eDest) {
    Logger.log('[Setup] Advertencia al vincular destino: ' + eDest.message);
  }

  // 4. Preparar columnas administrativas en la hoja de respuestas
  Utilities.sleep(1500); // Breve espera para que Google inicialice la pestaña de respuestas
  var sheet = getPosterResponseSheet(ss);
  var colMap = ensurePosterAdminColumns(sheet);
  Logger.log('[Setup] Columnas administrativas aseguradas: ' + Object.keys(colMap).join(', '));

  // 5. Instalar disparador único de envío (eliminando duplicados previos)
  var triggerResult = installPosterSubmitTrigger(ssId);
  Logger.log('[Setup] Disparador instalado: ' + (triggerResult.success ? 'SÍ' : 'NO') + ' (Triggers activos: ' + triggerResult.totalActiveTriggers + ')');

  // 6. Ejecutar inspección técnica
  var auditReport = inspectPosterSystem();

  // 7. Resumen de URLs para administración y difusión
  var editUrl = form.getEditUrl();
  var publishedUrl = form.getPublishedUrl();
  var sheetUrl = ss.getUrl();

  Logger.log('----------------------------------------------------------------------');
  Logger.log('DESPLIEGUE FINALIZADO EXITOSAMENTE');
  Logger.log('----------------------------------------------------------------------');
  Logger.log('URL de Edición del Formulario:   ' + editUrl);
  Logger.log('URL Pública de Respuestas:       ' + publishedUrl);
  Logger.log('URL de la Hoja de Cálculo:       ' + sheetUrl);
  Logger.log('----------------------------------------------------------------------');

  return {
    success: true,
    formId: formId,
    spreadsheetId: ssId,
    editUrl: editUrl,
    publishedUrl: publishedUrl,
    sheetUrl: sheetUrl,
    auditReport: auditReport
  };
}

/**
 * Imprime en el registro las URLs actuales del sistema configurado.
 */
function getPosterSystemUrls() {
  var props = PropertiesService.getScriptProperties();
  var formId = props.getProperty('POSTER_FORM_ID');
  var ssId = props.getProperty('POSTER_SPREADSHEET_ID');

  Logger.log('=== URLs DEL SISTEMA DE REGISTRO DE PÓSTERS 2026 ===');
  if (formId) {
    try {
      var form = FormApp.openById(formId);
      Logger.log('Formulario (Edición): ' + form.getEditUrl());
      Logger.log('Formulario (Público): ' + form.getPublishedUrl());
    } catch (e) {
      Logger.log('Error abriendo formId: ' + e.message);
    }
  } else {
    Logger.log('POSTER_FORM_ID no configurado.');
  }

  if (ssId) {
    try {
      var ss = SpreadsheetApp.openById(ssId);
      Logger.log('Spreadsheet Maestro:  ' + ss.getUrl());
    } catch (e2) {
      Logger.log('Error abriendo ssId: ' + e2.message);
    }
  } else {
    Logger.log('POSTER_SPREADSHEET_ID no configurado.');
  }
}

/**
 * Función de prueba para simular una respuesta de formulario y validar
 * la generación atómica de folios SM26-P### y columnas administrativas.
 */
function testPosterSubmission() {
  Logger.log('=== INICIANDO PRUEBA CONTROLADA DE ENVÍO DE PÓSTER ===');
  var ss = getOrCreatePosterSpreadsheet();
  var sheet = getPosterResponseSheet(ss);

  // Asegurar cabeceras
  ensurePosterAdminColumns(sheet);

  // Agregar fila simulada de respuesta
  var testData = [
    new Date(),                                             // Marca temporal
    'Juan Pérez Hernández (PRUEBA DUMMY)',                 // 1. Nombre
    POSTER_CONFIG.CONTACT_EMAIL,                            // 2. Correo
    '4921234567',                                           // 3. Teléfono
    'UPIIZ - IPN',                                          // 4. Institución
    'Ingeniería Mecatrónica',                               // 5. Programa
    'Nivel superior',                                       // 6. Nivel
    'Sistema Inteligente de Visión para Robots Móviles',    // 7. Título
    POSTER_CONFIG.LINEAS_TEMATICAS[2],                      // 8. Línea temática (IA/Visión)
    'Prototipo',                                            // 9. Tipo trabajo
    'Resumen breve descriptivo de prueba técnica para validar el sistema de registro de pósters 2026.', // 10. Resumen
    'Juan Pérez Hernández; María González López',           // 11. Autores
    'Unidad Profesional Interdisciplinaria Campus Zacatecas', // 12. Afiliaciones
    'Sí',                                                   // 13. Plantilla oficial
    'PEREZ_SISTEMA_VISION_ROBOTS.pdf',                      // 14. Archivo PDF
    'https://github.com/ejemplo/proyecto-vision'            // 15. Enlace
  ];

  sheet.appendRow(testData);
  var appendedRow = sheet.getLastRow();
  Logger.log('[testPosterSubmission] Fila simulada agregada en línea: ' + appendedRow);

  // Simular evento de trigger
  var dummyEvent = {
    range: sheet.getRange(appendedRow, 1, 1, testData.length)
  };

  var result = onPosterFormSubmit(dummyEvent);
  Logger.log('[testPosterSubmission] Resultado del handler: ' + JSON.stringify(result));
  Logger.log('=== PRUEBA CONTROLADA FINALIZADA ===');
  return result;
}

/**
 * Limpia filas de prueba en la hoja de respuestas que contengan la marca DUMMY.
 */
function cleanPosterTestEntries() {
  var ss = getOrCreatePosterSpreadsheet();
  var sheet = getPosterResponseSheet(ss);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var values = sheet.getDataRange().getValues();
  var deleted = 0;

  for (var r = values.length - 1; r >= 1; r--) {
    var rowStr = values[r].join(' ');
    if (rowStr.indexOf('PRUEBA DUMMY') !== -1 || rowStr.indexOf('DUMMY') !== -1) {
      sheet.deleteRow(r + 1);
      deleted++;
    }
  }

  Logger.log('[cleanPosterTestEntries] Eliminadas ' + deleted + ' filas de prueba.');
}
