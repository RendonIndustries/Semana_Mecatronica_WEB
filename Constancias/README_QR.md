# 🔐 Sistema de Validación con Códigos QR

Este sistema agrega códigos QR únicos a cada constancia para validación y seguridad.

## 📋 Descripción

Cada constancia incluye un código QR único que:
- ✅ Permite validar la autenticidad de la constancia
- ✅ Evita modificaciones no autorizadas
- ✅ Contiene un hash único vinculado a la constancia
- ✅ Incluye URL de validación

## 🚀 Uso

### Opción 1: Desde el Notebook Jupyter

1. Abre `analizar_constancias.ipynb`
2. Ejecuta las celdas para extraer los PDFs individuales
3. Ejecuta la celda "Agregar Códigos QR a las Constancias"
4. Espera a que termine el proceso

### Opción 2: Desde la Terminal

```powershell
cd Constancias
node agregar_qr_constancias.js
```

### Opción 3: Con URL personalizada

```powershell
cd Constancias
$env:BASE_URL="https://tu-dominio.com"
node agregar_qr_constancias.js
```

## 📍 Ubicación del QR

El código QR se agrega en la **esquina inferior derecha** de cada constancia con:
- Tamaño: 80 puntos (aprox 2.8 cm)
- Color: Guinda del IPN (#6A0032)
- Texto: "Validar en:" debajo del QR

## 🔍 Validación

### Validar una constancia

1. Escanea el código QR con cualquier lector de QR
2. O visita: `https://semanameca.upiiz.ipn.mx/api/constancias/validar?hash=XXXXX`
3. El sistema verificará si la constancia es válida

### Respuesta de validación

**Constancia válida:**
```json
{
  "success": true,
  "valida": true,
  "mensaje": "Constancia válida",
  "constancia": {
    "nombre": "Juan Pérez García",
    "actividad": "Conferencias Generales",
    "tipo": "conferencias",
    "archivo": "Juan Pérez García - Conferencias Generales.pdf"
  }
}
```

**Constancia no válida:**
```json
{
  "success": true,
  "valida": false,
  "mensaje": "Constancia no válida o no encontrada"
}
```

## 📁 Archivos Generados

Después de ejecutar el script, se generan:

- `Conferencias/Individuales/hashes_validacion.json` - Base de datos de hashes de conferencias
- `Talleres/Individuales/hashes_validacion.json` - Base de datos de hashes de talleres

Estos archivos son necesarios para la validación y **NO deben eliminarse**.

## ⚙️ Configuración

Edita `agregar_qr_constancias.js` para cambiar:

- **BASE_URL**: URL base para validación (línea 8)
- **qrSize**: Tamaño del QR en el PDF (línea 67)
- **Posición**: Ubicación del QR en la página (líneas 70-71)

## 🔒 Seguridad

- Cada constancia tiene un hash único SHA256
- El hash se genera a partir de: nombre + actividad + tipo + fecha
- Los hashes se almacenan en archivos JSON separados
- Solo las constancias con hash válido pueden ser verificadas

## 📝 Notas

- El proceso puede tardar varios minutos (877 conferencias + 271 talleres)
- Los PDFs originales se sobrescriben con las versiones que incluyen QR
- Se recomienda hacer una copia de seguridad antes de ejecutar
