const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://bscs22f46_db_user:junaid123@cluster0.ckebn1a.mongodb.net/';
let mongoClient = null;
let mongoDB = null;

async function connectMongoDB() {
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      mongoDB = mongoClient.db(); // Uses default database from URI
      console.log('✅ MongoDB Connected');
    }
    return mongoDB;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return null;
  }
}

function getMongoDB() {
  if (!mongoDB) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return mongoDB;
}

async function testMongoDB() {
  try {
    const db = await connectMongoDB();
    await db.command({ ping: 1 });
    
    const collections = await db.listCollections().toArray();
    
    return {
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      collections: collections.map(col => col.name)
    };
  } catch (error) {
    return {
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    };
  }
}

module.exports = { connectMongoDB, getMongoDB, testMongoDB };