// Service Worker — Aplicaciones Educativas
// Coloca este archivo junto a tus HTML en GitHub Pages

const CACHE = 'edu-apps-v1';

const APPS = [
  './exploradores_naturaleza.html',
  './cuerpo_humano_v3.html',
  './exploradores_colombia_v2.html',
  './aprendo_leer_escribir.html',
  './matematicas_primaria.html',
  './index.html',
  './sw.js',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return Promise.allSettled(APPS.map(url => cache.add(url).catch(() => {})));
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const net = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    )
  );
});
