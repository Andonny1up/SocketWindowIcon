const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let windows = [];
let currentWindowIndex = 0;

let x = 0;
let dx = 5;

wss.on('connection', ws => {
  // Agregar la ventana a la lista
  windows.push(ws);

  // Enviar la posición inicial al cliente que se conecta
  ws.send(JSON.stringify({ x, windowId: windows.length }));

  // Manejar el cierre de la conexión
  ws.on('close', () => {
    // Eliminar la ventana de la lista
    windows = windows.filter(window => window !== ws);

    // Reiniciar el índice de ventana actual si no quedan ventanas
    if (windows.length === 0) {
      currentWindowIndex = 0;
    } else if (currentWindowIndex >= windows.length) {
      currentWindowIndex = currentWindowIndex % windows.length;
    }
  });
});

function updatePosition() {
  // Actualizar la posición para el siguiente movimiento
  x += dx;

  // Enviar la posición actualizada a la ventana actual
  const currentWindow = windows[currentWindowIndex];
  if (currentWindow) {
    currentWindow.send(JSON.stringify({ x, windowId: currentWindowIndex }));
  }

  // Reiniciar la posición si el icono sale completamente de la ventana
  const windowWidth = 800; // Ancho de la ventana
  if (x > windowWidth) {
    x = -200;
    currentWindowIndex = (currentWindowIndex + 1) % windows.length;
  }
}

setInterval(updatePosition, 100);

console.log('Servidor WebSocket escuchando en el puerto 8080...');
