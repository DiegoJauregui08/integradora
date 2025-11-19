const API_URL = 'https://titanic-tf6q.onrender.com';
const info = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout');

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/api/protected`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok) {
      info.textContent = `Bienvenido, ${data.user.username}`;
    } else {
      info.textContent = 'No autorizado. Redirigiendo...';
      setTimeout(() => location.href = 'index.html', 800);
    }
  } catch (err) {
    info.textContent = 'Error de conexión';
  }
}

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    // ignore
  } finally {
    location.href = 'index.html';
  }
});

loadProfile();
