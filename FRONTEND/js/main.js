document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      const data = await response.json();
      alert("✅ Login exitoso");
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor");
    }
  });
});
