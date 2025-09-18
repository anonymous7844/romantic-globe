// Nome e versão do cache
const CACHE_NAME = 'romantic-globe-v1';

// Arquivos essenciais para cache (adicione aqui se criar mais arquivos no futuro)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/romantic-places-part1.json',
  '/romantic-places-part2.json',
  '/manifest.json'
];

// Instala e faz cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Intercepta fetch e responde do cache quando offline
self.addEventListener('fetch', event => {
  const request = event.request;
  // não cachear requisições API externas (unsplash/deepseek)
  if (request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
