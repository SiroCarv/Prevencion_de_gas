Dashboard: Sistema de Prevención y Monitoreo de Gas IoT

Interfaz de usuario (Frontend) diseñada para monitorear en tiempo real un sistema IoT de detección de gas. La aplicación se conecta localmente a un microcontrolador (ESP8266/ESP32) con un sensor de gas (ej. MQ-2) para visualizar los niveles del ambiente y alertar sobre posibles fugas.

¿Cómo funciona?

Ingreso de IP: El usuario introduce la dirección IP local asignada al microcontrolador.

Polling de Datos: La aplicación de React realiza peticiones HTTP (GET /data) cada 500 milisegundos para obtener lecturas actualizadas.

Análisis de Estado:

Normal: Se muestra una interfaz verde que indica seguridad.

Peligro: Si el sensor detecta niveles altos, la interfaz cambia a un rojo intermitente y simula la respuesta del sistema (cierre de válvula de gas a 180° y encendido de ventilación).

Características

Conexión Directa: No requiere de un servidor backend intermedio o servicios en la nube; se conecta directo a la IP del nodo.

Actualización Instantánea: Refresco de datos cada medio segundo para una capacidad de respuesta óptima ante emergencias.

Diseño Reactivo y Responsivo: Construido con Tailwind CSS para adaptarse a diferentes pantallas y cambiar radicalmente su diseño visual bajo estados de alerta.

Tolerancia a fallos: Muestra mensajes de error claros si el sensor se desconecta o la red falla.

Instalación Local

Para ejecutar este proyecto en tu entorno local de desarrollo:

Clonar el repositorio:

git clone <https://github.com/SiroCarv/Prevencion_de_gas.git>
cd prevencion_de_gas


Instalar los paquetes de Node:

npm install


Ejecutar el entorno de desarrollo:

npm run dev


Acceso: Abre http://localhost:5173 en tu navegador.

Integración con el Hardware (NodeMCU / ESP)

Para que este dashboard funcione correctamente, tu microcontrolador debe estar configurado como un servidor web en la red local y tener un endpoint en la ruta /data que responda a peticiones GET con un objeto JSON exacto a este:

{
  "gas": 450, 
  "alerta": false 
}


Nota: El valor de gas corresponde a la lectura analógica del sensor (0-1023) y alerta es un booleano que determina si se ha superado el umbral de peligro.

Tecnologías Principales

Frontend: React, Vite.

Estilos: Tailwind CSS, Lucide React (Iconos).