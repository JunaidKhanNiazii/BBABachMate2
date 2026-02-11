const http = require('http');

const checkUrl = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const verify = async () => {
  console.log('Verifying Backend Server...');
  try {
    // Check Root
    const rootRes = await checkUrl('http://localhost:5000/');
    console.log(`[ROOT] Status: ${rootRes.statusCode}`);
    if (rootRes.statusCode === 200) {
      console.log('✅ Root endpoint accessible');
    } else {
      console.error('❌ Root endpoint failed');
    }

    // Check API 404
    const apiRes = await checkUrl('http://localhost:5000/api/nonexistent');
    console.log(`[API 404] Status: ${apiRes.statusCode}`);
    if (apiRes.statusCode === 404) {
      console.log('✅ 404 handler working');
    } else {
      console.error('❌ 404 handler failed');
    }

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
};

// Wait for server to start potentiall
setTimeout(verify, 2000);
