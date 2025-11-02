// FRONTEND/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const voltajeEl = document.getElementById('voltaje-actual');
  const fechaEl = document.getElementById('voltaje-fecha');
  const tablaEl = document.getElementById('tabla-historial');
  const recsEl = document.getElementById('recomendaciones');
  const ctx = document.getElementById('voltajeChart').getContext('2d');
  let chart = null;

  // Helper: formatea fecha ISO a local
  function formatDate(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleString();
  }

  // Muestra recomendación según valor
  function getRecomendacion(valor) {
    if (valor === null || valor === undefined) return "No hay datos para generar recomendaciones.";
    if (valor > 240) return "⚠️ Voltaje alto — revisa picos o sobrecargas, revisa reguladores y baterías.";
    if (valor < 210) return "⚠️ Voltaje bajo — posible caída de suministro o baterías descargadas. Revisa conexiones.";
    return "✅ Voltaje estable — dentro del rango óptimo.";
  }

  async function cargarLatest() {
    try {
      const res = await fetch('/api/voltage/latest');
      if (!res.ok) {
        console.warn('No hay dato último', res.status);
        voltajeEl.innerText = '-- V';
        fechaEl.innerText = '';
        return null;
      }
      const data = await res.json();
      // muestra
      const valor = data.voltage ?? data.voltaje ?? data.value ?? null;
      const ts = data.timestamp ?? data.createdAt ?? null;
      voltajeEl.innerText = (valor !== null && valor !== undefined) ? `${valor} V` : '-- V';
      fechaEl.innerText = ts ? `Última lectura: ${formatDate(ts)}` : '';
      recsEl.innerText = getRecomendacion(valor);
      return data;
    } catch (err) {
      console.error('Error cargarLatest', err);
      return null;
    }
  }

  async function cargarHistory(limit = 10) {
    try {
      const res = await fetch(`/api/voltage/history?limit=${limit}`);
      if (!res.ok) return [];
      const arr = await res.json();
      // arr viene en orden descendente (más reciente primero) por cómo definimos la ruta
      // Para la tabla queremos mostrar descendente; para la gráfica preferimos orden ascendente por tiempo
      // tabla
      tablaEl.innerHTML = '';
      arr.forEach(item => {
        const valor = item.voltage ?? item.voltaje ?? item.value ?? '--';
        const ts = item.timestamp ?? item.createdAt ?? null;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${formatDate(ts)}</td><td>${valor}</td>`;
        tablaEl.appendChild(tr);
      });

      // gráfica: datos en orden ascendente
      const arrAsc = [...arr].reverse();
      const labels = arrAsc.map(i => formatDate(i.timestamp ?? i.createdAt ?? ''));
      const dataVals = arrAsc.map(i => i.voltage ?? i.voltaje ?? i.value ?? 0);

      if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = dataVals;
        chart.update();
      } else {
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Voltaje (V)',
              data: dataVals,
              borderColor: '#005fa3',
              backgroundColor: 'rgba(0,95,163,0.12)',
              fill: true,
              tension: 0.25,
            }]
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: false } }
          }
        });
      }

      return arr;
    } catch (err) {
      console.error('Error cargarHistory', err);
      return [];
    }
  }

  // Inicial
  async function init() {
    await cargarLatest();
    await cargarHistory(10);
    // refrescar periódicamente
    setInterval(async () => {
      await cargarLatest();
      await cargarHistory(10);
    }, 5000); // cada 5s — ajusta si quieres más/menos
  }

  init();
});
