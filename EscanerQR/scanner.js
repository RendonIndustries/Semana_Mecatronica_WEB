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
        
        if (this.currentMode === 'talleres' && this.currentOptions && this.currentOptions.tallerName) {
            title = `Pase de Lista - ${this.currentOptions.tallerName}`;
        } else if (this.currentMode === 'conferencias' && this.currentOptions && this.currentOptions.conferenciaNombre) {
            title = `Pase de Lista - ${this.currentOptions.conferenciaNombre}`;
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
            const conferenciaDetalle = (this.currentMode === 'conferencias' && this.currentOptions?.conferenciaNombre)
                ? `\nConferencia: ${this.currentOptions.conferenciaNombre}`
                : '';
            const conferenciaHorario = (this.currentMode === 'conferencias' && this.currentOptions?.horarioOriginal)
                ? `\nHorario: ${this.currentOptions.horarioOriginal}`
                : '';
            
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
                    if (!this.currentOptions.taller) {
                        this.handleError('Error', 'No se especificó el taller');
                        return;
                    }
                    endpoint = '../api/asistencia';
                    body = { id: id, tipo: 'talleres', taller: this.currentOptions.taller };
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
            
            if (result.success) {
                // Log de actividad
                this.logActivity(registro, this.currentMode);
                
                // Mostrar resultado según el tipo
                if (result.yaRegistrado || result.yaEntregado) {
                    this.showResult('warning', 'Ya Procesado', 
                        `${result.message}${conferenciaDetalle}${conferenciaHorario}\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
                } else {
                    this.showResult('success', 'Procesado Exitosamente', 
                        `${result.message}${conferenciaDetalle}${conferenciaHorario}\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
                }
            } else {
                // Manejar error específico de taller incorrecto
                if (result.error === 'Taller incorrecto') {
                    this.showResult('error', 'Taller Incorrecto', 
                        `${result.message}\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}\n\nPor favor, dirígete al taller correcto.`);
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

// Función para mostrar selección de taller
async function mostrarSeleccionTaller() {
    try {
        // Cargar talleres desde el JSON
        const response = await fetch('../Docs/Programa_2025.json');
        const data = await response.json();
        
        // Extraer talleres únicos
        const talleresMap = new Map();
        data.schedule.forEach(day => {
            day.activities.forEach(activity => {
                const event = activity.event;
                
                // Buscar si es un taller
                if (event.toLowerCase().includes('taller:') && 
                    !event.toLowerCase().includes('inicio de talleres') && 
                    !event.toLowerCase().includes('otros talleres')) {
                    
                    // Extraer el nombre del taller
                    const tallerMatch = event.match(/Taller:\s*(.+?)(?:\s*-|$)/);
                    if (tallerMatch) {
                        const tallerName = tallerMatch[1].trim();
                        
                        // Si no existe en el mapa, agregarlo
                        if (!talleresMap.has(tallerName)) {
                            talleresMap.set(tallerName, {
                                nombre: tallerName,
                                descripcion: event
                            });
                        }
                    }
                }
            });
        });
        
        // Convertir a array
        const talleres = Array.from(talleresMap.values());
        
        // Generar botones de talleres
        let talleresHTML = '';
        talleres.forEach((taller, index) => {
            const idTaller = taller.nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const shortName = taller.nombre.length > 30 ? taller.nombre.substring(0, 27) + '...' : taller.nombre;
            
            talleresHTML += `
                <div class="col-12 mb-2">
                    <button class="btn btn-outline-primary w-100 text-start" onclick="seleccionarTaller('${idTaller}', '${taller.nombre}')">
                        <i class="fas fa-cog me-2"></i><strong>${shortName}</strong>
                    </button>
                </div>
            `;
        });
        
        const modalHTML = `
            <div class="modal fade" id="tallerModal" tabindex="-1" aria-labelledby="tallerModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="tallerModalLabel">
                                <i class="fas fa-tools me-2"></i>Seleccionar Taller
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-3">Selecciona el taller para el cual vas a registrar asistencias:</p>
                            <div class="row">
                                ${talleresHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('tallerModal'));
        modal.show();
        
        // Limpiar modal cuando se cierre
        document.getElementById('tallerModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
        
    } catch (error) {
        console.error('Error al cargar talleres:', error);
        alert('Error al cargar los talleres. Por favor, recarga la página.');
    }
}

// Función para seleccionar taller y iniciar escaneo
function seleccionarTaller(taller, tallerName) {
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tallerModal'));
    modal.hide();
    
    // Iniciar escaneo con el taller seleccionado
    qrScanner.init('talleres', { taller: taller, tallerName: tallerName });
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
