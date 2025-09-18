# Escáner QR - Semana de Mecatrónica 2025

## Descripción
Portal móvil para administradores que permite escanear códigos QR de los participantes registrados en la Semana de Mecatrónica 2025.

## Características

### 🎯 Funcionalidades Principales
- **Auditorio - Pase de Lista**: Control de asistencia a conferencias
- **Talleres - Pase de Lista**: Control de asistencia a talleres específicos
- **Entrega de Kits**: Control de entrega de kits (solo para Paquete 2)
- **Comida de Clausura**: Control de entrega de comida (para todos los paquetes)

### 📱 Optimizado para Móviles
- Interfaz responsive
- Acceso a cámara trasera
- Detección automática de códigos QR
- Vibración en dispositivos compatibles
- Modo pantalla completa para escaneo

### 🔧 Tecnologías Utilizadas
- HTML5, CSS3, JavaScript
- Bootstrap 5 para interfaz
- jsQR para detección de códigos QR
- MediaDevices API para acceso a cámara
- **Powered by Rendón Industries**

## Instalación y Uso

### Requisitos
- Navegador web moderno con soporte para:
  - MediaDevices API
  - Canvas API
  - ES6+ JavaScript
- Acceso a cámara del dispositivo
- Conexión a internet para validar registros

### Acceso
```
http://localhost:8000/EscanerQR/
```

### Uso del Escáner

1. **Seleccionar Modo**: Elegir el tipo de control a realizar
2. **Permitir Cámara**: Autorizar acceso a la cámara del dispositivo
3. **Escanear QR**: Apuntar la cámara al código QR del participante
4. **Verificar Resultado**: Revisar la información del participante
5. **Continuar**: Proceder con el siguiente participante

## Estructura de Archivos

```
EscanerQR/
├── index.html          # Página principal
├── mobile.css          # Estilos para móviles
├── scanner.js          # Lógica del escáner
├── Mi_Logo.png         # Logo de Rendón Industries
└── README.md           # Este archivo
```

## APIs Utilizadas

### Validación de Registros
- `GET /api/qr-data/:id` - Obtener datos del registro por ID

### Estructura de Datos QR
```json
{
  "id": "1758143989304wh2uhf108",
  "nombre": "Miguel Angel Rendón Díaz",
  "email": "miguecraft89@gmail.com",
  "evento": "Semana de Mecatrónica 2025",
  "fecha": "2025-09-17T21:19:49.287Z",
  "tipo": "ipn",
  "paquete": "paquete2",
  "taller": "taller1",
  "valido": true
}
```

## Modos de Operación

### 1. Auditorio - Pase de Lista
- Registra asistencia a conferencias
- Muestra información del participante
- No requiere validación especial

### 2. Talleres - Pase de Lista
- Registra asistencia a talleres específicos
- Muestra el taller seleccionado
- Permite control por taller

### 3. Entrega de Kits
- Valida que el participante tenga Paquete 2
- Muestra advertencia si no tiene kit
- Control de entrega única

### 4. Comida de Clausura
- Valida que el participante tenga paquete (no "ninguno")
- Muestra advertencia si no tiene derecho a comida
- Control de entrega única

## Características Técnicas

### Detección de QR
- Usa jsQR library para detección
- Procesamiento en tiempo real
- Tolerancia a errores de lectura

### Optimizaciones
- Cache de registros para consultas repetidas
- Manejo de cambios de orientación
- Prevención de zoom accidental
- Gestión de visibilidad de página

### Seguridad
- Validación de registros en servidor
- Verificación de datos QR
- Log de actividades (preparado para implementación)

## Solución de Problemas

### Cámara no funciona
- Verificar permisos del navegador
- Asegurar que la cámara no esté en uso por otra aplicación
- Probar en modo incógnito

### QR no se detecta
- Verificar que el código QR esté bien impreso
- Asegurar buena iluminación
- Mantener distancia adecuada (20-30 cm)

### Errores de conexión
- Verificar conexión a internet
- Comprobar que el servidor esté funcionando
- Revisar la consola del navegador

## Soporte

Para soporte técnico o reportar problemas:
- **Desarrollado por**: Rendón Industries
- **Tecnología**: Vanguardia en soluciones digitales
- **Evento**: Semana de Mecatrónica 2025 - UPIIZ IPN

---

*Powered by Rendón Industries - Tecnología de vanguardia*
