import { createServer, Server, Socket } from "net";

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const server: Server = createServer((clientSocket: Socket) => {
  // 2. this is the client below
  console.log(
    `[server] connected client: ${JSON.stringify(clientSocket.address())}`
  );

  clientSocket.on("data", (clientData) => {
    // 4. receive data from client
    console.log(`[server] received data from client: ${clientData}`);

    clientSocket.write(`~~echo~~ ${clientData.toString()}\r\n`); // 5. send data to client
  });
});

server.listen(port, () => {
  console.log(`[server] opened server: ${JSON.stringify(server.address())}`);
});

// ---------------------------------------------
// client
// ---------------------------------------------
const client: Socket = new Socket();

client.connect(port, "127.0.0.1", () => {
  // 1. connect to server
  console.log(`[client] connected`);
  client.write("hello world!"); // 3. send data to server
});

client.on("data", (serverData) => {
  // 6. receive data from server
  console.log(`[client] received data from server: ${serverData}`);
  client.destroy();
});

client.on("close", () => {
  console.log(`[client] connection closed`);
});
