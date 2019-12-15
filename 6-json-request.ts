import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { Socket } from 'net';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
const app: Koa = new Koa();
const router: Router = new Router();

router.post('/api', koaBody(), (ctx) => {
  console.log(`[server] received data from client:`);
  console.log(JSON.stringify(ctx.request.body, null, 2));
  
  ctx.body = {
    echo: ctx.request.body,
  };
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`[server] started: ${port}`);
});

// ---------------------------------------------
// client
// ---------------------------------------------
const client: Socket = new Socket();

client.connect(port, '127.0.0.1', () => {
  console.log(`[client] connected`);
  
  const data: string = JSON.stringify({
    hello: 'world!',
  });
  
  const request: string = [
    `POST /api HTTP/1.1`,
    `Accept: */*`,
    `Host: localhost:${port}`,
    `Content-Length: ${data.length}`,
    `Content-Type: application/json`,
    `User-Agent: test-client`,
    ``,
    data,
  ].join('\r\n');
  
  console.log(`[client] request:`);
  console.log(request.split('\r\n'));
  
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