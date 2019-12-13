import { createServer, Server } from 'net';
import fetch from 'node-fetch';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((socket) => {
  console.log(`[server] connected client: ${JSON.stringify(socket.address())}`);
  
  socket.on('data', data => {
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
fetch(`http://localhost:${port}`).then(res => console.log(res));
