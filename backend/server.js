// server.js - Full Backend Logic
const express = require('express');
const cors = require('cors');
// Connect to databases
const { firestore } = require('./config/firebase');
// MongoDB connection removed

// Route Imports
const authRoutes = require('./routes/authRoutes');
const industryRoutes = require('./routes/industryRoutes');
const universityRoutes = require('./routes/universityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/api');

const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const port = 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // For local dev compatibility
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression()); // Gzip all responses
app.use(morgan('dev')); // Fast logging
app.use(cors());
app.use(express.json());

// Serve uploaded files statically with caching
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  immutable: true
}));

// Connect to databases
// MongoDB connection removed
// connectMongoDB();

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: '✅ BBABachmate Backend Server Running (Firebase Only)',
    timestamp: new Date().toISOString(),
    status: 'active',
    version: '2.1.0 (Firebase Migration)'
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

// Start Server
app.listen(port, () => {
  console.log(`
====================================
🚀 Server running: http://localhost:${port}
🔥 Firebase: ${firestore ? 'Connected' : 'Failed'}
📌 API Routes:
   - /api/auth
   - /api/industry
   - /api/university
   - /api/admin
====================================
  `);
});

module.exports = app;