// service-worker.js
const CACHE_NAME = "titanic-energy-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/login.html",
  "/home.html",
  "/dashboard.html",
  "/css/styles.css",
  "/js/home.js",
  "/js/login.js",
  "/js/dashboard.js",
  "/js/register-sw.js",
  "/manifest.json",
  "/images/logo.png"
];

//  INSTALACIÓN: cachear archivos del App Shell
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando y cacheando recursos...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

//  ACTIVACIÓN: limpiar caches antiguos
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// ✅ INTERCEPCIÓN DE SOLICITUDES
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Evitar cachear peticiones API
  if (request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Si existe en caché → úsalo
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no existe → busca en red y guarda dinámicamente
      return fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() =>
          // Si falla (offline), intenta devolver el index.html o una respuesta por defecto
          caches.match("/index.html")
        );
    })
  );
});
