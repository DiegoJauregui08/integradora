// js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {

  // --- Gráfica de consumo en tiempo real ---
  const realtimeCtx = document.getElementById("realtimeChart").getContext("2d");
  new Chart(realtimeCtx, {
    type: "line",
    data: {
      labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00"],
      datasets: [{
        label: "Consumo (kWh)",
        data: [120, 135, 160, 180, 150, 170, 140],
        borderColor: "#005fa3",
        backgroundColor: "rgba(0,95,163,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#003366"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // --- Gráfica de historial por trayecto ---
  const historyCtx = document.getElementById("historyChart").getContext("2d");
  new Chart(historyCtx, {
    type: "bar",
    data: {
      labels: ["Trayecto 1", "Trayecto 2", "Trayecto 3", "Trayecto 4", "Trayecto 5"],
      datasets: [{
        label: "Consumo total (kWh)",
        data: [520, 480, 610, 550, 590],
        backgroundColor: [
          "#003366",
          "#005fa3",
          "#0074d9",
          "#3399ff",
          "#66b3ff"
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

});
