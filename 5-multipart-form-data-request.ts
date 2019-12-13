import fs, { ReadStream, WriteStream } from 'fs-extra';
import Koa from 'koa';
import Body from 'koa-body';
import Router from 'koa-router';
import { Socket } from 'net';
import os from 'os';
import path from 'path';

const port: number = 9903;

// ---------------------------------------------
// server
// ---------------------------------------------
function uid() {
  return Math.random().toString(36).slice(2);
}

export interface File {
  size: number;
  path: string;
  name: string;
  type: string;
  lastModifiedDate?: Date;
  hash?: string;
  
  toJSON(): Object;
}

export interface Files {
  [key: string]: File; // | File[];
}

const app: Koa = new Koa();
const router: Router = new Router();

app.use(Body({multipart: true}));

router.get('/', (ctx) => {
  ctx.body = `
    <html lang="en">
      <body>
        <form action="http://localhost:${port}/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="my-file">
          <input type="submit">
        </form>
      </body>
    </html>
  `;
});

router.post('/upload', async (ctx) => {
  const tmpdir: string = path.join(os.tmpdir(), uid());
  
  await fs.promises.mkdir(tmpdir);
  const filePaths: string[] = [];
  const files: Files = ctx.request.files || {};
  
  Object.keys(files).forEach(key => {
    const file: File = files[key];
    const filePath: string = path.join(tmpdir, file.name);
    const reader: ReadStream = fs.createReadStream(file.path);
    const writer: WriteStream = fs.createWriteStream(filePath);
    reader.pipe(writer);
    filePaths.push(filePath);
  });
  
  ctx.body = `
    <html lang="en">
      <body>
        <ul>
          ${filePaths.map(filePath => `<li>${filePath}</li>`)}
        </ul>
      </body>
    </html>
  `;
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
  
  const boundary: string = `----WebKitFormBoundary38yDqquZpvcGcWJX`;
  
  const content: string[] = [
    ``,
    `--${boundary}`,
    `Content-Disposition: form-data; name="my-file"; filename="test.json"`,
    `Content-Type: application/json`,
    ``,
    `{"a": 1, "b": 2, "c": 3}`,
    `--${boundary}--`,
  ];
  
  const request: string = [
    `POST /upload HTTP/1.1`,
    `Host: localhost:${port}`,
    `Content-Length: ${content.join('\r\n').length}`,
    `Content-Type: multipart/form-data; boundary=${boundary}`,
    `User-Agent: test-client`,
    ...content,
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