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
