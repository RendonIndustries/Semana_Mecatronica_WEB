# Componentes Modulares - Semana de Mecatrónica 2025

## Navbar Modular

El navbar modular permite mantener la navegación consistente en todas las páginas del sitio web de la Semana de Mecatrónica 2025.

### Archivos

- `navbar.html` - Contenido HTML del navbar
- `navbar.js` - Lógica JavaScript para cargar y configurar el navbar
- `README.md` - Esta documentación

### Uso

#### 1. Incluir el contenedor del navbar

En cada página HTML, reemplaza el navbar completo con:

```html
<!-- Menu Principal -->
<div id="navbar-container"></div>
```

#### 2. Incluir el script del navbar

Antes del cierre de `</body>`, agrega:

```html
<!-- Script del navbar modular -->
<script src="components/navbar.js"></script>
```

#### 3. Configuración automática

El script detectará automáticamente la página actual y marcará el elemento correspondiente como activo:

- `semana_mecatronica_2025.html` → "inicio"
- `concursos_semana_mecatronica.html` → "concursos"
- `Conferencias.html` → "conferencias"
- `registro_semana_mecatronica.html` → "registro"

#### 4. Configuración manual (opcional)

Si necesitas configurar manualmente el elemento activo, puedes llamar:

```javascript
loadNavbar('nombreDelElemento');
```

### Elementos disponibles

Los siguientes elementos pueden marcarse como activos:

- `inicio` - Página principal
- `actividades` - Menú de actividades
- `concursos` - Página de concursos
- `conferencias` - Página de conferencias
- `poster` - Sección de posters
- `conocenos` - Menú conócenos
- `directorio` - Página de directorio
- `cfp` - Call for Papers
- `programa` - Programa del evento
- `registro` - Página de registro
- `participantes` - Menú participantes
- `estudiantes` - Información para estudiantes
- `docentes` - Información para docentes
- `empresarios` - Información para empresarios
- `publico` - Información para público general
- `colaboradores` - Sección colaboradores
- `patrocinadores` - Sección patrocinadores
- `escaner` - Escáner QR
- `contacto` - Sección de contacto

### Ventajas

1. **Mantenimiento centralizado**: Un solo lugar para actualizar el navbar
2. **Consistencia**: Todas las páginas usan exactamente el mismo navbar
3. **Automatización**: El elemento activo se configura automáticamente
4. **Flexibilidad**: Fácil agregar nuevas páginas al sistema

### Notas técnicas

- El script usa `fetch()` para cargar el HTML del navbar
- Compatible con navegadores modernos
- Incluye fallback en caso de error de carga
- Funciona tanto en desarrollo como en producción

### Actualización del navbar

Para actualizar el navbar en todas las páginas:

1. Edita `components/navbar.html`
2. Los cambios se aplicarán automáticamente en todas las páginas que usen el sistema modular

### Troubleshooting

Si el navbar no se carga:

1. Verifica que la ruta `components/navbar.js` sea correcta
2. Asegúrate de que `components/navbar.html` exista
3. Revisa la consola del navegador para errores
4. Verifica que el elemento `#navbar-container` exista en la página
