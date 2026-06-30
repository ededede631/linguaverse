const CACHE_NAME = "linguaverse-static-cache-20260701e";
const CORE_ASSETS = [
  "/linguaverse/",
  "/linguaverse/index.html",
  "/linguaverse/404.html",
  "/linguaverse/favicon.svg",
  "/linguaverse/assets/site-fixes.js",
  "/linguaverse/assets/index-2OLDfEAz.js",
  "/linguaverse/assets/index-Crjrm-fJ.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached || caches.match("/linguaverse/index.html"));
      return cached || network;
    })
  );
});
