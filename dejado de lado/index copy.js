const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let windowA = null;
let windowB = null;

let x = 0;
let y = 0;
let dx = 5;
let dy = 5;

wss.on('connection', ws => {
  // Asignar las ventanas A y B
  if (!windowA) {
    windowA = ws;
  } else if (!windowB) {
    windowB = ws;
  }

  ws.on('message', message => {
    // Recibir mensaje del cliente (si es necesario)
  });

  ws.on('close', () => {
    if (ws === windowA) {
      windowA = null;
    } else if (ws === windowB) {
      windowB = null;
    }
  });
});

function updatePosition() {
  // Actualizar las coordenadas
  x += dx;
  y += dy;

  // Enviar las nuevas coordenadas a las ventanas A y B
  if (windowA) {
    windowA.send(JSON.stringify({ x, y, windowId: 'A' }));
  }
  if (windowB) {
    windowB.send(JSON.stringify({ x, y, windowId: 'B' }));
  }

  // Invertir la dirección si la imagen alcanza los límites
  if (x <= 0 || x >= 500) {
    dx *= -1;
  }
  if (y <= 0 || y >= 500) {
    dy *= -1;
  }
}

setInterval(updatePosition, 100);

console.log('Servidor WebSocket escuchando en el puerto 8080...');
