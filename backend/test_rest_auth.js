const axios = require('axios');
require('dotenv').config();

async function testSignIn() {
    const email = 'bscs22f46@namal.edu.pk';
    const password = 'junaid123';
    const apiKey = 'AIzaSyAAleu1EqoIgYSOjQ0iMSI9bHRF57o0XcQ'; // From user's error log

    console.log(`🧪 Testing REST Sign-In for ${email}...`);

    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        const response = await axios.post(url, {
            email,
            password,
            returnSecureToken: true
        });

        console.log('✅ REST API Login SUCCESS!');
        console.log('User ID:', response.data.localId);
    } catch (error) {
        if (error.response) {
            console.error('❌ REST API Login FAILED:', error.response.data.error.message);
            console.error('Full Error:', JSON.stringify(error.response.data.error, null, 2));
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

testSignIn();
