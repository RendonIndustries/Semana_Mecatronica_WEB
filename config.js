// 🔧 Configuración del Sistema - Semana de Mecatrónica 2025
// Este archivo controla qué funcionalidades están habilitadas

const SYSTEM_CONFIG = {
    // Control de registro de participantes
    registro: {
        habilitado: false,  // Cambiar a true para habilitar el registro
        mensajeDeshabilitado: "El registro está temporalmente deshabilitado. Se habilitará próximamente para las inscripciones al evento."
    },
    
    // Control del escáner QR
    escanerQR: {
        habilitado: false,  // Cambiar a true para habilitar el escáner QR
        mensajeDeshabilitado: "El escáner QR está temporalmente deshabilitado. Se habilitará durante el evento."
    }
};

// Exportar para uso en Node.js (servidor)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SYSTEM_CONFIG;
}

// Exportar para uso en el navegador
if (typeof window !== 'undefined') {
    window.SYSTEM_CONFIG = SYSTEM_CONFIG;
}
