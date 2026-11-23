/* Cornerstone Tech Advisory service worker. scripts/stamp-sw.mjs fills in VERSION and PRECACHE at build time. */
const VERSION = 'dev';
const PRECACHE = [];
const CORE = `cs-core-${VERSION}`;
const RUNTIME = `cs-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE);
      const urls = [...new Set([OFFLINE_URL, '/offline.css', '/manifest.webmanifest', '/boot.js', ...PRECACHE])];
      await Promise.allSettled(urls.map((u) => cache.add(new Request(u, { cache: 'reload' }))));
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([CORE, RUNTIME]);
      for (const key of await caches.keys()) if (key.startsWith('cs-') && !keep.has(key)) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const res = await Promise.race([fetch(request), timeout(4000)]);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true }));
    if (hit) return hit;
    if (request.mode === 'navigate') return (await caches.match(OFFLINE_URL)) || Response.error();
    return Response.error();
  }
}

async function cacheFirst(request) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) (await caches.open(RUNTIME)).put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const hit = (await cache.match(request)) || (await caches.match(request));
  const fresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return hit || (await fresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
