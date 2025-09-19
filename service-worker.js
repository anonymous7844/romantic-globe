// Nome do cache
const CACHE_NAME = 'romantic-map-v1';

// Arquivos que serão colocados no cache (adicione aqui se criar mais)
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/romantic-places-part1.json',
  '/romantic-places-part2.json',
  '/manifest.json'
];

// Instala o service worker e faz o pré-cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requisições para servir do cache offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // se tiver no cache, usa
      if (response) return response;

      // senão, busca na rede e salva no cache
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // pode retornar uma página fallback aqui se quiser
      });
    })
  );
});
