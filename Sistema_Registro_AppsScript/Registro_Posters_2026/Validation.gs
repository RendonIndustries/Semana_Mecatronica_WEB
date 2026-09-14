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
