// server.js - Vercel-compatible Serverless Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Connect to databases (Firebase only)
const { firestore } = require('./config/firebase');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const industryRoutes = require('./routes/industryRoutes');
const universityRoutes = require('./routes/universityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('dev'));

// CORS - Allow all origins (including Vercel deployments)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NOTE: /uploads static file serving removed - Vercel has a read-only filesystem.
// File uploads should use Firebase Storage or Cloudinary in production.

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: '✅ BBABachmate Backend Running on Vercel',
    timestamp: new Date().toISOString(),
    status: 'active',
    version: '2.2.0 (Vercel Serverless)'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// IMPORTANT: Do NOT call app.listen() on Vercel - export app instead
// Vercel handles the server lifecycle automatically
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Local server running: http://localhost:${port}`);
    console.log(`🔥 Firebase: ${firestore ? 'Connected' : 'Failed'}`);
  });
}

module.exports = app;