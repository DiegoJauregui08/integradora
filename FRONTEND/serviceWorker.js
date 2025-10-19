// serviceWorker.js - App Shell para Titanic (FRONTEND)
/* Lista de archivos que forman el "App Shell" de tu dashboard */
const APP_SHELL = [
  "/",
  "/index.html",
  "/home.html",
  "/dashboard.html",
  "/css/styles.css",
  "/js/main.js",
  "/js/home.js",
  "/js/register-sw.js",
  "/js/dashboard.js",
  "/images/logo.jpg",
  "/manifest.json"
];



const CACHE_NAME = "titanic-appshell-v1";

/* Instalación: cachea los archivos del App Shell */
self.addEventListener("install", (event) => {
  console.log("[SW] installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

/* Activación: limpia caches antiguas si existen */
self.addEventListener("activate", (event) => {
  console.log("[SW] activating...");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* Estrategia de fetch:
   - Si la petición es a /api/ -> pasa al network (no cache)
   - Para archivos del App Shell -> cache-first (usamos cache)
   - Para otros recursos -> network-first con fallback a cache
*/
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // No cachear llamadas API (backend)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(req).catch(() => new Response(null, { status: 503 })));
    return;
  }

  // Cache first for app shell resources
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }
      // network-first for others
      return fetch(req)
        .then((networkRes) => {
          // optionally cache dynamic resources (careful with size)
          return networkRes;
        })
        .catch(() => {
          // fallback simple: if HTML page requested, serve cached index
          if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
    })
  );
});
