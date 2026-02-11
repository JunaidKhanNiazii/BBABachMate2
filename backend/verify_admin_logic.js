require('dotenv').config();

const adminEmail = process.env.ADMIN_EMAIL;
const testEmail = 'bscs22f46@namal.edu.pk';
const otherEmail = 'user@example.com';

console.log('--- Verifying Super Admin Logic ---');
console.log(`Loaded ADMIN_EMAIL from env: ${adminEmail}`);

if (!adminEmail) {
    console.error('❌ ADMIN_EMAIL is not set in .env!');
    process.exit(1);
}

if (adminEmail !== testEmail) {
    console.warn(`⚠️ Warning: ADMIN_EMAIL (${adminEmail}) does not match expected default (${testEmail}), but logic will still work for the configured email.`);
}

function simulateRegistration(email) {
    console.log(`\nTesting registration for: ${email}`);

    // Logic copied from authRoutes.js
    let role = 'student'; // Default user selection
    let isVerified = false;

    if (email === adminEmail) {
        role = 'admin';
        isVerified = true;
        console.log('✅ Logic Triggered: User promoted to ADMIN and VERIFIED.');
    } else {
        console.log('ℹ️  Standard registration: User remains STUDENT and UNVERIFIED.');
    }

    return { role, isVerified };
}

simulateRegistration(testEmail);
simulateRegistration(otherEmail);

console.log('\n--- Verification Complete ---');
