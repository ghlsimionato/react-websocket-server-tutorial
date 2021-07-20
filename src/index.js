const websocket = require('websocket');
const http = require('http');

const port = 8001;
const httpServer = http.createServer();

const WebSocketServer = websocket.server;

// HTTP server initialization
httpServer.listen(port);

console.log(`Server started on port = ${port}`);

// an object that stores the connections with the connection ID as the object key
const connections = {};

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// WebSocket server initialization
const webSocketServer = new WebSocketServer({
  httpServer,
});

// Lists all connections stored in connections object
const listAllConnections = () => {
  Object.keys(connections).forEach(key => console.log(`Connection ${key}`));
  console.log('\n');
}

// WebSocket event handlers
const socketRequestHandler = (request) => {
  console.log('Socket Connection Established');

  const connectionID = getUniqueID();

  const connection = request.accept(null, request.origin);
  connections[connectionID] = connection;

  console.log('Connected to connection ID: ' + connectionID);

  console.log('\n Listing all current connections');
  listAllConnections();

  connection.on('message', (message) => {
    console.log(`Server received message = ${message.utf8Data}`);
    connection.sendUTF('Thank you for the wonderful message');
  });

  connection.on('close', () => {
    console.log(`Connection ${connectionID} closed, removing from stored connections`);
    delete connections[connectionID];
  });
};

// Applying handler to websocket server request events
webSocketServer.on('request', socketRequestHandler);
