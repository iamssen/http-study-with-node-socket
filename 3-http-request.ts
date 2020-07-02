import { createServer, Server, Socket } from 'net';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((clientSocket: Socket) => { // 2. this is the client below
  console.log(`[server] connected client: ${JSON.stringify(clientSocket.address())}`);
  
  clientSocket.on('data', clientData => { // 4. receive the request from client below
    console.log(`[server] received data from client:`);
    console.log(clientData.toString().split('\r\n'));
    
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
    
    clientSocket.write(response); // 5. respone to client
  });
});

server.listen(port, () => {
  console.log(`[server] opened server: ${JSON.stringify(server.address())}`);
});

// ---------------------------------------------
// client
// ---------------------------------------------
const client: Socket = new Socket();

client.connect(port, '127.0.0.1', () => { // 1. connect to server
  console.log(`[client] connected`);
  
  const request: string = [
    'GET / HTTP/1.1',
    'Accept: */*',
    'User-Agent: my-test-agent',
    'Host: localhost:' + port,
    '',
    '',
  ].join('\r\n');
  
  client.write(request); // 3. request to server
});

client.on('data', serverData => { // 6. receive the response from server
  console.log(`[client] received data from server:`);
  console.log(serverData.toString().split('\r\n'));
  client.destroy();
});

client.on('close', () => {
  console.log(`[client] connection closed`);
});