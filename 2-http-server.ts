import { createServer, Server, Socket } from 'net';
import fetch from 'node-fetch';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((clientSocket: Socket) => { // 2. this is the fetch client below
  console.log(`[server] connected client: ${JSON.stringify(clientSocket.address())}`);
  
  clientSocket.on('data', data => { // 3. receive data from fetch client
    console.log(`[server] received data from client:`);
    console.log(data.toString().split('\r\n'));
  });
});

server.listen(port, () => {
  console.log(`[server] opened server: ${JSON.stringify(server.address())}`);
});

// ---------------------------------------------
// client
// ---------------------------------------------
fetch(`http://localhost:${port}`); // 1. connect to server and send data
