// const axios = require('axios'); // Removed unused import

// Mock a simple content fetch
// Note: This script assumes you have some way to authenticate.
// For quick verification without a full login flow, we might need a workaround or manual test.
// However, since verify_server.js worked, we can try to hit the endpoint.
// BUT, the endpoint is protected by auth middleware.
// So, the most reliable way right now is for the USER to verify manually.
// OR, I can temporarily disable auth for this route to test it (not recommended).
// OR, I can try to mock a login if I knew a valid user.

// Let's rely on manual verification for the content itself, 
// as automating a firebase login flow purely from backend scripts is complex without credentials.

// BUT, I can check if the server restarts correctly with the new code.
// I'll reuse my simple verify_server.js logic but check for the route existence (401 Unauthorized is Good, 404 is Bad).

const http = require('http');

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            resolve(res.statusCode);
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const verify = async () => {
    console.log('Verifying Admin Content Route Existence...');
    try {
        // We expect 401 Unauthorized because we are not sending a token.
        // If we get 404, it means the route is NOT registered.
        const statusCode = await checkUrl('http://localhost:5000/api/admin/content?type=industry/jobs');
        console.log(`[GET /api/admin/content] Status: ${statusCode}`);

        if (statusCode === 401) {
            console.log('✅ Route exists and is protected (401 Unauthorized)');
        } else if (statusCode === 200) {
            console.log('✅ Route exists and is open (Unexpected but working)');
        } else if (statusCode === 404) {
            console.error('❌ Route NOT found (404)');
        } else {
            console.log(`⚠️ Received status: ${statusCode}`);
        }

    } catch (err) {
        console.error('❌ Verification failed:', err.message);
    }
};

setTimeout(verify, 2000);
