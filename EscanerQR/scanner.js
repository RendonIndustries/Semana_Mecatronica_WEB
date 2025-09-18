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
    async init(mode) {
        this.currentMode = mode;
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
                const response = await fetch(`/api/qr-data/${registroId}`);
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
        
        // Log de actividad
        this.logActivity(registro, this.currentMode);
        
        switch (this.currentMode) {
            case 'conferencias':
                this.showResult('success', 'Asistencia Registrada', 
                    `${nombre}\nTipo: ${tipo === 'ipn' ? 'Estudiante IPN' : 'Externo'}\nPaquete: ${paquete}`);
                break;
                
            case 'talleres':
                this.showResult('success', 'Asistencia Registrada', 
                    `${nombre}\nTaller: ${registro.taller}\nPaquete: ${paquete}`);
                break;
                
            case 'kits':
                if (paquete === 'paquete2') {
                    this.showResult('success', 'Kit Entregado', 
                        `${nombre}\nKit entregado correctamente\nPaquete: ${paquete}`);
                } else {
                    this.showResult('warning', 'Sin Kit', 
                        `${nombre}\nNo tiene paquete con kit\nPaquete: ${paquete}`);
                }
                break;
                
            case 'comida':
                if (paquete !== 'ninguno') {
                    this.showResult('success', 'Comida Entregada', 
                        `${nombre}\nComida entregada correctamente\nPaquete: ${paquete}`);
                } else {
                    this.showResult('warning', 'Sin Comida', 
                        `${nombre}\nNo tiene paquete con comida\nPaquete: ${paquete}`);
                }
                break;
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
    qrScanner.init(mode);
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
