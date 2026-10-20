// Offline support: keeps a copy of the app on the phone so it works with no signal.
// Bump VERSION whenever any file changes so phones drop the old copy.
const VERSION = 'v6';
const CACHE = `surestay-checklist-${VERSION}`;
const FILES = [
  './',
  'index.html',
  'app.js',
  'checklist.js',
  'manifest.webmanifest',
  'fonts/atkinson-hyperlegible-next.woff2',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/favicon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from the phone's copy right away; refresh that copy in the background when online.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      if (cached) { e.waitUntil(fresh); return cached; }
      return fresh;
    })
  );
});
