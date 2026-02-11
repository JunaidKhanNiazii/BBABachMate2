// Environment configuration validation
const config = {
  // Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  },

  // Admin
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL
  },

  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'BBA BachMate',
    env: import.meta.env.VITE_APP_ENV || 'development'
  }
};

// Validate required configuration
const validateConfig = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all Firebase configuration is set.'
    );
  }

  // Validate Firebase config format
  if (!config.firebase.apiKey.startsWith('AIzaSy')) {
    console.warn('Warning: Firebase API key format looks incorrect');
  }

  if (!config.firebase.projectId || config.firebase.projectId.includes('your_project')) {
    throw new Error('Firebase project ID is not properly configured');
  }
};

// Validate on import
validateConfig();

export default config;