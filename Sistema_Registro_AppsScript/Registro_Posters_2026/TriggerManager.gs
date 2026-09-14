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
