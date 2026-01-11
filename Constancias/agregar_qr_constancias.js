const fs = require('fs');
const path = require('path');
const os = require('os');
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Configuración
// Para desarrollo local, usar localhost o IP local
// Para producción, usar el dominio real
const BASE_URL = process.env.BASE_URL || (() => {
    // Detectar si estamos en desarrollo (archivo .env.local existe o NODE_ENV)
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         fs.existsSync(path.join(__dirname, '..', '.env.local')) ||
                         !process.env.BASE_URL;
    
    if (isDevelopment) {
        // Obtener IP local automáticamente
        const os = require('os');
        const interfaces = os.networkInterfaces();
        let localIP = 'localhost';
        
        // Buscar IP local (no loopback)
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    localIP = iface.address;
                    break;
                }
            }
            if (localIP !== 'localhost') break;
        }
        
        const port = process.env.PORT || 3000;
        console.log(`⚠️  MODO DESARROLLO detectado`);
        console.log(`   Usando: http://${localIP}:${port}`);
        console.log(`   Para cambiar, usa: BASE_URL=http://tu-ip:3000 node agregar_qr_constancias.js`);
        return `http://${localIP}:${port}`;
    }
    
    return "https://semanameca.upiiz.ipn.mx";
})();
const CONFERENCIAS_DIR = path.join(__dirname, 'Conferencias', 'Individuales');
const TALLERES_DIR = path.join(__dirname, 'Talleres', 'Individuales');

// Función para generar hash único (consistente)
function generarHashConstancia(nombre, actividad, tipo, archivo) {
    // Usar nombre + actividad + tipo + nombre de archivo para generar hash consistente
    // El nombre del archivo incluye información única que evita colisiones
    const datos = `${nombre}|${actividad || 'sin_actividad'}|${tipo}|${archivo}`;
    const hash = crypto.createHash('sha256').update(datos).digest('hex');
    return hash.substring(0, 16).toUpperCase();
}

// Función para generar QR como imagen PNG
async function generarQRImagen(urlValidacion) {
    try {
        const qrDataURL = await QRCode.toDataURL(urlValidacion, {
            width: 200,
            margin: 2,
            color: {
                dark: '#6A0032',  // Color guinda del IPN
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });
        
        // Convertir data URL a buffer
        const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    } catch (error) {
        console.error('Error generando QR:', error);
        throw error;
    }
}

// Función para agregar QR a un PDF
async function agregarQRA_PDF(rutaPDF, nombre, actividad, tipo) {
    try {
        const nombreArchivo = path.basename(rutaPDF);
        
        // Leer el PDF existente
        const pdfBytes = fs.readFileSync(rutaPDF);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Obtener la primera página (donde agregaremos el QR)
        const pages = pdfDoc.getPages();
        if (pages.length === 0) {
            throw new Error('El PDF no tiene páginas');
        }
        
        const page = pages[0];
        const { width, height } = page.getSize();
        
        // Generar hash y URL de validación (hash consistente)
        const hash = generarHashConstancia(nombre, actividad, tipo, nombreArchivo);
        // URL de validación apunta a la página HTML en lugar del endpoint JSON
        const urlValidacion = `${BASE_URL}/validar_qr.html?hash=${hash}`;
        
        // Generar imagen del QR
        const qrBuffer = await generarQRImagen(urlValidacion);
        
        // Cargar imagen del QR en el PDF
        const qrImage = await pdfDoc.embedPng(qrBuffer);
        
        // Tamaño del QR en el PDF (ajustar según necesidad)
        const qrSize = 80; // Tamaño en puntos (aprox 2.8 cm)
        
        // Posición del QR (esquina inferior derecha con margen)
        const margin = 20;
        const qrX = width - qrSize - margin;
        const qrY = margin;
        
        // Agregar el QR a la página
        page.drawImage(qrImage, {
            x: qrX,
            y: qrY,
            width: qrSize,
            height: qrSize,
        });
        
        // Agregar texto pequeño debajo del QR (opcional)
        const fontSize = 8;
        page.drawText('Validar en:', {
            x: qrX,
            y: qrY - 12,
            size: fontSize,
            color: rgb(0.4, 0.4, 0.4),
        });
        
        // Guardar el PDF modificado
        const pdfBytesModificado = await pdfDoc.save();
        fs.writeFileSync(rutaPDF, pdfBytesModificado);
        
        return {
            hash: hash,
            url: urlValidacion,
            archivo: nombreArchivo,
            nombre: nombre,
            actividad: actividad || null,
            tipo: tipo
        };
    } catch (error) {
        console.error(`Error procesando ${rutaPDF}:`, error.message);
        throw error;
    }
}

// Función para procesar todos los PDFs en una carpeta
async function procesarCarpeta(carpeta, tipo) {
    if (!fs.existsSync(carpeta)) {
        console.log(`⚠️  La carpeta ${carpeta} no existe`);
        return { procesados: 0, errores: 0 };
    }
    
    const archivos = fs.readdirSync(carpeta)
        .filter(archivo => archivo.endsWith('.pdf'));
    
    console.log(`\n📁 Procesando ${archivos.length} PDFs en ${tipo}...`);
    console.log('='.repeat(60));
    
    let procesados = 0;
    let errores = 0;
    const hashes = [];
    
    for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const rutaCompleta = path.join(carpeta, archivo);
        
        try {
            // Extraer nombre y actividad del nombre del archivo
            const nombreBase = archivo.replace('.pdf', '');
            const partes = nombreBase.split(' - ');
            const nombre = partes[0].trim();
            const actividad = partes.length > 1 ? partes.slice(1).join(' - ') : null;
            
            // Agregar QR al PDF
            const resultado = await agregarQRA_PDF(rutaCompleta, nombre, actividad, tipo);
            hashes.push({
                hash: resultado.hash,
                url: resultado.url,
                archivo: resultado.archivo,
                nombre: resultado.nombre,
                actividad: resultado.actividad
            });
            procesados++;
            
            // Mostrar progreso cada 50 archivos
            if ((i + 1) % 50 === 0) {
                console.log(`  ✓ Procesados ${i + 1}/${archivos.length} archivos...`);
            }
        } catch (error) {
            console.error(`  ✗ Error en ${archivo}: ${error.message}`);
            errores++;
        }
    }
    
    // Guardar hashes en un archivo JSON para validación
    const hashesFile = path.join(carpeta, 'hashes_validacion.json');
    fs.writeFileSync(hashesFile, JSON.stringify(hashes, null, 2));
    console.log(`\n  💾 Hashes guardados en: ${hashesFile}`);
    
    return { procesados, errores, hashes };
}

// Función principal
async function main() {
    console.log('🔐 Agregando códigos QR a las constancias...');
    console.log('='.repeat(60));
    console.log(`URL base: ${BASE_URL}`);
    console.log('='.repeat(60));
    
    // Procesar conferencias
    const resultadoConf = await procesarCarpeta(CONFERENCIAS_DIR, 'conferencias');
    
    // Procesar talleres
    const resultadoTall = await procesarCarpeta(TALLERES_DIR, 'talleres');
    
    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('✅ Proceso completado!');
    console.log('='.repeat(60));
    console.log(`📚 Conferencias:`);
    console.log(`   - Procesados: ${resultadoConf.procesados}`);
    console.log(`   - Errores: ${resultadoConf.errores}`);
    console.log(`\n🔧 Talleres:`);
    console.log(`   - Procesados: ${resultadoTall.procesados}`);
    console.log(`   - Errores: ${resultadoTall.errores}`);
    console.log(`\n📊 Total:`);
    console.log(`   - Procesados: ${resultadoConf.procesados + resultadoTall.procesados}`);
    console.log(`   - Errores: ${resultadoConf.errores + resultadoTall.errores}`);
    console.log('='.repeat(60));
}

// Ejecutar
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
