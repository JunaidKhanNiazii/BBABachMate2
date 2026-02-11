const https = require('https');

function testSignIn() {
    const email = 'bscs22f46@namal.edu.pk';
    const password = 'junaid123';
    // I extracted this key from your browser error log
    const apiKey = 'AIzaSyAAleu1EqoIgYSOjQ0iMSI9bHRF57o0XcQ';

    console.log(`🧪 testing REST Sign-In for ${email}...`);

    const data = JSON.stringify({
        email,
        password,
        returnSecureToken: true
    });

    const options = {
        hostname: 'identitytoolkit.googleapis.com',
        path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            const result = JSON.parse(body);
            if (res.statusCode === 200) {
                console.log('✅ REST API Login SUCCESS!');
                console.log('User ID:', result.localId);
            } else {
                console.error(`❌ REST API Login FAILED (${res.statusCode}):`, result.error.message);
                console.log('Full Error:', JSON.stringify(result.error, null, 2));
            }
            process.exit(0);
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Request Error: ${e.message}`);
        process.exit(1);
    });

    req.write(data);
    req.end();
}

testSignIn();
