require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/auth.routes');
const urlRoutes = require('./src/routes/url.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const redirectRoutes = require('./src/routes/redirect.routes');
const { errorMiddleware } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Logging ──────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));

// ─── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://your-app.vercel.app', // update after deploy
];
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ─── Body Parsing ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── Redirect Route (must be LAST before error handler) ──────
// Registered after API routes to prevent clashes with /api/* paths
app.use('/', redirectRoutes);

// ─── 404 Fallback ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
