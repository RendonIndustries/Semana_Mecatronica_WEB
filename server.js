const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;

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

// Archivo para asistencias y entregas
const archivoAsistencias = path.join(registrosDir, 'asistencias_entregas_2025.json');

// Archivo para pagos
const archivoPagos = path.join(registrosDir, 'pagos_semana_mecatronica_2025.json');

// Archivo para registros de concursos
const archivoConcursos = path.join(registrosDir, 'registros_concursos_2025.json');

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

// Función para cargar asistencias y entregas
function cargarAsistencias() {
    try {
        if (fs.existsSync(archivoAsistencias)) {
            const contenido = fs.readFileSync(archivoAsistencias, 'utf8');
            return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error al cargar asistencias:', error);
    }
    
    // Estructura inicial si no existe el archivo
    return {
        metadata: {
            version: "1.0",
            evento: "Semana de Mecatrónica 2025",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
        },
        asistencias: {
            conferencias: [],
            talleres: []
        },
        entregas: {
            kits: [],
            comida: []
        }
    };
}

// Función para guardar asistencias y entregas
function guardarAsistencias(datos) {
    try {
        datos.metadata.ultimaActualizacion = new Date().toISOString();
        const jsonData = JSON.stringify(datos, null, 2);
        fs.writeFileSync(archivoAsistencias, jsonData, 'utf8');
        return true;
    } catch (error) {
        console.error('Error al guardar asistencias:', error);
        return false;
    }
}

// Función para cargar pagos
function cargarPagos() {
    try {
        if (fs.existsSync(archivoPagos)) {
            const contenido = fs.readFileSync(archivoPagos, 'utf8');
            return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error al cargar pagos:', error);
    }
    
    // Estructura inicial si no existe el archivo
    return {
        metadata: {
            version: "1.0",
            evento: "Semana de Mecatrónica 2025",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
        },
        pagos: []
    };
}

// Función para guardar pagos
function guardarPagos(data) {
    try {
        data.metadata.ultimaActualizacion = new Date().toISOString();
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(archivoPagos, jsonData, 'utf8');
        return true;
    } catch (error) {
        console.error('Error al guardar pagos:', error);
        return false;
    }
}

// Función para cargar registros de concursos
function cargarConcursos() {
    try {
        if (fs.existsSync(archivoConcursos)) {
            const contenido = fs.readFileSync(archivoConcursos, 'utf8');
            return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error al cargar concursos:', error);
    }
    
    // Estructura inicial si no existe el archivo
    return {
        metadata: {
            version: "1.0",
            evento: "Semana de Mecatrónica 2025",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
        },
        concursos: {
            minisumo: [],
            seguidorlinea: [],
            boxeohumanoide: [],
            robotcombate: [],
            trivia: []
        }
    };
}

// Función para guardar registros de concursos
function guardarConcursos(data) {
    try {
        data.metadata.ultimaActualizacion = new Date().toISOString();
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(archivoConcursos, jsonData, 'utf8');
        return true;
    } catch (error) {
        console.error('Error al guardar concursos:', error);
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

        // Verificar pago si se seleccionó un paquete
        if (data.participante.paquete && data.participante.paquete !== 'ninguno') {
            if (!data.participante.idPago) {
                return res.status(400).json({
                    error: 'ID de pago requerido',
                    message: 'Debe proporcionar un ID de pago para el paquete seleccionado'
                });
            }

            // Verificar que el pago existe y está disponible
            const pagosData = cargarPagos();
            const pago = pagosData.pagos.find(p => p.idPago === data.participante.idPago);
            
            if (!pago) {
                return res.status(404).json({
                    error: 'Pago no encontrado',
                    message: 'El ID de pago no existe en nuestros registros'
                });
            }
            
            if (pago.estado === 'usado') {
                return res.status(400).json({
                    error: 'Pago ya utilizado',
                    message: 'Este ID de pago ya ha sido utilizado en otro registro'
                });
            }
            
            // Verificar que el tipo de paquete coincida
            if (pago.tipoPaquete !== data.participante.paquete) {
                return res.status(400).json({
                    error: 'Tipo de paquete incorrecto',
                    message: `El pago corresponde a ${pago.tipoPaquete}, pero seleccionaste ${data.participante.paquete}`
                });
            }
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
            // Marcar pago como usado si se seleccionó un paquete
            if (data.participante.paquete && data.participante.paquete !== 'ninguno' && data.participante.idPago) {
                const pagosData = cargarPagos();
                const pagoIndex = pagosData.pagos.findIndex(p => p.idPago === data.participante.idPago);
                if (pagoIndex !== -1) {
                    pagosData.pagos[pagoIndex].estado = 'usado';
                    pagosData.pagos[pagoIndex].idRegistro = nuevoRegistro.id;
                    pagosData.pagos[pagoIndex].fechaUso = new Date().toISOString();
                    guardarPagos(pagosData);
                }
            }
            
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

// API para registrar asistencia
app.post('/api/asistencia', (req, res) => {
    try {
        const { id, tipo, taller } = req.body;
        
        if (!id || !tipo) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Se requiere ID y tipo de asistencia'
            });
        }

        // Verificar que el registro existe
        const registrosData = cargarRegistros();
        const registro = registrosData.registros.find(r => r.id === id);
        
        if (!registro) {
            return res.status(404).json({
                error: 'Registro no encontrado',
                message: 'El ID proporcionado no existe'
            });
        }

        // Cargar asistencias existentes
        const asistenciasData = cargarAsistencias();
        const ahora = new Date().toISOString();
        
        // Verificar si ya existe la asistencia
        let yaRegistrado = false;
        let mensaje = '';
        
        if (tipo === 'conferencias') {
            yaRegistrado = asistenciasData.asistencias.conferencias.some(a => a.id === id);
            if (!yaRegistrado) {
                asistenciasData.asistencias.conferencias.push({
                    id: id,
                    nombre: registro.participante.nombre,
                    email: registro.participante.email,
                    fecha: ahora,
                    tipo: 'conferencias'
                });
                mensaje = 'Asistencia a conferencias registrada exitosamente';
            } else {
                mensaje = 'Ya se había registrado la asistencia a conferencias';
            }
        } else if (tipo === 'talleres') {
            if (!taller) {
                return res.status(400).json({
                    error: 'Taller requerido',
                    message: 'Se debe especificar el taller para registrar asistencia'
                });
            }
            
            // Validar que el participante esté inscrito en el taller correcto
            const tallerInscrito = registro.participante.taller;
            if (tallerInscrito !== taller) {
                return res.status(400).json({
                    error: 'Taller incorrecto',
                    message: `Este participante no está inscrito en el ${taller}. Su taller asignado es: ${tallerInscrito}`,
                    tallerCorrecto: tallerInscrito,
                    tallerIntentado: taller
                });
            }
            
            yaRegistrado = asistenciasData.asistencias.talleres.some(a => a.id === id && a.taller === taller);
            if (!yaRegistrado) {
                asistenciasData.asistencias.talleres.push({
                    id: id,
                    nombre: registro.participante.nombre,
                    email: registro.participante.email,
                    taller: taller,
                    fecha: ahora,
                    tipo: 'talleres'
                });
                mensaje = `Asistencia al taller ${taller} registrada exitosamente`;
            } else {
                mensaje = `Ya se había registrado la asistencia al taller ${taller}`;
            }
        }

        // Guardar asistencias
        if (guardarAsistencias(asistenciasData)) {
            res.json({
                success: true,
                message: mensaje,
                yaRegistrado: yaRegistrado,
                datos: {
                    id: id,
                    nombre: registro.participante.nombre,
                    tipo: tipo,
                    taller: taller || null,
                    fecha: ahora
                }
            });
        } else {
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Error al guardar la asistencia'
            });
        }

    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para registrar entrega
app.post('/api/entrega', (req, res) => {
    try {
        const { id, tipo } = req.body;
        
        if (!id || !tipo) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Se requiere ID y tipo de entrega'
            });
        }

        // Verificar que el registro existe
        const registrosData = cargarRegistros();
        const registro = registrosData.registros.find(r => r.id === id);
        
        if (!registro) {
            return res.status(404).json({
                error: 'Registro no encontrado',
                message: 'El ID proporcionado no existe'
            });
        }

        // Cargar entregas existentes
        const asistenciasData = cargarAsistencias();
        const ahora = new Date().toISOString();
        
        // Verificar si ya existe la entrega
        let yaEntregado = false;
        let mensaje = '';
        
        if (tipo === 'kit') {
            yaEntregado = asistenciasData.entregas.kits.some(e => e.id === id);
            if (!yaEntregado) {
                asistenciasData.entregas.kits.push({
                    id: id,
                    nombre: registro.participante.nombre,
                    email: registro.participante.email,
                    fecha: ahora,
                    tipo: 'kit'
                });
                mensaje = 'Kit entregado exitosamente';
            } else {
                mensaje = 'Ya se había entregado el kit a este participante';
            }
        } else if (tipo === 'comida') {
            yaEntregado = asistenciasData.entregas.comida.some(e => e.id === id);
            if (!yaEntregado) {
                asistenciasData.entregas.comida.push({
                    id: id,
                    nombre: registro.participante.nombre,
                    email: registro.participante.email,
                    fecha: ahora,
                    tipo: 'comida'
                });
                mensaje = 'Comida entregada exitosamente';
            } else {
                mensaje = 'Ya se había entregado la comida a este participante';
            }
        }

        // Guardar entregas
        if (guardarAsistencias(asistenciasData)) {
            res.json({
                success: true,
                message: mensaje,
                yaEntregado: yaEntregado,
                datos: {
                    id: id,
                    nombre: registro.participante.nombre,
                    tipo: tipo,
                    fecha: ahora
                }
            });
        } else {
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Error al guardar la entrega'
            });
        }

    } catch (error) {
        console.error('Error al registrar entrega:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para obtener asistencias y entregas
app.get('/api/asistencias', (req, res) => {
    try {
        const asistenciasData = cargarAsistencias();
        res.json({
            ...asistenciasData,
            fecha_consulta: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para actualizar datos de un usuario
app.put('/api/registro/:id', (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        
        const registrosData = cargarRegistros();
        const indice = registrosData.registros.findIndex(r => r.id === id);
        
        if (indice === -1) {
            return res.status(404).json({
                error: 'Registro no encontrado',
                message: 'El ID proporcionado no existe'
            });
        }
        
        // Actualizar datos del participante
        const registro = registrosData.registros[indice];
        Object.keys(nuevosDatos).forEach(key => {
            if (nuevosDatos[key] !== undefined && nuevosDatos[key] !== '') {
                registro.participante[key] = nuevosDatos[key];
            }
        });
        
        registro.metadata.ultimaModificacion = new Date().toISOString();
        
        if (guardarRegistros(registrosData)) {
            res.json({
                success: true,
                message: 'Datos actualizados exitosamente',
                registro: registro
            });
        } else {
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Error al guardar los cambios'
            });
        }
        
    } catch (error) {
        console.error('Error al actualizar registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para eliminar un registro
app.delete('/api/registro/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        const registrosData = cargarRegistros();
        const indice = registrosData.registros.findIndex(r => r.id === id);
        
        if (indice === -1) {
            return res.status(404).json({
                error: 'Registro no encontrado',
                message: 'El ID proporcionado no existe'
            });
        }
        
        const registroEliminado = registrosData.registros[indice];
        registrosData.registros.splice(indice, 1);
        
        if (guardarRegistros(registrosData)) {
            res.json({
                success: true,
                message: 'Registro eliminado exitosamente',
                registroEliminado: registroEliminado
            });
        } else {
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Error al eliminar el registro'
            });
        }
        
    } catch (error) {
        console.error('Error al eliminar registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para obtener estadísticas
app.get('/api/estadisticas', (req, res) => {
    try {
        const registrosData = cargarRegistros();
        const asistenciasData = cargarAsistencias();
        
        const estadisticas = {
            totalRegistros: registrosData.registros.length,
            porTipo: {
                ipn: registrosData.registros.filter(r => r.participante.tipoParticipante === 'ipn').length,
                externo: registrosData.registros.filter(r => r.participante.tipoParticipante === 'externo').length
            },
            porPaquete: {
                paquete1: registrosData.registros.filter(r => r.participante.paquete === 'paquete1').length,
                paquete2: registrosData.registros.filter(r => r.participante.paquete === 'paquete2').length,
                ninguno: registrosData.registros.filter(r => r.participante.paquete === 'ninguno').length
            },
            porTaller: {
                taller1: registrosData.registros.filter(r => r.participante.taller === 'taller1').length,
                taller2: registrosData.registros.filter(r => r.participante.taller === 'taller2').length,
                taller3: registrosData.registros.filter(r => r.participante.taller === 'taller3').length,
                taller4: registrosData.registros.filter(r => r.participante.taller === 'taller4').length,
                taller5: registrosData.registros.filter(r => r.participante.taller === 'taller5').length,
                taller6: registrosData.registros.filter(r => r.participante.taller === 'taller6').length
            },
            asistencias: {
                conferencias: asistenciasData.asistencias.conferencias.length,
                talleres: asistenciasData.asistencias.talleres.length
            },
            entregas: {
                kits: asistenciasData.entregas.kits.length,
                comida: asistenciasData.entregas.comida.length
            },
            fechaConsulta: new Date().toISOString()
        };
        
        res.json(estadisticas);
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// ==================== RUTAS DE PAGOS ====================

// API para verificar pago
app.post('/api/verificar-pago', (req, res) => {
    try {
        const { idPago } = req.body;
        
        if (!idPago) {
            return res.status(400).json({
                error: 'ID de pago requerido',
                message: 'Debe proporcionar un ID de pago válido'
            });
        }
        
        const pagosData = cargarPagos();
        const pago = pagosData.pagos.find(p => p.idPago === idPago);
        
        if (!pago) {
            return res.status(404).json({
                error: 'Pago no encontrado',
                message: 'El ID de pago no existe en nuestros registros'
            });
        }
        
        if (pago.estado === 'usado') {
            return res.status(400).json({
                error: 'Pago ya utilizado',
                message: 'Este ID de pago ya ha sido utilizado en otro registro'
            });
        }
        
        res.json({
            success: true,
            pago: {
                idPago: pago.idPago,
                tipoPaquete: pago.tipoPaquete,
                monto: pago.monto,
                fechaPago: pago.fechaPago,
                estado: pago.estado
            }
        });
        
    } catch (error) {
        console.error('Error al verificar pago:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para marcar pago como usado
app.post('/api/marcar-pago-usado', (req, res) => {
    try {
        const { idPago, idRegistro } = req.body;
        
        if (!idPago || !idRegistro) {
            return res.status(400).json({
                error: 'Datos requeridos',
                message: 'Debe proporcionar ID de pago e ID de registro'
            });
        }
        
        const pagosData = cargarPagos();
        const pagoIndex = pagosData.pagos.findIndex(p => p.idPago === idPago);
        
        if (pagoIndex === -1) {
            return res.status(404).json({
                error: 'Pago no encontrado',
                message: 'El ID de pago no existe'
            });
        }
        
        if (pagosData.pagos[pagoIndex].estado === 'usado') {
            return res.status(400).json({
                error: 'Pago ya utilizado',
                message: 'Este pago ya ha sido utilizado'
            });
        }
        
        // Marcar pago como usado
        pagosData.pagos[pagoIndex].estado = 'usado';
        pagosData.pagos[pagoIndex].idRegistro = idRegistro;
        pagosData.pagos[pagoIndex].fechaUso = new Date().toISOString();
        
        if (guardarPagos(pagosData)) {
            res.json({
                success: true,
                message: 'Pago marcado como usado exitosamente'
            });
        } else {
            res.status(500).json({
                error: 'Error al guardar',
                message: 'No se pudo actualizar el estado del pago'
            });
        }
        
    } catch (error) {
        console.error('Error al marcar pago como usado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para obtener todos los pagos (solo para administradores)
app.get('/api/pagos', (req, res) => {
    try {
        const pagosData = cargarPagos();
        res.json(pagosData);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// Función para generar ID de pago único (6 caracteres alfanuméricos)
function generarIdPago() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let idPago = '';
    
    // Generar ID único
    do {
        idPago = '';
        for (let i = 0; i < 6; i++) {
            idPago += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
    } while (cargarPagos().pagos.some(p => p.idPago === idPago));
    
    return idPago;
}

// API para agregar nuevo pago (solo para administradores)
app.post('/api/pagos', (req, res) => {
    try {
        const { tipoPaquete, notas } = req.body;
        
        if (!tipoPaquete) {
            return res.status(400).json({
                error: 'Datos requeridos',
                message: 'Debe proporcionar el tipo de paquete'
            });
        }
        
        // Montos fijos por tipo de paquete
        const montos = {
            'paquete1': 150.00,
            'paquete2': 250.00
        };
        
        const monto = montos[tipoPaquete];
        if (!monto) {
            return res.status(400).json({
                error: 'Tipo de paquete inválido',
                message: 'El tipo de paquete debe ser "paquete1" o "paquete2"'
            });
        }
        
        const pagosData = cargarPagos();
        
        // Generar ID de pago único
        const idPago = generarIdPago();
        
        // Crear nuevo pago
        const nuevoPago = {
            idPago: idPago,
            tipoPaquete: tipoPaquete,
            monto: monto,
            fechaPago: new Date().toISOString(),
            estado: 'disponible',
            notas: notas || '',
            fechaCreacion: new Date().toISOString()
        };
        
        pagosData.pagos.push(nuevoPago);
        
        if (guardarPagos(pagosData)) {
            res.json({
                success: true,
                message: 'Pago generado exitosamente',
                pago: nuevoPago
            });
        } else {
            res.status(500).json({
                error: 'Error al guardar',
                message: 'No se pudo guardar el pago'
            });
        }
        
    } catch (error) {
        console.error('Error al agregar pago:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para actualizar pago
app.put('/api/pagos/:idPago', (req, res) => {
    try {
        const { idPago } = req.params;
        const { tipoPaquete, monto, fechaPago, notas, estado } = req.body;
        
        const pagosData = cargarPagos();
        const pagoIndex = pagosData.pagos.findIndex(p => p.idPago === idPago);
        
        if (pagoIndex === -1) {
            return res.status(404).json({
                error: 'Pago no encontrado',
                message: 'El ID de pago no existe'
            });
        }
        
        // Actualizar campos si se proporcionan
        if (tipoPaquete !== undefined) pagosData.pagos[pagoIndex].tipoPaquete = tipoPaquete;
        if (monto !== undefined) pagosData.pagos[pagoIndex].monto = parseFloat(monto);
        if (fechaPago !== undefined) pagosData.pagos[pagoIndex].fechaPago = fechaPago;
        if (notas !== undefined) pagosData.pagos[pagoIndex].notas = notas;
        if (estado !== undefined) pagosData.pagos[pagoIndex].estado = estado;
        
        pagosData.pagos[pagoIndex].fechaModificacion = new Date().toISOString();
        
        if (guardarPagos(pagosData)) {
            res.json({
                success: true,
                message: 'Pago actualizado exitosamente',
                pago: pagosData.pagos[pagoIndex]
            });
        } else {
            res.status(500).json({
                error: 'Error al guardar',
                message: 'No se pudo actualizar el pago'
            });
        }
        
    } catch (error) {
        console.error('Error al actualizar pago:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para eliminar pago
app.delete('/api/pagos/:idPago', (req, res) => {
    try {
        const { idPago } = req.params;
        
        const pagosData = cargarPagos();
        const pagoIndex = pagosData.pagos.findIndex(p => p.idPago === idPago);
        
        if (pagoIndex === -1) {
            return res.status(404).json({
                error: 'Pago no encontrado',
                message: 'El ID de pago no existe'
            });
        }
        
        // Verificar si el pago ya fue usado
        if (pagosData.pagos[pagoIndex].estado === 'usado') {
            return res.status(400).json({
                error: 'No se puede eliminar',
                message: 'No se puede eliminar un pago que ya ha sido utilizado'
            });
        }
        
        // Eliminar pago
        const pagoEliminado = pagosData.pagos.splice(pagoIndex, 1)[0];
        
        if (guardarPagos(pagosData)) {
            res.json({
                success: true,
                message: 'Pago eliminado exitosamente',
                pago: pagoEliminado
            });
        } else {
            res.status(500).json({
                error: 'Error al guardar',
                message: 'No se pudo eliminar el pago'
            });
        }
        
    } catch (error) {
        console.error('Error al eliminar pago:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// ==================== RUTAS DE CONCURSOS ====================

// API para registrar equipo en concurso
app.post('/api/registro-concurso', (req, res) => {
    try {
        const data = req.body;
        
        // Validar datos básicos
        if (!data || !data.metadata || !data.equipo) {
            return res.status(400).json({
                error: 'Datos inválidos',
                message: 'Se requiere información del equipo y metadata'
            });
        }
        
        const tipoConcurso = data.metadata.tipoConcurso;
        
        // Verificar que el tipo de concurso sea válido
        const concursosValidos = ['minisumo', 'seguidorlinea', 'boxeohumanoide', 'robotcombate', 'trivia'];
        if (!concursosValidos.includes(tipoConcurso)) {
            return res.status(400).json({
                error: 'Tipo de concurso inválido',
                message: 'El tipo de concurso no es válido'
            });
        }
        
        // Verificar registros de participantes
        const registrosData = cargarRegistros();
        
        if (tipoConcurso === 'trivia') {
            // Validar que sean 4 integrantes
            if (!data.equipo.integrantes || data.equipo.integrantes.length !== 4) {
                return res.status(400).json({
                    error: 'Número de integrantes inválido',
                    message: 'El equipo debe tener exactamente 4 integrantes'
                });
            }
            
            // Verificar que todos los IDs existan
            const idsInvalidos = [];
            const nombresIntegrantes = [];
            
            for (const idIntegrante of data.equipo.integrantes) {
                const registro = registrosData.registros.find(r => r.id === idIntegrante);
                if (!registro) {
                    idsInvalidos.push(idIntegrante);
                } else {
                    nombresIntegrantes.push(registro.participante.nombre);
                }
            }
            
            if (idsInvalidos.length > 0) {
                return res.status(404).json({
                    error: 'IDs no válidos',
                    message: `Los siguientes IDs no están registrados: ${idsInvalidos.join(', ')}`
                });
            }
            
            // Agregar nombres de integrantes al registro
            data.equipo.nombresIntegrantes = nombresIntegrantes;
            
        } else {
            // Para concursos de robótica, verificar el ID del participante
            if (!data.equipo.idRegistroParticipante) {
                return res.status(400).json({
                    error: 'ID de participante requerido',
                    message: 'Se requiere el ID de registro del participante'
                });
            }
            
            const registro = registrosData.registros.find(r => r.id === data.equipo.idRegistroParticipante);
            if (!registro) {
                return res.status(404).json({
                    error: 'Participante no encontrado',
                    message: 'El ID de registro no existe. Por favor verifica que el ID sea correcto.'
                });
            }
            
            // Agregar nombre del participante al registro
            data.equipo.nombreParticipante = registro.participante.nombre;
        }
        
        // Cargar registros de concursos
        const concursosData = cargarConcursos();
        
        // Generar ID único para el equipo
        const idEquipo = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Crear registro del equipo
        const nuevoRegistro = {
            idEquipo: idEquipo,
            ...data,
            fechaGuardado: new Date().toISOString()
        };
        
        // Agregar a la categoría correspondiente
        if (!concursosData.concursos[tipoConcurso]) {
            concursosData.concursos[tipoConcurso] = [];
        }
        
        concursosData.concursos[tipoConcurso].push(nuevoRegistro);
        
        // Guardar
        if (guardarConcursos(concursosData)) {
            res.json({
                success: true,
                message: 'Equipo registrado exitosamente en el concurso',
                idEquipo: idEquipo,
                tipoConcurso: tipoConcurso,
                nombreEquipo: data.equipo.nombreEquipo
            });
        } else {
            res.status(500).json({
                error: 'Error al guardar',
                message: 'No se pudo guardar el registro del concurso'
            });
        }
        
    } catch (error) {
        console.error('Error al registrar concurso:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para obtener todos los registros de concursos
app.get('/api/concursos', (req, res) => {
    try {
        const concursosData = cargarConcursos();
        res.json(concursosData);
    } catch (error) {
        console.error('Error al obtener concursos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// API para obtener registros de un concurso específico
app.get('/api/concursos/:tipo', (req, res) => {
    try {
        const tipo = req.params.tipo;
        const concursosData = cargarConcursos();
        
        if (!concursosData.concursos[tipo]) {
            return res.status(404).json({
                error: 'Concurso no encontrado',
                message: 'El tipo de concurso no existe'
            });
        }
        
        res.json({
            tipo: tipo,
            equipos: concursosData.concursos[tipo],
            total: concursosData.concursos[tipo].length
        });
    } catch (error) {
        console.error('Error al obtener concurso:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
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
