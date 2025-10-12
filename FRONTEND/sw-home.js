// FRONTEND/sw-home.js
const CACHE_NAME = "home-shell-v1";
const urlsToCache = [
  "/home.html",
  "/css/styles.css",
  "/js/home.js",
  "/images/logo.png" // opcional: cámbialo si tienes un logo
];

// 🟢 Instalar el service worker y guardar los archivos en caché
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Instalando App Shell...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Archivos cacheados");
      return cache.addAll(urlsToCache);
    })
  );
});

// 🟡 Activar y limpiar cachés viejos
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activado");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Borrando caché vieja:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// 🔵 Interceptar peticiones y responder desde caché si es posible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve desde caché o hace fetch si no está
      return response || fetch(event.request);
    })
  );
});
