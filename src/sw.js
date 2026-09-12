const CACHE = "finplay-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(["/", "/manifest.webmanifest"])));
});
self.addEventListener("fetch", e => {
  if (e.request.method === "GET") {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
  }
});