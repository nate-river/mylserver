#!/usr/bin/env node
const http = require('http');
const server = http.createServer();
const fs = require('fs');
const path = require('path');
const os = require('os');
const spawnSync = require('child_process').spawnSync;
const contentTypeDict = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/octet-stream",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".epub": "application/epub+zip",
  ".gif": "image/gif",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".ics": "text/calendar",
  ".jar": "application/java-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript",
  ".json": "application/json",
  ".mid": "audio/midi",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".pdf": "application/pdf",
  ".ppt": "application/vnd.ms-powerpoint",
  ".png": "image/png",
  ".rar": "application/x-rar-compressed",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".swf": "application/x-shockwave-flash",
  ".tar": "application/x-tar",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ttf": "font/ttf",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/x-wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xml": "application/xml",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".3gp": "video/3gpp",
  ".3g2": "video/3gpp2",
  ".7z": "application/x-7z-compressed"
};
server.on('request', (req, res)=> {
  const url = req.url.replace(/\?.*/, '');
  const staticFilePath = path.resolve('.' + decodeURIComponent(url));


  if (!fs.existsSync(staticFilePath)) {
    if (req.url === '/favicon.ico') {
      fs.createReadStream(path.resolve(__dirname, 'favicon.ico')).pipe(res);
    } else {
      res.writeHead(404, 'not found');
      res.end();
    }
    return;
  }

  const indexFile = path.resolve(staticFilePath, 'index.html');

  // response index.html if exist
  if (fs.existsSync(indexFile)) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.createReadStream(indexFile).pipe(res)
  } else {
    // response directory info
    if (fs.lstatSync(staticFilePath).isDirectory()) {
      var files = fs.readdirSync(staticFilePath);
      var lis = '';
      files.forEach(function (v, i) {
        if (v !== '.DS_Store') {
          if (fs.lstatSync(path.resolve(staticFilePath, v)).isDirectory()) {
            lis += `<li><a href="${req.url}${v}/">${v}/</a></li>`;
          } else {
            lis += `<li><a href="${req.url}${v}">${v}</a></li>`;
          }
        }
      });
      fs.readFile(path.resolve(__dirname, 'category.html'), (err, buffer)=> {
        var content = buffer.toString().replace(/\{lis\}/, lis);
        res.writeHead(200, 'ok', {
          'Content-Type': 'text/html'
        });
        res.end(content);
      });
    } else {
      // response file
      if (fs.existsSync(path.resolve(staticFilePath))) {
        var ext = path.extname(staticFilePath);
        var mimeType = contentTypeDict[ext] || 'text/plain';
        res.writeHead(200, {
          'Content-Type': mimeType
        });
        fs.createReadStream(staticFilePath).pipe(res);
      } else {
        res.writeHead(404, 'not found');
        res.end();
      }
    }
  }
});

server.listen(18088, ()=> {
  console.log('server is listen 18088 port');
  if (os.platform() === 'win32') {
    spawnSync('explorer', ['http://localhost:18088']);
  } else {
    spawnSync('open', ['http://localhost:18088']);
  }
});

process.on('uncaughtException', (exception)=> {
  console.log(exception.message);
});
