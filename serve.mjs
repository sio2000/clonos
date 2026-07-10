// Minimal static server for the mirror. Strips query strings, serves index.html
// for directory paths. Usage: node serve.mjs [port]
import http from 'node:http';
import { promises as fs, createReadStream } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('C:/Users/theoharis/Desktop/pouma-clone/site');
const PORT = Number(process.argv[2] || 8099);
const TYPES = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8', '.mjs':'application/javascript',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.gif':'image/gif', '.svg':'image/svg+xml',
  '.webp':'image/webp', '.ico':'image/x-icon', '.woff':'font/woff',
  '.woff2':'font/woff2', '.ttf':'font/ttf', '.eot':'application/vnd.ms-fontobject',
  '.mp4':'video/mp4', '.webm':'video/webm', '.xml':'application/xml',
};

http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (pathname.endsWith('/')) pathname += 'index.html';
    let file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
    let st;
    try { st = await fs.stat(file); } catch { st = null; }
    if (st && st.isDirectory()) file = path.join(file, 'index.html');
    try { st = await fs.stat(file); } catch {
      // fallback: try adding index.html (extensionless WP pages)
      const alt = path.join(ROOT, pathname, 'index.html');
      try { await fs.stat(alt); file = alt; } catch {
        res.writeHead(404, {'Content-Type':'text/plain'}); return res.end('404: ' + pathname);
      }
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
}).listen(PORT, () => console.log('Mirror serving at http://localhost:' + PORT + '/'));
