const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://bscs22f46_db_user:junaid123@cluster0.ckebn1a.mongodb.net/';

const connectMongoDB = async () => {
  try {
    // Mongoose 6+ default options are usually sufficient, but explicit is fine if needed
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected (Mongoose)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectMongoDB };