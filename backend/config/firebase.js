const admin = require('firebase-admin');
require('dotenv').config();

let firestore = null;

try {
  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "comsat-6fe05",
      private_key_id: "92ff05c66e1caae95cd10502a10d636ad01877dd",
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix newlines
      client_email: "firebase-adminsdk-fbsvc@comsat-6fe05.iam.gserviceaccount.com",
      client_id: "101603589572186647448",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40comsat-6fe05.iam.gserviceaccount.com"
    })
  });

  firestore = admin.firestore();
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.log('⚠️  Firebase Admin not initialized (optional)');
  console.log('   Reason:', error.message);
}

module.exports = { admin, firestore };