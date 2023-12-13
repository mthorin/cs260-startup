const { WebSocketServer } = require('ws');
const gameConnections = require('./gameConnections.js');
const uuid = require('uuid');

function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  const connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    // Forward messages to everyone except the sender
    ws.on('message', function message(data) {
      const packet = JSON.parse(data);
      console.log(packet);
      if (packet.type === "move"){
        connections.forEach((c) => {
          let match = false;
          clients = c.getClients();
          clients.forEach((cl) => {
            if(cl.id === connection.id){
              match = true;
            }
          });
          if (match){
            clients.forEach((cl) => {
              if (cl.id !== connection.id) {
                cl.ws.send(data);
              }
            });
          }
        });
      } else if (packet.type === "link"){
        let connected = false;
        connections.forEach((c) => {
          if (c.getGameID() === packet.game_id){
            c.addClient(connection);
            connected = true;
          }
        });
        if (!connected){
          connections.push(new gameConnections(packet.game_id, connection));
        }
        console.log("Connected successfully.");
        console.log(connections);
      }
    });

    // Remove the closed connection so we don't try to forward anymore
    ws.on('close', () => {
      connections.findIndex((o, i) => {
        let empty = 2;
        clients = o.getClients();
        clients.forEach((cl) => {
          if(cl.id === connection.id){
            empty = o.removeClient(connection);
          }
        });
        if (empty === 0){
          connections.splice(i, 1);
          return true;
        }
      });
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      clients = c.getClients();
      clients.forEach((cl) => {
        if (!cl.alive) {
          cl.ws.terminate();
        } else {
          cl.alive = false;
          cl.ws.ping();
        }
      });
    });
  }, 10000);
}

module.exports = { peerProxy };
