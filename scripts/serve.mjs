// Minimal static server for local verification: serves dist/ with the global headers from public/_headers.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 4321);

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

const globalHeaders = {};
{
  const text = await readFile(path.join(root, 'public', '_headers'), 'utf8');
  let inGlobal = false;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    if (!line.startsWith(' ')) inGlobal = line.trim() === '/*';
    else if (inGlobal) {
      const i = line.indexOf(':');
      globalHeaders[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
}
// Local http is not https, so skip the upgrade directive that would break asset loading.
globalHeaders['Content-Security-Policy'] = globalHeaders['Content-Security-Policy'].replace('; upgrade-insecure-requests', '');

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const target = path.normalize(path.join(dist, clean));
  if (!target.startsWith(dist)) return null;
  const candidates = [target, path.join(target, 'index.html')];
  for (const c of candidates) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch { /* try next */ }
  }
  return null;
}

http
  .createServer(async (req, res) => {
    let file = await resolveFile(req.url);
    let status = 200;
    if (!file) {
      file = path.join(dist, '404.html');
      status = 404;
    }
    try {
      const body = await readFile(file);
      res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', ...globalHeaders });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end('error');
    }
  })
  .listen(port, () => console.log(`Serving dist on http://localhost:${port}`));
