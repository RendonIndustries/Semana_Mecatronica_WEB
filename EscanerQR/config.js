// 🔐 Configuración de Credenciales del Escáner QR
// Semana de Mecatrónica 2025 - UPIIZ IPN

const CONFIG = {
    // Credenciales de acceso
    credentials: {
        username: 'SemanaMeca2025',
        password: 'xhdrbz25'
    },
    
    // Configuración de sesión
    session: {
        timeout: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
        storageKey: 'qr_scanner_authenticated',
        userKey: 'qr_scanner_user',
        timestampKey: 'qr_scanner_timestamp'
    },
    
    // URLs de redirección
    urls: {
        login: 'login.html',
        scanner: 'index.html',
        logout: 'login.html'
    },
    
    // Configuración del escáner
    scanner: {
        videoWidth: 640,
        videoHeight: 480,
        qrSize: 250,
        scanInterval: 100 // milisegundos
    }
};

// Exportar configuración para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
