// Stamps dist/sw.js with a build version and the list of files to precache. Runs after `astro build`.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk(dist)).map((f) => '/' + path.relative(dist, f).split(path.sep).join('/'));
const precache = [];
for (const f of files) {
  if (f.startsWith('/_astro/')) {
    // Only Latin font subsets are needed; skip the other unicode ranges.
    if (f.endsWith('.woff2') && !/-latin-wght/.test(f)) continue;
    if (f.endsWith('.woff')) continue;
    precache.push(f);
  } else if (f.endsWith('/index.html')) {
    precache.push(f.slice(0, -'index.html'.length));
  } else if (/^\/icons\/(icon-192|icon-512|icon\.svg|apple-touch-icon)/.test(f)) {
    precache.push(f);
  }
}
precache.sort();

const hash = createHash('sha1');
for (const f of precache) {
  const p = f.endsWith('/') ? path.join(dist, f, 'index.html') : path.join(dist, f);
  hash.update(f);
  hash.update(await readFile(p));
}
const version = hash.digest('hex').slice(0, 10);

const swPath = path.join(dist, 'sw.js');
let sw = await readFile(swPath, 'utf8');
sw = sw.replace("const VERSION = 'dev';", `const VERSION = '${version}';`).replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(precache)};`);
await writeFile(swPath, sw);
const size = (await stat(swPath)).size;
console.log(`sw.js stamped: version ${version}, ${precache.length} precache entries (${size} bytes)`);
