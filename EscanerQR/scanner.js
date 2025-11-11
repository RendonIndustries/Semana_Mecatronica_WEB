// Funcionalidades avanzadas del escáner QR

class QRScanner {
    constructor() {
        this.currentMode = '';
        this.stream = null;
        this.canvas = null;
        this.context = null;
        this.isScanning = false;
        this.registros = new Map(); // Cache de registros
    }
    
    // Inicializar escáner
    async init(mode, options = {}) {
        this.currentMode = mode;
        this.currentOptions = options;
        this.isScanning = true;
        
        try {
            await this.requestCamera();
            this.showScanner();
            this.startQRDetection();
        } catch (error) {
            this.handleError('Error de Cámara', 'No se pudo acceder a la cámara. Verifica los permisos.');
        }
    }
    
    // Solicitar acceso a la cámara
    async requestCamera() {
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('scannerVideo');
        video.srcObject = this.stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
    }
    
    // Mostrar interfaz del escáner
    showScanner() {
        let title;
        const options = this.currentOptions || {};

        if (this.currentMode === 'talleres' && (options.tallerNombre || options.tallerName)) {
            const nombreTaller = options.tallerNombre || options.tallerName;
            const detalles = [];
            if (options.tallerDia) {
                detalles.push(options.tallerDia);
            }
            if (options.tallerFechaTexto) {
                detalles.push(options.tallerFechaTexto);
            }
            title = `Pase de Lista - ${nombreTaller}${detalles.length ? ` (${detalles.join(' · ')})` : ''}`;
        } else if (this.currentMode === 'conferencias' && options.conferenciaNombre) {
            title = `Pase de Lista - ${options.conferenciaNombre}`;
        } else {
            const titles = {
                'conferencias': 'Pase de Lista - Conferencias',
                'talleres': 'Pase de Lista - Talleres',
                'kits': 'Entrega de Kits',
                'comida': 'Comida de Clausura'
            };
            title = titles[this.currentMode];
        }
        
        document.getElementById('scannerTitle').innerHTML = 
            `<i class="fas fa-qrcode me-2"></i>${title}`;
        
        document.getElementById('scannerContainer').style.display = 'block';
    }
    
    // Iniciar detección de QR
    startQRDetection() {
        const video = document.getElementById('scannerVideo');
        
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        
        const detectFrame = () => {
            if (!this.isScanning) return;
            
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                this.canvas.width = video.videoWidth;
                this.canvas.height = video.videoHeight;
                
                this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
                const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    this.processQR(code.data);
                    return;
                }
            }
            
            requestAnimationFrame(detectFrame);
        };
        
        detectFrame();
    }
    
    // Procesar código QR
    async processQR(qrData) {
        try {
            this.stopScanning();
            
            const data = JSON.parse(qrData);
            const registroId = data.id;
            
            // Verificar cache primero
            let registro = this.registros.get(registroId);
            
            if (!registro) {
                const response = await fetch(`../api/qr-data/${registroId}`);
                registro = await response.json();
                
                if (registro.error) {
                    this.handleError('Registro No Válido', 'El código QR no corresponde a un registro válido.');
                    return;
                }
                
                // Guardar en cache
                this.registros.set(registroId, registro);
            }
            
            await this.processRegistration(registro);
            
        } catch (error) {
            console.error('Error al procesar QR:', error);
            this.handleError('Error de Lectura', 'No se pudo leer el código QR correctamente.');
        }
    }
    
    // Procesar registro según el modo
    async processRegistration(registro) {
        const nombre = registro.nombre;
        const paquete = registro.paquete;
        const tipo = registro.tipo;
        const id = registro.id;
        
        try {
            let response;
            let endpoint;
            let body;
            switch (this.currentMode) {
                case 'conferencias':
                    endpoint = '../api/asistencia';
                    body = {
                        id: id,
                        tipo: 'conferencias',
                        conferenciaId: this.currentOptions?.conferenciaId,
                        conferenciaNombre: this.currentOptions?.conferenciaNombre,
                        conferenciaDia: this.currentOptions?.conferenciaDia,
                        conferenciaFechaTexto: this.currentOptions?.conferenciaFechaTexto,
                        horarioOriginal: this.currentOptions?.horarioOriginal,
                        horaInicio: this.currentOptions?.horaInicio,
                        horaFin: this.currentOptions?.horaFin,
                        ventanaInicio: this.currentOptions?.ventanaInicio,
                        ventanaFin: this.currentOptions?.ventanaFin
                    };
                    break;
                    
                case 'talleres':
                    if (!this.currentOptions || (!this.currentOptions.tallerId && !this.currentOptions.tallerSlug && !this.currentOptions.taller && !this.currentOptions.tallerNombre && !this.currentOptions.tallerName)) {
                        this.handleError('Error', 'No se especificó el taller');
                        return;
                    }
                    endpoint = '../api/asistencia';
                    body = {
                        id: id,
                        tipo: 'talleres',
                        taller: this.currentOptions.tallerSlug || this.currentOptions.taller || this.currentOptions.tallerId,
                        tallerId: this.currentOptions.tallerId || this.currentOptions.taller || null,
                        tallerSlug: this.currentOptions.tallerSlug || this.currentOptions.taller || null,
                        tallerNombre: this.currentOptions.tallerNombre || this.currentOptions.tallerName || '',
                        tallerDia: this.currentOptions.tallerDia || null,
                        tallerFechaTexto: this.currentOptions.tallerFechaTexto || null,
                        horarioOriginal: this.currentOptions.horarioOriginal || null,
                        horaInicio: this.currentOptions.horaInicio || null,
                        horaFin: this.currentOptions.horaFin || null,
                        ventanaInicio: this.currentOptions.ventanaInicio || null,
                        ventanaFin: this.currentOptions.ventanaFin || null
                    };
                    break;
                    
                case 'kits':
                    endpoint = '../api/entrega';
                    body = { id: id, tipo: 'kit' };
                    break;
                    
                case 'comida':
                    endpoint = '../api/entrega';
                    body = { id: id, tipo: 'comida' };
                    break;
                    
                default:
                    this.showResult('info', 'Registro Válido', 
                        `${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
                    return;
            }
            
            // Enviar datos al servidor
            response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            const result = await response.json();

            const options = this.currentOptions || {};
            const detalleExtras = [];

            if (this.currentMode === 'conferencias') {
                if (options.conferenciaNombre) {
                    detalleExtras.push(`Conferencia: ${options.conferenciaNombre}`);
                }
                if (options.horarioOriginal) {
                    const info = [];
                    if (options.conferenciaDia) {
                        info.push(options.conferenciaDia);
                    }
                    if (options.conferenciaFechaTexto) {
                        info.push(options.conferenciaFechaTexto);
                    }
                    detalleExtras.push(`Horario: ${options.horarioOriginal}${info.length ? ` (${info.join(' · ')})` : ''}`);
                }
            }

            if (this.currentMode === 'talleres') {
                const nombreTaller = options.tallerNombre || options.tallerName;
                if (nombreTaller) {
                    detalleExtras.push(`Taller: ${nombreTaller}`);
                }
                const info = [];
                if (options.tallerDia) {
                    info.push(options.tallerDia);
                }
                if (options.tallerFechaTexto) {
                    info.push(options.tallerFechaTexto);
                }
                if (options.horarioOriginal) {
                    detalleExtras.push(`Horario: ${options.horarioOriginal}${info.length ? ` (${info.join(' · ')})` : ''}`);
                } else if (info.length) {
                    detalleExtras.push(`Horario: ${info.join(' · ')}`);
                }
            }

            const detallesTexto = detalleExtras.length ? `\n${detalleExtras.join('\n')}` : '';
            const infoParticipante = `\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`;

            if (result.success) {
                this.logActivity(registro, this.currentMode);

                const mensajeCompleto = `${result.message}${detallesTexto}${infoParticipante}`;

                if (result.yaRegistrado || result.yaEntregado) {
                    const tituloAdvertencia = result.yaEntregado && !result.yaRegistrado ? 'Ya Entregado' : 'Ya Procesado';
                    this.showResult('warning', tituloAdvertencia, mensajeCompleto);
                } else {
                    let tituloExito = 'Procesado Exitosamente';
                    if (this.currentMode === 'talleres' || this.currentMode === 'conferencias') {
                        tituloExito = 'Asistencia Registrada';
                    } else if (this.currentMode === 'kits' || this.currentMode === 'comida') {
                        tituloExito = 'Entrega Registrada';
                    }
                    this.showResult('success', tituloExito, mensajeCompleto);
                }
            } else {
                if (result.error === 'Taller incorrecto') {
                    this.showResult('error', 'Taller Incorrecto',
                        `${result.message}${detallesTexto}${infoParticipante}\n\nPor favor, dirígete al taller correcto.`);
                } else {
                    this.handleError('Error del Servidor', result.message || 'Error desconocido');
                }
            }
            
        } catch (error) {
            console.error('Error al procesar registro:', error);
            this.handleError('Error de Conexión', 'No se pudo conectar con el servidor');
        }
    }
    
    // Mostrar resultado
    showResult(tipo, titulo, mensaje) {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const message = document.getElementById('resultMessage');
        
        const icons = {
            'success': '<i class="fas fa-check-circle fa-3x result-success"></i>',
            'error': '<i class="fas fa-times-circle fa-3x result-error"></i>',
            'warning': '<i class="fas fa-exclamation-triangle fa-3x result-warning"></i>'
        };
        
        icon.innerHTML = icons[tipo] || icons['error'];
        title.textContent = titulo;
        message.textContent = mensaje;
        
        modal.style.display = 'flex';
        
        // Vibración en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate(tipo === 'success' ? [100, 50, 100] : [200]);
        }
    }
    
    // Manejar errores
    handleError(titulo, mensaje) {
        this.stopScanning();
        this.showResult('error', titulo, mensaje);
    }
    
    // Parar escaneo
    stopScanning() {
        this.isScanning = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        document.getElementById('scannerContainer').style.display = 'none';
    }
    
    // Cerrar escáner
    close() {
        this.stopScanning();
    }
    
    // Log de actividad (para futuras implementaciones)
    logActivity(registro, modo) {
        const log = {
            timestamp: new Date().toISOString(),
            registroId: registro.id,
            nombre: registro.nombre,
            modo: modo,
            userAgent: navigator.userAgent
        };
        
        console.log('Actividad registrada:', log);
        
        // Aquí se podría enviar a un servidor para logging
        // fetch('/api/log-activity', { method: 'POST', body: JSON.stringify(log) });
    }
    
    // Limpiar cache
    clearCache() {
        this.registros.clear();
    }
}

// Instancia global del escáner
const qrScanner = new QRScanner();
let conferenciasDisponibles = [];
let talleresPorCurso = [];

// Funciones globales para compatibilidad
function iniciarEscaneo(mode) {
    switch (mode) {
        case 'talleres':
            mostrarSeleccionTaller();
            break;
        case 'conferencias':
            mostrarSeleccionConferencia();
            break;
        default:
            qrScanner.init(mode);
            break;
    }
}

// Función para mostrar selección de taller (curso)
async function mostrarSeleccionTaller() {
    try {
        const response = await fetch('../Docs/Programa_2025.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el programa de talleres.');
        }
        const data = await response.json();

        const dayKeys = {
            'Lunes': 'monday',
            'Martes': 'tuesday',
            'Miércoles': 'wednesday',
            'Miercoles': 'wednesday',
            'Jueves': 'thursday',
            'Viernes': 'friday',
            'Sábado': 'saturday',
            'Sabado': 'saturday',
            'Domingo': 'sunday'
        };

        const months = {
            'enero': 0,
            'febrero': 1,
            'marzo': 2,
            'abril': 3,
            'mayo': 4,
            'junio': 5,
            'julio': 6,
            'agosto': 7,
            'septiembre': 8,
            'setiembre': 8,
            'octubre': 9,
            'noviembre': 10,
            'diciembre': 11
        };

        const parseSpanishDate = (texto) => {
            if (!texto) {
                return null;
            }
            const match = texto.match(/(\d{1,2})\s+de\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)(?:\s+de\s+(\d{4}))?/);
            if (!match) return null;
            const dia = parseInt(match[1], 10);
            const mes = months[match[2].toLowerCase()] ?? null;
            const anio = match[3] ? parseInt(match[3], 10) : 2025;
            if (mes === null) return null;
            return new Date(anio, mes, dia, 0, 0, 0, 0);
        };

        const parseHour = (texto, baseDate) => {
            if (!texto || !baseDate) {
                return null;
            }
            const match = texto.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
            if (!match) return null;
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3].toLowerCase();
            if (period === 'pm' && hours !== 12) {
                hours += 12;
            }
            if (period === 'am' && hours === 12) {
                hours = 0;
            }
            const fecha = new Date(baseDate);
            fecha.setHours(hours, minutes, 0, 0);
            return fecha;
        };

        const normalize = (value) => {
            if (!value || typeof value !== 'string') {
                return '';
            }
            return value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
        };

        const marginMinutes = 60;
        const cursosMap = new Map();

        data.schedule.forEach(dayConfig => {
            const dayName = dayConfig.day;
            const dayKey = dayKeys[dayName];
            const fechaTexto = dayKey ? data.dates?.[dayKey] : null;
            const fechaBase = fechaTexto ? parseSpanishDate(fechaTexto) : null;

            dayConfig.activities.forEach(activity => {
                const eventText = activity.event || '';
                const eventLower = eventText.toLowerCase();

                if (!eventLower.includes('taller:') ||
                    eventLower.includes('inicio de talleres') ||
                    eventLower.includes('otros talleres')) {
                    return;
                }

                const timeParts = (activity.time || '').split('-').map(t => t.trim());
                if (timeParts.length !== 2) {
                    return;
                }

                const horaInicioDate = parseHour(timeParts[0], fechaBase);
                const horaFinDate = parseHour(timeParts[1], fechaBase);
                const ventanaInicioDate = horaInicioDate ? new Date(horaInicioDate.getTime() - marginMinutes * 60000) : null;
                const ventanaFinDate = horaFinDate ? new Date(horaFinDate.getTime() + marginMinutes * 60000) : null;

                const match = eventText.match(/Taller:\s*(.+?)(?:\s*-|$)/i);
                const tallerNombre = match ? match[1].trim() : eventText.replace(/Taller:\s*/i, '').trim();
                if (!tallerNombre) {
                    return;
                }

                const tallerSlug = normalize(tallerNombre);
                const idBase = `${dayName}_${timeParts[0]}_${tallerSlug}`;
                const tallerId = normalize(idBase);

                const sesion = {
                    id: tallerId,
                    slug: tallerSlug,
                    nombre: tallerNombre,
                    dia: dayName,
                    fechaTexto,
                    horarioOriginal: activity.time,
                    descripcionCompleta: eventText,
                    horaInicio: horaInicioDate,
                    horaFin: horaFinDate,
                    ventanaInicio: ventanaInicioDate,
                    ventanaFin: ventanaFinDate
                };

                if (!cursosMap.has(tallerSlug)) {
                    cursosMap.set(tallerSlug, {
                        nombre: tallerNombre,
                        slug: tallerSlug,
                        sesiones: []
                    });
                }
                cursosMap.get(tallerSlug).sesiones.push(sesion);
            });
        });

        talleresPorCurso = Array.from(cursosMap.values())
            .map(curso => ({
                ...curso,
                sesiones: curso.sesiones.sort((a, b) => {
                    const tiempoA = a.horaInicio ? a.horaInicio.getTime() : Number.MAX_SAFE_INTEGER;
                    const tiempoB = b.horaInicio ? b.horaInicio.getTime() : Number.MAX_SAFE_INTEGER;
                    if (tiempoA !== tiempoB) {
                        return tiempoA - tiempoB;
                    }
                    return a.dia.localeCompare(b.dia);
                })
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

        if (talleresPorCurso.length === 0) {
            alert('No se encontraron talleres configurados en el programa.');
            return;
        }

        const now = new Date();
        const formatearHora = (fecha) => fecha
            ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
            : '';

        const cursosHTML = talleresPorCurso.map((curso, index) => {
            const sesionesActivas = curso.sesiones.filter(s =>
                s.ventanaInicio && s.ventanaFin && now >= s.ventanaInicio && now <= s.ventanaFin
            );
            const sesionesFuturas = curso.sesiones.filter(s =>
                s.ventanaInicio && now < s.ventanaInicio
            ).sort((a, b) => a.ventanaInicio - b.ventanaInicio);

            let estadoTexto = '';
            let estadoClase = 'text-muted';

            if (sesionesActivas.length > 0) {
                const sesion = sesionesActivas[0];
                estadoTexto = `Pase activo hoy (${formatearHora(sesion.ventanaInicio)} - ${formatearHora(sesion.ventanaFin)})`;
                estadoClase = 'text-success';
            } else if (sesionesFuturas.length > 0) {
                const sesion = sesionesFuturas[0];
                const fechaLabel = sesion.fechaTexto ? `${sesion.dia} ${sesion.fechaTexto}` : sesion.dia;
                estadoTexto = `Próximo pase: ${fechaLabel}, ${sesion.horarioOriginal}`;
                estadoClase = 'text-warning';
            } else {
                const ultima = curso.sesiones[curso.sesiones.length - 1];
                if (ultima && ultima.ventanaFin) {
                    estadoTexto = `Última sesión finalizó ${formatearHora(ultima.ventanaFin)}`;
                } else {
                    estadoTexto = 'Sin sesiones programadas';
                }
            }

            const sesionesResumen = curso.sesiones.map(sesion => {
                const fechaLabel = sesion.fechaTexto ? `${sesion.dia} ${sesion.fechaTexto}` : sesion.dia;
                return `<li>${fechaLabel} · ${sesion.horarioOriginal}</li>`;
            }).join('');

            return `
                <div class="col-12 mb-3">
                    <div class="card border-0 shadow-sm curso-card-select" role="button" tabindex="0"
                        aria-label="Seleccionar taller ${curso.nombre}"
                        onclick="seleccionarTallerCurso(${index})"
                        onkeydown="manejarSeleccionCursoKey(event, ${index})">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start flex-wrap" style="cursor: pointer;">
                                <div class="me-3 flex-grow-1">
                                    <h5 class="mb-2"><i class="fas fa-tools me-2"></i>${curso.nombre}</h5>
                                    <ul class="list-unstyled small text-muted mb-2">
                                        ${sesionesResumen}
                                    </ul>
                                    <span class="small ${estadoClase}">${estadoTexto}</span>
                                </div>
                                <div class="ms-auto mt-2 mt-md-0 d-flex align-items-center text-primary fw-semibold">
                                    Elegir día
                                    <i class="fas fa-chevron-right ms-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const modalHTML = `
            <div class="modal fade" id="tallerModal" tabindex="-1" aria-labelledby="tallerModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="tallerModalLabel">
                                <i class="fas fa-tools me-2"></i>Seleccionar Taller
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-3">
                                Primero elige el taller (curso) y después selecciona el día y horario correspondiente.
                                El pase de lista se habilita desde una hora antes y hasta una hora después del horario oficial.
                            </p>
                            <div class="row">
                                ${cursosHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('tallerModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = new bootstrap.Modal(document.getElementById('tallerModal'));
        modal.show();

        document.getElementById('tallerModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });

    } catch (error) {
        console.error('Error al cargar talleres:', error);
        alert('Error al cargar los talleres. Por favor, recarga la página.');
    }
}

function seleccionarTallerCurso(indexCurso) {
    if (!Array.isArray(talleresPorCurso) || !talleresPorCurso[indexCurso]) {
        alert('No se encontró el taller seleccionado. Recarga la lista e intenta de nuevo.');
        return;
    }

    const modalEl = document.getElementById('tallerModal');
    const modal = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;

    const abrirSesiones = () => {
        if (modalEl) {
            modalEl.remove();
        }
        mostrarSesionesTaller(indexCurso);
    };

    if (modal) {
        modalEl.addEventListener('hidden.bs.modal', function handleHidden() {
            modalEl.removeEventListener('hidden.bs.modal', handleHidden);
            abrirSesiones();
        });
        modal.hide();
    } else {
        abrirSesiones();
    }
}

function manejarSeleccionCursoKey(event, indexCurso) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        seleccionarTallerCurso(indexCurso);
    }
}

function mostrarSesionesTaller(indexCurso) {
    const curso = talleresPorCurso[indexCurso];
    if (!curso || !Array.isArray(curso.sesiones) || curso.sesiones.length === 0) {
        alert('Este taller no tiene sesiones disponibles.');
        return;
    }

    const now = new Date();
    const formatearHora = (fecha) => fecha
        ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : '';

    const sesionesHTML = curso.sesiones.map((sesion, sesionIndex) => {
        const ventanaInicioDate = sesion.ventanaInicio;
        const ventanaFinDate = sesion.ventanaFin;

        let dentroVentana = true;
        let estadoTexto = 'Horario disponible';
        let estadoClase = 'text-muted';

        if (ventanaInicioDate && ventanaFinDate) {
            dentroVentana = now >= ventanaInicioDate && now <= ventanaFinDate;
            if (dentroVentana) {
                estadoTexto = `Pase activo (${formatearHora(ventanaInicioDate)} - ${formatearHora(ventanaFinDate)})`;
                estadoClase = 'text-success';
            } else if (now < ventanaInicioDate) {
                estadoTexto = `Disponible desde ${formatearHora(ventanaInicioDate)}`;
                estadoClase = 'text-warning';
            } else {
                estadoTexto = `Horario finalizado a las ${formatearHora(ventanaFinDate)}`;
                estadoClase = 'text-muted';
            }
        }

        const fechaLabel = sesion.fechaTexto ? `${sesion.dia} ${sesion.fechaTexto}` : sesion.dia;

        return `
            <div class="col-12 mb-3">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <div class="me-3">
                                <strong>${fechaLabel}</strong>
                                <div class="small text-muted mb-2">${sesion.horarioOriginal}</div>
                                <span class="small ${estadoClase}">${estadoTexto}</span>
                            </div>
                            <div class="d-flex flex-column flex-md-row gap-2 mt-2 mt-md-0">
                                <button class="btn btn-outline-primary"
                                    ${dentroVentana ? '' : 'disabled'}
                                    onclick="seleccionarSesionTaller(${indexCurso}, ${sesionIndex})">
                                    <i class="fas fa-qrcode me-1"></i>Escanear
                                </button>
                                <button class="btn btn-danger"
                                    onclick="marcarAsistenciaMasivaSesion(${indexCurso}, ${sesionIndex}, this)">
                                    <i class="fas fa-user-check me-1"></i>Asistencia masiva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const modalHTML = `
        <div class="modal fade" id="tallerSesionesModal" tabindex="-1" aria-labelledby="tallerSesionesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="tallerSesionesModalLabel">
                            <i class="fas fa-calendar-day me-2"></i>${curso.nombre}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3">Selecciona el día y horario para registrar la asistencia:</p>
                        <div class="row">
                            ${sesionesHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('tallerSesionesModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = new bootstrap.Modal(document.getElementById('tallerSesionesModal'));
    modal.show();

    document.getElementById('tallerSesionesModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

function seleccionarSesionTaller(indexCurso, indexSesion) {
    if (!Array.isArray(talleresPorCurso) || !talleresPorCurso[indexCurso]) {
        alert('No se encontró la información del taller. Recarga la lista e intenta de nuevo.');
        return;
    }

    const curso = talleresPorCurso[indexCurso];
    const sesion = curso.sesiones[indexSesion];

    if (!sesion) {
        alert('No se encontró la sesión seleccionada. Recarga la lista e intenta de nuevo.');
        return;
    }

    const ahora = new Date();
    if (sesion.ventanaInicio && sesion.ventanaFin) {
        if (ahora < sesion.ventanaInicio || ahora > sesion.ventanaFin) {
            alert('Esta sesión no está dentro del horario habilitado para pase de lista. Solo se permite desde una hora antes hasta una hora después del horario oficial.');
            return;
        }
    }

    const modalEl = document.getElementById('tallerSesionesModal');
    const modal = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
    if (modal) {
        modal.hide();
    }
    if (modalEl) {
        modalEl.remove();
    }

    qrScanner.init('talleres', {
        tallerId: sesion.id,
        tallerSlug: sesion.slug,
        tallerNombre: curso.nombre,
        tallerName: curso.nombre,
        tallerDia: sesion.dia,
        tallerFechaTexto: sesion.fechaTexto,
        horarioOriginal: sesion.horarioOriginal,
        horaInicio: sesion.horaInicio ? sesion.horaInicio.toISOString() : null,
        horaFin: sesion.horaFin ? sesion.horaFin.toISOString() : null,
        ventanaInicio: sesion.ventanaInicio ? sesion.ventanaInicio.toISOString() : null,
        ventanaFin: sesion.ventanaFin ? sesion.ventanaFin.toISOString() : null
    });
}

async function marcarAsistenciaMasivaSesion(indexCurso, indexSesion, buttonEl) {
    try {
        const curso = talleresPorCurso[indexCurso];
        const sesion = curso?.sesiones?.[indexSesion];

        if (!curso || !sesion) {
            alert('No se encontró la información del taller. Recarga la lista e intenta de nuevo.');
            return;
        }

        if (!confirm(`¿Deseas marcar la asistencia de todos los participantes inscritos en "${curso.nombre}" para la sesión del ${sesion.dia}?`)) {
            return;
        }

        const originalHTML = buttonEl.innerHTML;
        buttonEl.disabled = true;
        buttonEl.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Procesando...';

        const payload = {
            tallerNombre: curso.nombre,
            tallerSlug: sesion.slug,
            tallerId: sesion.id,
            tallerDia: sesion.dia,
            tallerFechaTexto: sesion.fechaTexto,
            horarioOriginal: sesion.horarioOriginal,
            horaInicio: sesion.horaInicio ? sesion.horaInicio.toISOString() : null,
            horaFin: sesion.horaFin ? sesion.horaFin.toISOString() : null,
            ventanaInicio: sesion.ventanaInicio ? sesion.ventanaInicio.toISOString() : null,
            ventanaFin: sesion.ventanaFin ? sesion.ventanaFin.toISOString() : null
        };

        const response = await fetch('../api/asistencia/taller-masiva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'No se pudo completar la asistencia masiva');
        }

        alert(`Asistencia masiva completada.\nParticipantes procesados: ${result.totalProcesados}\nAsistencias nuevas: ${result.totalNuevas}\nYa registradas: ${result.totalYaRegistradas}`);

    } catch (error) {
        console.error('Error en asistencia masiva:', error);
        alert(`Error al realizar la asistencia masiva: ${error.message}`);
    } finally {
        if (buttonEl) {
            buttonEl.disabled = false;
            buttonEl.innerHTML = '<i class="fas fa-user-check me-1"></i>Asistencia masiva';
        }
    }
}

// Función para mostrar selección de conferencias
async function mostrarSeleccionConferencia() {
    try {
        const response = await fetch('../Docs/Programa_2025.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el programa de conferencias.');
        }
        const data = await response.json();
        const dayKeys = {
            'Lunes': 'monday',
            'Martes': 'tuesday',
            'Miércoles': 'wednesday',
            'Miercoles': 'wednesday',
            'Jueves': 'thursday',
            'Viernes': 'friday',
            'Sábado': 'saturday',
            'Sabado': 'saturday',
            'Domingo': 'sunday'
        };
        const months = {
            'enero': 0,
            'febrero': 1,
            'marzo': 2,
            'abril': 3,
            'mayo': 4,
            'junio': 5,
            'julio': 6,
            'agosto': 7,
            'septiembre': 8,
            'setiembre': 8,
            'octubre': 9,
            'noviembre': 10,
            'diciembre': 11
        };
        const parseSpanishDate = (texto) => {
            const match = texto.match(/(\d{1,2})\s+de\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)(?:\s+de\s+(\d{4}))?/);
            if (!match) return null;
            const dia = parseInt(match[1], 10);
            const mes = months[match[2].toLowerCase()] ?? null;
            const anio = match[3] ? parseInt(match[3], 10) : 2025;
            if (mes === null) return null;
            return new Date(anio, mes, dia, 0, 0, 0, 0);
        };
        const parseHour = (texto, baseDate) => {
            const match = texto.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
            if (!match) return null;
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3].toLowerCase();
            if (period === 'pm' && hours !== 12) {
                hours += 12;
            }
            if (period === 'am' && hours === 12) {
                hours = 0;
            }
            const fecha = new Date(baseDate);
            fecha.setHours(hours, minutes, 0, 0);
            return fecha;
        };
        const marginMinutes = 60;
        const conferencias = [];
        data.schedule.forEach(dayConfig => {
            const dayName = dayConfig.day;
            const dayKey = dayKeys[dayName];
            const fechaTexto = dayKey ? data.dates?.[dayKey] : null;
            const fechaBase = fechaTexto ? parseSpanishDate(fechaTexto) : null;
            if (!fechaBase) {
                return;
            }
            dayConfig.activities.forEach(activity => {
                const eventLower = activity.event.toLowerCase();
                if (!eventLower.includes('conferencia:')) {
                    return;
                }
                const timeParts = activity.time.split('-').map(t => t.trim());
                if (timeParts.length !== 2) {
                    return;
                }
                const horaInicio = parseHour(timeParts[0], fechaBase);
                const horaFin = parseHour(timeParts[1], fechaBase);
                if (!horaInicio || !horaFin) {
                    return;
                }
                const ventanaInicio = new Date(horaInicio.getTime() - marginMinutes * 60000);
                const ventanaFin = new Date(horaFin.getTime() + marginMinutes * 60000);
                const sanitizedName = activity.event.substring(activity.event.indexOf(':') + 1).trim();
                const slugBase = `${dayName}_${timeParts[0]}`.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const conferenciaId = `${slugBase}_${horaInicio.getHours()}${horaInicio.getMinutes()}`.replace(/_+/g, '_');
                conferencias.push({
                    id: conferenciaId,
                    nombre: sanitizedName,
                    descripcionCompleta: activity.event,
                    dia: dayName,
                    fechaTexto,
                    horaInicio,
                    horaFin,
                    ventanaInicio,
                    ventanaFin,
                    horarioOriginal: activity.time
                });
            });
        });
        conferenciasDisponibles = conferencias;
        if (conferenciasDisponibles.length === 0) {
            alert('No se encontraron conferencias configuradas en el programa.');
            return;
        }

        const now = new Date();
        const formatearHora = (fecha) => fecha.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const conferenciasHTML = conferenciasDisponibles.map((conf, index) => {
            const dentroVentana = now >= conf.ventanaInicio && now <= conf.ventanaFin;
            let estadoTexto;
            let estadoClase;
            if (dentroVentana) {
                estadoTexto = `Pase activo (${formatearHora(conf.ventanaInicio)} - ${formatearHora(conf.ventanaFin)})`;
                estadoClase = 'text-success';
            } else if (now < conf.ventanaInicio) {
                estadoTexto = `Disponible desde ${formatearHora(conf.ventanaInicio)}`;
                estadoClase = 'text-warning';
            } else {
                estadoTexto = `Horario finalizado a las ${formatearHora(conf.ventanaFin)}`;
                estadoClase = 'text-muted';
            }
            const disabledAttr = dentroVentana ? '' : 'disabled';
            const shortName = conf.nombre.length > 60 ? conf.nombre.substring(0, 57) + '...' : conf.nombre;
            return `
                <div class="col-12 mb-2">
                    <button class="btn ${dentroVentana ? 'btn-outline-primary' : 'btn-outline-secondary'} w-100 text-start" ${disabledAttr} onclick="seleccionarConferencia(${index})">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <div>
                                <strong><i class="fas fa-chalkboard-teacher me-2"></i>${shortName}</strong>
                                <div class="small text-muted">${conf.dia} ${conf.fechaTexto} · ${conf.horarioOriginal}</div>
                            </div>
                            <span class="small ${estadoClase}">${estadoTexto}</span>
                        </div>
                    </button>
                </div>
            `;
        }).join('');

        const modalHTML = `
            <div class="modal fade" id="conferenciaModal" tabindex="-1" aria-labelledby="conferenciaModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="conferenciaModalLabel">
                                <i class="fas fa-chalkboard-teacher me-2"></i>Seleccionar Conferencia
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-3">
                                El pase de lista solo está disponible desde una hora antes y hasta una hora después del horario programado.
                            </p>
                            <div class="row">
                                ${conferenciasHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('conferenciaModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('conferenciaModal'));
        modal.show();

        document.getElementById('conferenciaModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });

    } catch (error) {
        console.error('Error al cargar conferencias:', error);
        alert('Ocurrió un problema al cargar las conferencias. Intenta nuevamente.');
    }
}

function seleccionarConferencia(index) {
    if (!Array.isArray(conferenciasDisponibles) || !conferenciasDisponibles[index]) {
        alert('No se encontró la conferencia seleccionada. Recarga la lista e intenta de nuevo.');
        return;
    }
    const conferencia = conferenciasDisponibles[index];
    const ahora = new Date();
    if (ahora < conferencia.ventanaInicio || ahora > conferencia.ventanaFin) {
        alert('Esta conferencia no está dentro del horario habilitado para pase de lista. Solo se permite desde una hora antes hasta una hora después del horario oficial.');
        return;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('conferenciaModal'));
    if (modal) {
        modal.hide();
    }
    qrScanner.init('conferencias', {
        conferenciaId: conferencia.id,
        conferenciaNombre: conferencia.nombre,
        conferenciaDia: conferencia.dia,
        conferenciaFechaTexto: conferencia.fechaTexto,
        horarioOriginal: conferencia.horarioOriginal,
        horaInicio: conferencia.horaInicio.toISOString(),
        horaFin: conferencia.horaFin.toISOString(),
        ventanaInicio: conferencia.ventanaInicio.toISOString(),
        ventanaFin: conferencia.ventanaFin.toISOString()
    });
}

function cerrarScanner() {
    qrScanner.close();
}

function cerrarResultado() {
    document.getElementById('resultModal').style.display = 'none';
}

// Manejar cambios de orientación
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (qrScanner.isScanning) {
            qrScanner.stopScanning();
            qrScanner.init(qrScanner.currentMode);
        }
    }, 500);
});

// Prevenir zoom en iOS
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// Manejar visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden && qrScanner.isScanning) {
        qrScanner.stopScanning();
    }
});
