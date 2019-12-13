import { createServer, Server } from 'net';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const form: string = `
<html>
  <body>
    <form action="http://localhost:${port}/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="my-file">
      <input type="submit">
    </form>
  </body>
</html>
`;

const server: Server = createServer((socket) => {
  console.log(`[server] connected client: ${JSON.stringify(socket.address())}`);
  
  socket.on('data', data => {
    console.log(`[server] received data from client: ${socket.bytesRead}`);
    
    const raw: string = data.toString();
    console.log(raw);
    
    if (/^GET \/ /i.test(raw)) {
      const response: string = [
        'HTTP/1.1 200 OK',
        'Content-Type: text/html',
        'Status: 200',
        '',
        '',
        form,
        '',
        '',
      ].join('\r\n');
      
      socket.write(response);
    } else if (/^POST \/upload /i.test(raw)) {
      const response: string = [
        'HTTP/1.1 200 OK',
        'Content-Type: text/html',
        'Status: 200',
        '',
        '',
        '<html><body>UPLOADED!</body></html>',
        '',
        '',
      ].join('\r\n');
      
      socket.write(response);
    }
  });
});

server.listen(port, () => {
  console.log(`[server] opened server: ${JSON.stringify(server.address())}`);
});