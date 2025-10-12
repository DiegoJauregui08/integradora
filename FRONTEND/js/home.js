// FRONTEND/js/home.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("goLogin");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/index.html";
  });
});
