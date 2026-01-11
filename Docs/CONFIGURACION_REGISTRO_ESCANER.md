# 🔧 Configuración de Registro y Escáner QR

Este documento explica cómo habilitar o deshabilitar el sistema de registro y el escáner QR.

## 📋 Archivo de Configuración

El archivo `config.js` en la raíz del proyecto controla el estado de estas funcionalidades.

## ⚙️ Configuración Actual

Por defecto, tanto el **registro** como el **escáner QR** están **DESHABILITADOS**.

### Para Habilitar el Registro

1. Abre el archivo `config.js`
2. Cambia la línea:
   ```javascript
   registro: {
       habilitado: false,  // Cambiar a true para habilitar el registro
   ```
   Por:
   ```javascript
   registro: {
       habilitado: true,  // Registro habilitado
   ```

### Para Habilitar el Escáner QR

1. Abre el archivo `config.js`
2. Cambia la línea:
   ```javascript
   escanerQR: {
       habilitado: false,  // Cambiar a true para habilitar el escáner QR
   ```
   Por:
   ```javascript
   escanerQR: {
       habilitado: true,  // Escáner QR habilitado
   ```

## 🎯 Comportamiento del Sistema

### Cuando el Registro está DESHABILITADO:

- ✅ El enlace "Registro" se oculta del menú de navegación
- ✅ La página de registro muestra un mensaje informativo
- ✅ Las peticiones POST a `/api/registro` son rechazadas con error 503
- ✅ Los usuarios no pueden completar el formulario de registro

### Cuando el Escáner QR está DESHABILITADO:

- ✅ El enlace "Escáner QR" se oculta del menú de navegación
- ✅ La página de login del escáner muestra un mensaje informativo
- ✅ La página principal del escáner muestra un mensaje informativo
- ✅ Las rutas `/EscanerQR` y `/EscanerQR/` muestran un mensaje de error

## 📝 Mensajes Personalizados

Puedes personalizar los mensajes que se muestran cuando las funcionalidades están deshabilitadas editando el archivo `config.js`:

```javascript
registro: {
    habilitado: false,
    mensajeDeshabilitado: "Tu mensaje personalizado aquí"
},
escanerQR: {
    habilitado: false,
    mensajeDeshabilitado: "Tu mensaje personalizado aquí"
}
```

## 🔄 Reiniciar el Servidor

Después de cambiar la configuración, es necesario reiniciar el servidor Node.js para que los cambios surtan efecto:

```bash
# Detener el servidor (Ctrl+C)
# Luego iniciarlo nuevamente
node server.js
```

O si usas los scripts proporcionados:

```bash
# Windows
scripts\iniciar_servidor.bat

# PowerShell
scripts\iniciar_servidor.ps1
```

## ✅ Verificación

Para verificar que los cambios funcionan correctamente:

1. **Registro deshabilitado:**
   - Visita `http://localhost:3000/registro_semana_mecatronica.html`
   - Deberías ver un mensaje indicando que el registro está deshabilitado
   - El enlace "Registro" no debería aparecer en el menú

2. **Escáner QR deshabilitado:**
   - Visita `http://localhost:3000/EscanerQR/`
   - Deberías ver un mensaje indicando que el escáner está deshabilitado
   - El enlace "Escáner QR" no debería aparecer en el menú

## 🚨 Notas Importantes

- Los cambios en `config.js` requieren reiniciar el servidor
- Los cambios en el navbar se aplican automáticamente al recargar la página
- El sistema está diseñado para que estas funcionalidades solo estén activas durante el período de inscripciones y el evento
