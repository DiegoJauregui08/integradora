  require('dotenv').config();
  const express = require('express');
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  const helmet = require('helmet');
  const cors = require('cors');
  const path = require('path');

  const connectDB = require('./config/db');
  const authRoutes = require('./routes/authRoutes');
  const protectedRoutes = require('./routes/protectedRoutes');

  // 🔹 Conexión a la base de datos
  connectDB();

  const app = express();

  // 🛡️ Configurar Helmet con CSP más permisiva para dashboards (Chart.js, CDN, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": [
            "'self'",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://cdn.jsdelivr.net/npm/chart.js"
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net"
          ],
          "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "connect-src": [
            "'self'",
            "http://localhost:3000",
            "http://localhost:5500",
            "https://cdn.jsdelivr.net"
          ],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Middlewares base
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 🔹 Configurar CORS para permitir conexión con el frontend
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );

  // 🔹 Configurar sesiones con MongoDB
  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    })
  );

  // 🟩 Servir archivos estáticos del FRONTEND
  app.use(express.static(path.join(__dirname, "../FRONTEND")));

  // 🔹 Rutas de la API
  app.use('/api/auth', authRoutes);
  app.use('/api/protected', protectedRoutes);
const voltageRoutes = require('./routes/voltageRoutes');
app.use('/api/voltage', voltageRoutes);

  // 🔹 Endpoint de prueba
  app.get('/', (req, res) => res.json({ message: 'Titanic backend OK' }));

  // 🔹 Servir dashboard.html como fallback
  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/dashboard.html'));
  });

  // 🚀 Servidor activo
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
  );
