// public/js/js/register-sw.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(reg => console.log('[SW] Service Worker registrado:', reg.scope))
      .catch(err => console.error('[SW] Error al registrar el Service Worker:', err));
  });
}
