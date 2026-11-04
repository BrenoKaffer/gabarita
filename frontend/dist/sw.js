const CACHE = 'gabarita-v3';

// No install: não pré-cacheamos nada — evita falhas se o cert ainda não está pronto
self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

// Activate: limpa caches antigos imediatamente
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API: sempre rede, sem cache
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Arquivos estáticos (JS, CSS, imagens, fontes): cache-first, mas só armazena respostas OK
  if (
    url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?|json)$/) &&
    !url.pathname.includes('questions.json')
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Páginas HTML e tudo mais: network-first (sem cache)
  e.respondWith(fetch(e.request));
});
