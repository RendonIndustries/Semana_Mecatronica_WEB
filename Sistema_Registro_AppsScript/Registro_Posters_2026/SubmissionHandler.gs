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
