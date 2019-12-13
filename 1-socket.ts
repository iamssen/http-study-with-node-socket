import { createServer, Server, Socket } from 'net';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((socket) => {
  console.log(`[server] connected client: ${JSON.stringify(socket.address())}`);
  
  socket.on('data', data => {
    console.log(`[server] received data from client: ${data}`);
  
    socket.write(`~~echo~~ ${data.toString()}\r\n`);
  });
  
});

server.listen(port, () => {
  console.log(`[server] opened server: ${JSON.stringify(server.address())}`);
});

// ---------------------------------------------
// client
// ---------------------------------------------
const client: Socket = new Socket();

client.connect(port, '127.0.0.1', () => {
  console.log(`[client] connected`);
  client.write('hello world!');
});

client.on('data', data => {
  console.log(`[client] received data from server: ${data}`);
  client.destroy();
});

client.on('close', () => {
  console.log(`[client] connection closed`);
});