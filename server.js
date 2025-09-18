const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Crear directorio de registros si no existe
const registrosDir = path.join(__dirname, 'Registros2025');
if (!fs.existsSync(registrosDir)) {
    fs.mkdirSync(registrosDir, { recursive: true });
}

// Archivo único para todos los registros
const archivoRegistros = path.join(registrosDir, 'registros_semana_mecatronica_2025.json');

// Función para cargar registros existentes
function cargarRegistros() {
    try {
        if (fs.existsSync(archivoRegistros)) {
            const contenido = fs.readFileSync(archivoRegistros, 'utf8');
            return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error al cargar registros:', error);
    }
    
    // Estructura inicial si no existe el archivo
    return {
        metadata: {
            version: "1.0",
            evento: "Semana de Mecatrónica 2025",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
        },
        registros: []
    };
}

// Función para guardar registros
function guardarRegistros(datos) {
    try {
        datos.metadata.ultimaActualizacion = new Date().toISOString();
        const jsonData = JSON.stringify(datos, null, 2);
        fs.writeFileSync(archivoRegistros, jsonData, 'utf8');
        return true;
    } catch (error) {
        console.error('Error al guardar registros:', error);
        return false;
    }
}

// Ruta principal - servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'semana_mecatronica_2025.html'));
});

// Ruta para el escáner QR - redirigir a login
app.get('/EscanerQR', (req, res) => {
    res.redirect('/EscanerQR/login.html');
});

app.get('/EscanerQR/', (req, res) => {
    res.redirect('/EscanerQR/login.html');
});

// Ruta para el escáner principal (después del login)
app.get('/EscanerQR/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'EscanerQR', 'index.html'));
});

// Servir archivos estáticos del escáner QR
app.use('/EscanerQR', express.static(path.join(__dirname, 'EscanerQR')));

// API para guardar registros
app.post('/api/registro', (req, res) => {
    try {
        const data = req.body;
        
        // Validar datos
        if (!data || !data.participante) {
            return res.status(400).json({
                error: 'Datos inválidos',
                message: 'Se requiere información del participante'
            });
        }

        // Cargar registros existentes
        const registrosData = cargarRegistros();
        
        // Agregar ID único al registro
        const nuevoRegistro = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...data,
            fechaGuardado: new Date().toISOString()
        };
        
        // Agregar el nuevo registro
        registrosData.registros.push(nuevoRegistro);
        
        // Guardar todos los registros
        if (guardarRegistros(registrosData)) {
            res.json({
                success: true,
                message: 'Registro guardado exitosamente',
                id: nuevoRegistro.id,
                totalRegistros: registrosData.registros.length,
                fecha: data.metadata?.fechaRegistro || new Date().toISOString(),
                qrUrl: `/api/qr/${nuevoRegistro.id}`,
                qrDataUrl: `/api/qr-data/${nuevoRegistro.id}`
            });
        } else {
            throw new Error('Error al escribir el archivo');
        }

    } catch (error) {
        console.error('Error al guardar registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para listar registros
app.get('/api/registros', (req, res) => {
    try {
        // Cargar registros existentes
        const registrosData = cargarRegistros();
        
        // Mapear registros para la respuesta
        const registros = registrosData.registros.map(registro => ({
            id: registro.id,
            fecha: registro.metadata?.fechaRegistro || 'Desconocida',
            nombre: registro.participante?.nombre || 'Sin nombre',
            email: registro.participante?.email || 'Sin email',
            tipo: registro.participante?.tipoParticipante || 'Desconocido',
            paquete: registro.participante?.paquete || 'Ninguno',
            taller: registro.participante?.taller || 'Sin taller',
            telefono: registro.participante?.telefono || 'Sin teléfono',
            boleta: registro.participante?.boleta || '',
            carrera: registro.participante?.carrera || '',
            tallaPlayera: registro.participante?.tallaPlayera || '',
            fechaGuardado: registro.fechaGuardado
        }));

        // Ordenar por fecha (más recientes primero)
        registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.json({
            registros: registros,
            total: registros.length,
            metadata: registrosData.metadata,
            fecha_consulta: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error al listar registros:', error);
        res.status(500).json({
            error: 'Error al listar registros',
            message: error.message
        });
    }
});

// API para obtener un registro específico
app.get('/api/registro/:id', (req, res) => {
    try {
        const id = req.params.id;
        const registrosData = cargarRegistros();
        
        const registro = registrosData.registros.find(r => r.id === id);
        
        if (!registro) {
            return res.status(404).json({
                error: 'Registro no encontrado'
            });
        }
        
        res.json(registro);

    } catch (error) {
        console.error('Error al obtener registro:', error);
        res.status(500).json({
            error: 'Error al obtener registro',
            message: error.message
        });
    }
});

// API para exportar registros a CSV
app.get('/api/exportar-csv', (req, res) => {
    try {
        const registrosData = cargarRegistros();
        
        if (registrosData.registros.length === 0) {
            return res.status(404).json({
                error: 'No hay registros para exportar'
            });
        }

        // Crear CSV
        let csv = 'ID,Nombre,Email,Teléfono,Tipo,Boleta,Carrera,Paquete,Talla Playera,Taller,Fecha Registro,Fecha Guardado\n';
        
        registrosData.registros.forEach(registro => {
            const participante = registro.participante || {};
            const metadata = registro.metadata || {};
            
            csv += `"${registro.id || ''}","${participante.nombre || ''}","${participante.email || ''}","${participante.telefono || ''}","${participante.tipoParticipante || ''}","${participante.boleta || ''}","${participante.carrera || ''}","${participante.paquete || ''}","${participante.tallaPlayera || ''}","${participante.taller || ''}","${metadata.fechaRegistro || ''}","${registro.fechaGuardado || ''}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="registros_semana_mecatronica_2025.csv"');
        res.send(csv);

    } catch (error) {
        console.error('Error al exportar CSV:', error);
        res.status(500).json({
            error: 'Error al exportar CSV',
            message: error.message
        });
    }
});

// API para generar código QR
app.get('/api/qr/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const registrosData = cargarRegistros();
        
        const registro = registrosData.registros.find(r => r.id === id);
        
        if (!registro) {
            return res.status(404).json({
                error: 'Registro no encontrado'
            });
        }

        // Crear datos para el QR
        const qrData = {
            id: registro.id,
            nombre: registro.participante.nombre,
            evento: 'Semana de Mecatrónica 2025',
            fecha: registro.metadata.fechaRegistro,
            tipo: registro.participante.tipoParticipante,
            paquete: registro.participante.paquete
        };

        // Generar código QR como imagen PNG
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 300,
            margin: 2,
            color: {
                dark: '#6A0032',  // Color guinda del IPN
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });

        // Enviar como imagen
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="qr_registro_${id}.png"`);
        
        // Convertir data URL a buffer
        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        res.send(buffer);

    } catch (error) {
        console.error('Error al generar QR:', error);
        res.status(500).json({
            error: 'Error al generar código QR',
            message: error.message
        });
    }
});

// API para obtener datos del QR (para validación)
app.get('/api/qr-data/:id', (req, res) => {
    try {
        const id = req.params.id;
        const registrosData = cargarRegistros();
        
        const registro = registrosData.registros.find(r => r.id === id);
        
        if (!registro) {
            return res.status(404).json({
                error: 'Registro no encontrado'
            });
        }

        // Datos para el QR
        const qrData = {
            id: registro.id,
            nombre: registro.participante.nombre,
            email: registro.participante.email,
            evento: 'Semana de Mecatrónica 2025',
            fecha: registro.metadata.fechaRegistro,
            tipo: registro.participante.tipoParticipante,
            paquete: registro.participante.paquete,
            taller: registro.participante.taller,
            valido: true
        };

        res.json(qrData);

    } catch (error) {
        console.error('Error al obtener datos del QR:', error);
        res.status(500).json({
            error: 'Error al obtener datos del QR',
            message: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de la Semana de Mecatrónica 2025 corriendo en:`);
    console.log(`   📱 Página Principal: http://localhost:${PORT}`);
    console.log(`   📝 Registro: http://localhost:${PORT}/registro_semana_mecatronica.html`);
    console.log(`   🏆 Concursos: http://localhost:${PORT}/concursos_semana_mecatronica.html`);
    console.log(`   👥 Administración: http://localhost:${PORT}/admin_registros.html`);
    console.log(`   📱 Escáner QR: http://localhost:${PORT}/EscanerQR/index.html`);
    console.log(`   📊 API Registros: http://localhost:${PORT}/api/registros`);
    console.log(`\n📁 Registros se guardan en: ${registrosDir}`);
    console.log(`\n🔗 Enlaces de Acceso:`);
    console.log(`   • Desarrollo: http://localhost:${PORT}/EscanerQR/index.html`);
    console.log(`   • Producción: https://semanameca.upiiz.ipn.mx/EscanerQR/index.html`);
});
