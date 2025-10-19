// FRONTEND/js/home.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("goLogin");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/index.html";
    });
  }

  // Registrar Service Worker global
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((reg) => console.log("✅ Service Worker global registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }
});
