import { createServer, Server, Socket } from 'net';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((socket) => {
  console.log(`[server] connected client: ${JSON.stringify(socket.address())}`);
  
  socket.on('data', data => {
    console.log(`[server] received data from client:`);
    console.log(data.toString().split('\r\n'));
    
    const response: string = [
      'HTTP/1.1 200 OK',
      'Content-Type: text/html',
      'Status: 200',
      '',
      '',
      '<html><body>Hello World!</body></html>',
      '',
      '',
    ].join('\r\n');
    
    socket.write(response);
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
  
  const request: string = [
    'GET / HTTP/1.1',
    'Accept: */*',
    'User-Agent: test-agent',
    'Host: localhost:' + port,
    '',
    '',
  ].join('\r\n');
  
  client.write(request);
});

client.on('data', data => {
  console.log(`[client] received data from server:`);
  console.log(data.toString().split('\r\n'));
  client.destroy();
});

client.on('close', () => {
  console.log(`[client] connection closed`);
});