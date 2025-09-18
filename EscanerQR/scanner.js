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
        const titles = {
            'conferencias': 'Pase de Lista - Conferencias',
            'talleres': 'Pase de Lista - Talleres',
            'kits': 'Entrega de Kits',
            'comida': 'Comida de Clausura'
        };
        
        document.getElementById('scannerTitle').innerHTML = 
            `<i class="fas fa-qrcode me-2"></i>${titles[this.currentMode]}`;
        
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
                    body = { id: id, tipo: 'conferencias' };
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
                        `${result.message}\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
                } else {
                    this.showResult('success', 'Procesado Exitosamente', 
                        `${result.message}\n\n${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
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

// Funciones globales para compatibilidad
function iniciarEscaneo(mode) {
    if (mode === 'talleres') {
        mostrarSeleccionTaller();
    } else {
        qrScanner.init(mode);
    }
}

// Función para mostrar selección de taller
function mostrarSeleccionTaller() {
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
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller1')">
                                    <i class="fas fa-cog me-2"></i>Taller 1
                                </button>
                            </div>
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller2')">
                                    <i class="fas fa-cog me-2"></i>Taller 2
                                </button>
                            </div>
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller3')">
                                    <i class="fas fa-cog me-2"></i>Taller 3
                                </button>
                            </div>
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller4')">
                                    <i class="fas fa-cog me-2"></i>Taller 4
                                </button>
                            </div>
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller5')">
                                    <i class="fas fa-cog me-2"></i>Taller 5
                                </button>
                            </div>
                            <div class="col-6 mb-2">
                                <button class="btn btn-outline-primary w-100" onclick="seleccionarTaller('taller6')">
                                    <i class="fas fa-cog me-2"></i>Taller 6
                                </button>
                            </div>
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
}

// Función para seleccionar taller y iniciar escaneo
function seleccionarTaller(taller) {
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tallerModal'));
    modal.hide();
    
    // Iniciar escaneo con el taller seleccionado
    qrScanner.init('talleres', { taller: taller });
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
