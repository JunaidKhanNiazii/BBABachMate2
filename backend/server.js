// server.js - Full Backend Logic
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/mongodb');
const { firestore } = require('./config/firebase');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const industryRoutes = require('./routes/industryRoutes');
const universityRoutes = require('./routes/universityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/api');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Connect to databases
connectMongoDB();

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: '✅ BBABachmate Backend Server Running',
    timestamp: new Date().toISOString(),
    status: 'active',
    version: '2.0.0 (Role-Based Upgrade)'
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
📡 MongoDB: Connected
🔥 Firebase: ${firestore ? 'Connected' : 'Optional'}
📌 API Routes:
   - /api/auth
   - /api/industry
   - /api/university
   - /api/admin
====================================
  `);
});