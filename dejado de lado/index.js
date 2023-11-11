const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Variables para el movimiento de la imagen
let x = 0;
let y = 0;
let dx = 5;
let dy = 5;

// Broadcast a todos los clientes conectados
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Función para actualizar la posición de la imagen
function updatePosition() {
  // Actualizar las coordenadas
  x += dx;
  y += dy;

  // Invertir la dirección si la imagen alcanza los límites
  if (x <= 0 || x >= 500) {
    dx *= -1;
  }
  if (y <= 0 || y >= 500) {
    dy *= -1;
  }

  // Enviar las nuevas coordenadas a todos los clientes
  const positionData = JSON.stringify({ x, y });
  broadcast(positionData);
}

// Ejecutar la función updatePosition cada 100ms (10 FPS)
setInterval(updatePosition, 100);

// Manejar la conexión de los clientes WebSocket
wss.on('connection', ws => {
  // Enviar las coordenadas iniciales al cliente que se conecta
  ws.send(JSON.stringify({ x, y }));

  // Manejar los mensajes enviados por el cliente (si los hay)
  ws.on('message', message => {
    console.log(`Mensaje recibido: ${message}`);
  });
});

console.log('Servidor WebSocket escuchando en el puerto 8080...');
