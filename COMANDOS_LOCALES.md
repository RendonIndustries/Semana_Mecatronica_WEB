# 🖥️ Comandos para Probar Localmente - Semana de Mecatrónica 2025

## 📋 **Requisitos Previos**

- Node.js instalado (versión 16 o superior)
- NPM instalado
- Navegador web moderno

## 🚀 **Pasos para Ejecutar Localmente**

### 1. **Instalar Dependencias**
```bash
npm install
```

### 2. **Iniciar el Servidor**
```bash
node server.js
```

### 3. **Acceder a las Páginas**

#### 🌐 **Páginas Principales:**
- **Página Principal:** http://localhost:3000
- **Registro:** http://localhost:3000/registro_semana_mecatronica.html
- **Concursos:** http://localhost:3000/concursos_semana_mecatronica.html
- **Administración:** http://localhost:3000/admin_registros.html

#### 🔐 **Portal de Escáner QR:**
- **Login:** http://localhost:3000/EscanerQR/login.html
- **Escáner:** http://localhost:3000/EscanerQR/index.html

### 4. **Credenciales del Escáner QR**
- **Usuario:** `SemanaMeca2025`
- **Contraseña:** `xhdrbz25`

## 🧪 **Pruebas del Sistema de Pagos**

### 1. **Agregar Pagos de Prueba**
1. Accede al escáner QR
2. Haz login con las credenciales
3. Haz clic en "Gestión de Pagos"
4. Ve a la pestaña "Agregar Pago"
5. Agrega algunos pagos de prueba:

**Ejemplo de Pagos:**
- **ID:** `PAY001` | **Paquete:** `paquete1` | **Monto:** `150.00`
- **ID:** `PAY002` | **Paquete:** `paquete2` | **Monto:** `250.00`
- **ID:** `PAY003` | **Paquete:** `paquete1` | **Monto:** `150.00`

### 2. **Probar Registro con Pago**
1. Ve a la página de registro
2. Llena el formulario
3. Selecciona un paquete (Paquete 1 o Paquete 2)
4. Ingresa un ID de pago válido (ej: `PAY001`)
5. El sistema debería verificar el pago automáticamente
6. Completa el registro

### 3. **Verificar Funcionalidades**
- ✅ Verificación de pago en tiempo real
- ✅ Validación de tipo de paquete
- ✅ Prevención de uso duplicado de pagos
- ✅ Gestión completa de pagos desde el admin

## 📁 **Estructura de Archivos Generados**

El sistema creará automáticamente:
```
Registros2025/
├── registros_semana_mecatronica_2025.json
├── asistencias_entregas_2025.json
└── pagos_semana_mecatronica_2025.json
```

## 🔧 **Comandos Útiles**

### **Ver Logs del Servidor**
```bash
# En otra terminal
tail -f logs/server.log
```

### **Reiniciar el Servidor**
```bash
# Detener: Ctrl + C
# Reiniciar:
node server.js
```

### **Limpiar Datos de Prueba**
```bash
# Eliminar archivos JSON (¡CUIDADO!)
rm -rf Registros2025/
```

## 🐛 **Solución de Problemas**

### **Error: Puerto 3000 en uso**
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
# Matar proceso
kill -9 <PID>
```

### **Error: Módulos no encontrados**
```bash
# Reinstalar dependencias
rm -rf node_modules/
npm install
```

### **Error: Permisos de archivos**
```bash
# Dar permisos de escritura
chmod 755 Registros2025/
```

## 📊 **APIs Disponibles**

### **Registro**
- `POST /api/registro` - Crear nuevo registro
- `GET /api/registros` - Listar todos los registros
- `PUT /api/registro/:id` - Actualizar registro
- `DELETE /api/registro/:id` - Eliminar registro

### **Pagos**
- `POST /api/verificar-pago` - Verificar pago
- `GET /api/pagos` - Listar todos los pagos
- `POST /api/pagos` - Agregar nuevo pago
- `PUT /api/pagos/:idPago` - Actualizar pago
- `DELETE /api/pagos/:idPago` - Eliminar pago

### **Asistencias y Entregas**
- `POST /api/asistencia` - Registrar asistencia
- `POST /api/entrega` - Registrar entrega
- `GET /api/asistencias` - Obtener asistencias

### **QR Codes**
- `GET /api/qr/:id` - Generar código QR
- `GET /api/qr-data/:id` - Obtener datos del QR

## 🎯 **Flujo de Trabajo Completo**

1. **Admin agrega pagos** → Portal de gestión de pagos
2. **Usuario se registra** → Página de registro con verificación de pago
3. **Sistema valida pago** → Verificación automática en tiempo real
4. **Registro exitoso** → Pago marcado como usado
5. **QR generado** → Usuario puede descargar su código QR
6. **Evento** → Escáner QR para control de acceso

## 🔒 **Seguridad**

- ✅ Validación de pagos en tiempo real
- ✅ Prevención de uso duplicado
- ✅ Verificación de tipo de paquete
- ✅ Autenticación en portal admin
- ✅ Validación de datos en frontend y backend

---

**¡El sistema está listo para usar! 🚀**
