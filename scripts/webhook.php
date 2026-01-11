<?php
/**
 * Webhook para GitHub - Despliegue automático
 * Este archivo recibe las notificaciones de GitHub cuando hay cambios en el repositorio
 */

// Configuración
$secret = 'semana_mecatronica_2025_secret_key'; // Cambiar por una clave secreta
$log_file = '/var/www/semana-mecatronica/logs/webhook.log';
$deploy_script = '/var/www/semana-mecatronica/deploy.sh';

// Función para logging
function log_webhook($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($log_file, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido');
}

// Obtener el payload
$payload = file_get_contents('php://input');
$headers = getallheaders();

// Verificar que sea de GitHub
if (!isset($headers['X-GitHub-Event'])) {
    log_webhook('Error: No es una petición de GitHub');
    http_response_code(400);
    exit('No es una petición de GitHub');
}

// Verificar el evento
$event = $headers['X-GitHub-Event'];
log_webhook("Evento recibido: $event");

// Solo procesar push events en la rama main
if ($event === 'push') {
    $data = json_decode($payload, true);
    
    if ($data && isset($data['ref']) && $data['ref'] === 'refs/heads/main') {
        log_webhook('Push detectado en rama main - Iniciando despliegue');
        
        // Ejecutar script de despliegue en background
        $command = "nohup $deploy_script > /dev/null 2>&1 &";
        exec($command);
        
        log_webhook('Script de despliegue ejecutado en background');
        
        http_response_code(200);
        echo 'Despliegue iniciado';
    } else {
        log_webhook('Push detectado pero no en rama main - Ignorando');
        http_response_code(200);
        echo 'Ignorado - No es rama main';
    }
} else {
    log_webhook("Evento ignorado: $event");
    http_response_code(200);
    echo 'Evento ignorado';
}
?>
