const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/mongodb');
const apiRoutes = require('./routes/api');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Homepage
app.get('/', (req, res) => {
  res.json({
    message: '🎓 BBABachmate Backend API',
    version: '1.0.0',
    endpoints: {
      test: 'GET /api/test',
      addToMongo: 'POST /api/mongo/students',
      getFromMongo: 'GET /api/mongo/students',
      addToFirebase: 'POST /api/firebase/students',
      getFromFirebase: 'GET /api/firebase/students',
      addToBoth: 'POST /api/both/students'
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler - FIXED THIS LINE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start Server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    app.listen(port, () => {
      console.log(`
====================================
🚀 Server running on: http://localhost:${port}
📡 MongoDB: Connected
🔥 Firebase: ${require('./config/firebase').firestore ? 'Connected' : 'Not connected'}
====================================
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();