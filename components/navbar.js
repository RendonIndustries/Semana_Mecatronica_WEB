// Función para cargar el navbar y configurar el elemento activo
function loadNavbar(activeElement = null) {
    // Detectar la ruta correcta basada en la ubicación actual
    const currentPath = window.location.pathname;
    let navbarPath = 'components/navbar.html';
    
    // Si estamos en una subcarpeta, ajustar la ruta
    if (currentPath.includes('/conocenos/')) {
        navbarPath = '../components/navbar.html';
    }
    
    // Cargar el navbar desde el archivo HTML
    fetch(navbarPath)
        .then(response => response.text())
        .then(data => {
            // Insertar el navbar en el elemento con id 'navbar-container'
            document.getElementById('navbar-container').innerHTML = data;
            
            // Ajustar las rutas de los enlaces si estamos en una subcarpeta
            if (currentPath.includes('/conocenos/')) {
                adjustNavbarLinks('../');
            }
            
            // Configurar el elemento activo si se especifica
            if (activeElement) {
                setActiveNavItem(activeElement);
            }
        })
        .catch(error => {
            console.error('Error cargando el navbar:', error);
            // Fallback: mostrar un mensaje de error o navbar básico
            document.getElementById('navbar-container').innerHTML = '<div class="alert alert-warning">Error cargando el menú de navegación</div>';
        });
}

// Función para ajustar las rutas de los enlaces del navbar
function adjustNavbarLinks(basePath) {
    // Obtener todos los enlaces del navbar
    const links = document.querySelectorAll('#navbar-container a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Solo ajustar enlaces relativos (no externos ni anclas absolutas)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Si el enlace ya no comienza con 'conocenos/', agregar el basePath
            if (!href.startsWith('conocenos/')) {
                link.setAttribute('href', basePath + href);
            }
        }
    });
}

// Función para marcar un elemento del navbar como activo
function setActiveNavItem(activeElement) {
    // Remover todas las clases 'active' existentes
    document.querySelectorAll('.nav-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelectorAll('.dropdown-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar la clase 'active' al elemento especificado
    const targetElement = document.querySelector(`[data-active="${activeElement}"]`);
    if (targetElement) {
        targetElement.classList.add('active');
        
        // Si es un dropdown-item, también marcar el dropdown padre como activo
        if (targetElement.classList.contains('dropdown-item')) {
            const dropdownParent = targetElement.closest('.dropdown');
            if (dropdownParent) {
                dropdownParent.classList.add('active');
            }
        }
    }
}

// Función para detectar automáticamente la página actual y configurar el navbar
function autoDetectActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const currentPath = window.location.pathname;
    let activeElement = 'inicio'; // Default
    
    // Detectar página de directorio
    if (currentPath.includes('/conocenos/directorio.html') || currentPage === 'directorio.html') {
        activeElement = 'conocenos';
    }
    // Detectar otras páginas
    else switch (currentPage) {
        case 'semana_mecatronica_2025.html':
        case '':
            activeElement = 'inicio';
            break;
        case 'concursos_semana_mecatronica.html':
            activeElement = 'concursos';
            break;
        case 'Conferencias.html':
            activeElement = 'conferencias';
            break;
        case 'Exposiciones.html':
            activeElement = 'exposiciones';
            break;
        case 'registro_semana_mecatronica.html':
            activeElement = 'registro';
            break;
        default:
            activeElement = 'inicio';
    }
    
    loadNavbar(activeElement);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si existe el contenedor del navbar
    if (document.getElementById('navbar-container')) {
        autoDetectActiveNav();
    }
});
