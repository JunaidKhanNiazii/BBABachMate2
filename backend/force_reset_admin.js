const { admin, firestore } = require('./config/firebase');

async function forceResetAdmin() {
    const email = 'bscs22f46@namal.edu.pk';
    const password = 'junaid123';

    console.log(`🧨 Force Resetting Admin: ${email}...`);

    try {
        // 1. Delete user if exists
        try {
            const user = await admin.auth().getUserByEmail(email);
            await admin.auth().deleteUser(user.uid);
            console.log('🗑️ Deleted existing Auth user.');

            // Also delete from Firestore
            await firestore.collection('users').doc(user.uid).delete();
            console.log('🗑️ Deleted existing Firestore profile.');
        } catch (e) {
            console.log('ℹ️ User did not exist in Auth, proceeding to create.');
        }

        // 2. Create fresh Auth user
        const newUser = await admin.auth().createUser({
            email,
            password,
            emailVerified: true,
            displayName: 'System Super Admin'
        });
        console.log(`✅ Fresh Auth user created. UID: ${newUser.uid}`);

        // 3. Create fresh Firestore profile
        const profile = {
            firebaseUid: newUser.uid,
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

        await firestore.collection('users').doc(newUser.uid).set(profile);
        console.log('✅ Fresh Firestore profile created.');

        console.log('\n🌟 FORCE RESET COMPLETE!');
        console.log('-----------------------------------');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        console.log('Please try logging in NOW.');

    } catch (err) {
        console.error('❌ Reset failed:', err.message);
    } finally {
        process.exit(0);
    }
}

forceResetAdmin();
