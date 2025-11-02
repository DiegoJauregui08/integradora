// BACKEND/routes/voltageRoutes.js
const express = require('express');
const router = express.Router();
const Voltage = require('../models/Voltage'); // asegura que el modelo se llame Voltage y esté en models/Voltage.js

// GET /api/voltage/latest -> devuelve el último registro
router.get('/latest', async (req, res) => {
  try {
    const latest = await Voltage.findOne().sort({ timestamp: -1 }).lean();
    if (!latest) return res.status(404).json({ message: 'No hay datos registrados' });
    res.json(latest);
  } catch (err) {
    console.error('Error /api/voltage/latest', err);
    res.status(500).json({ error: 'Error al obtener el voltaje más reciente' });
  }
});

// GET /api/voltage/history?limit=5 -> devuelve los últimos N registros (por defecto 5)
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);
    const history = await Voltage.find().sort({ timestamp: -1 }).limit(limit).lean();
    res.json(history);
  } catch (err) {
    console.error('Error /api/voltage/history', err);
    res.status(500).json({ error: 'Error al obtener el historial de voltajes' });
  }
});

module.exports = router;
