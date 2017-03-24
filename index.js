#!/usr/bin/env node
const http = require('http');
const server = http.createServer();
const fs = require('fs');
const path = require('path');
const os = require('os');
const spawnSync = require('child_process').spawnSync;

server.on('request', (req, res)=> {
  if (req.url === '/favicon.ico') {
    res.end();
    return;
  }
  const staticFilePath = path.resolve('.' + decodeURIComponent(req.url));
  const indexFile = path.resolve(staticFilePath, 'index.html');
  if (fs.existsSync(indexFile)) {
    fs.createReadStream(indexFile).pipe(res)
  } else {
    if (fs.lstatSync(staticFilePath).isDirectory()) {
      var files = fs.readdirSync(staticFilePath);
      var lis = '';
      files.forEach(function (v, i) {
        if (fs.lstatSync(path.resolve(staticFilePath, v)).isDirectory()) {
          lis += `<li><a href="${req.url}${v}/">${v}/</a></li>`;
        } else {
          lis += `<li><a href="${req.url}${v}">${v}</a></li>`;
        }
      });
      res.end(`<html> <head><style> body { font-family: Consolas, sans-serif; margin: 0; padding:30px 100px; } ul { list-style: none; } li { line-height: 30px; } a { color: #4dc71f; } </style></head> <body> <ul> ${lis} </ul> </body> </html>`);
    } else {
      if (fs.existsSync(path.resolve(staticFilePath))) {
        fs.createReadStream(staticFilePath).pipe(res);
      } else {
        res.end('404 not found');
      }
    }
  }
});
server.listen(8080, ()=> {
  console.log('服务器已经启动');
  console.log('访问localhost:8080');
  if (os.platform() === 'win32') {
    spawnSync('explorer', ['http://localhost:8080']);
  } else {
    spawnSync('open', ['http://localhost:8080']);
  }
});
process.on('uncaughtException', (exception)=> {
  console.log('err');
});
