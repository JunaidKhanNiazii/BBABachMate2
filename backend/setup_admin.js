const { firestore, admin } = require('./config/firebase');
require('dotenv').config();

async function setupProductionAdmin() {
    const email = 'bscs22f46@namal.edu.pk';
    const password = 'junaid123';
    console.log(`🚀 Setting up Production Admin: ${email}...`);

    try {
        let userRecord;
        try {
            // 1. Check if user exists in Firebase Auth
            userRecord = await admin.auth().getUserByEmail(email);
            console.log(`ℹ️ Auth user already exists. Updating password...`);
            await admin.auth().updateUser(userRecord.uid, { password });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // 2. Create user in Firebase Auth
                userRecord = await admin.auth().createUser({
                    email,
                    password,
                    emailVerified: true,
                    displayName: 'System Super Admin'
                });
                console.log(`✅ Auth user created successfully.`);
            } else {
                throw error;
            }
        }

        const uid = userRecord.uid;

        // 3. Create/Reset Firestore Profile
        const adminProfile = {
            firebaseUid: uid,
            email: email,
            role: 'admin',
            profile: {
                name: 'System Super Admin',
                description: 'Global administrator for BBABachmate Platform.',
                location: 'Main Office',
                website: 'https://bachmate.com',
                designation: 'CTO / Platform Owner',
                contactNumber: 'N/A'
            },
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await firestore.collection('users').doc(uid).set(adminProfile);

        console.log('\n🌟 SETUP COMPLETE!');
        console.log('-----------------------------------');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('Role: Global Admin');
        console.log('-----------------------------------');
        console.log('You can now log in to the website.');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

setupProductionAdmin();
