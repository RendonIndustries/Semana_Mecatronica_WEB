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
