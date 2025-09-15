// service-worker.js — cache avançado com estratégias por tipo
const VERSION = 'v3'; // altere quando fizer deploy para invalidar caches
const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;
const JSON_CACHE = `json-${VERSION}`;
const API_CACHE = `api-${VERSION}`;

// Arquivos estáticos essenciais para offline
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/romantic-places-part1.json',
  '/romantic-places-part2.json'
];

// Install — pré-cacheia arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate — limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => ![STATIC_CACHE,DYNAMIC_CACHE,JSON_CACHE,API_CACHE].includes(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Função utilitária para guardar resposta no cache
async function cachePut(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  cache.put(request, response.clone());
  return response;
}

// Fetch handler — estratégia dinâmica
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Não interferir no hot reload do Vercel
  if (url.pathname.startsWith('/_next') || req.method !== 'GET') return;

  // HTML: network first com fallback offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => cachePut(STATIC_CACHE, req, res))
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // CSS/JS/Imagens: cache first
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          // atualiza em segundo plano
          fetch(req).then(res => cachePut(STATIC_CACHE, req, res));
          return cached;
        }
        return fetch(req).then(res => cachePut(STATIC_CACHE, req, res));
      })
    );
    return;
  }

  // JSON (romantic-places): stale-while-revalidate
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(res => cachePut(JSON_CACHE, req, res));
        return cached || fetchPromise;
      })
    );
    return;
  }

  // APIs (/api/unsplash ou /api/deepseek): cache curto
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req)
          .then(res => cachePut(API_CACHE, req, res))
          .catch(() => cached);
        // Se há cache, retorna rápido, atualiza em bg; senão espera rede
        return cached || fetchPromise;
      })
    );
    return;
  }

  // fallback padrão
  event.respondWith(fetch(req));
});
