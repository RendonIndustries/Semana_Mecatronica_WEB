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
