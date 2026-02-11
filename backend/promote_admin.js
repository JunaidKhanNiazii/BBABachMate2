const { firestore, admin } = require('./config/firebase');
require('dotenv').config();

async function promoteAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'bscs22f46@namal.edu.pk';
    console.log(`🚀 Promoting ${adminEmail} to Global Admin...`);

    try {
        // 1. Find user in Firebase Auth
        const userRecord = await admin.auth().getUserByEmail(adminEmail);
        const uid = userRecord.uid;
        console.log(`✅ Found Auth User! UID: ${uid}`);

        // 2. Create/Update Firestore Profile
        const adminData = {
            firebaseUid: uid,
            email: adminEmail,
            role: 'admin',
            profile: {
                name: 'System Super Admin',
                description: 'Root access to BBABachmate Platform',
                location: 'System',
                website: 'https://admin.bachmate.com'
            },
            isVerified: true,
            updatedAt: new Date().toISOString()
        };

        // Use .set with merge: true to avoid overwriting existing profile data if any
        await firestore.collection('users').doc(uid).set(adminData, { merge: true });

        console.log('\n🌟 SUCCESS: User is now a Super Admin in Firestore!');
        console.log('You can now login with this email to access the Admin Dashboard.');

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error(`\n❌ ERROR: User "${adminEmail}" not found in Firebase Auth.`);
            console.error('Please sign up with this email on the website first, or create the user in Firebase Console.');
        } else {
            console.error('\n❌ ERROR:', error.message);
        }
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

promoteAdmin();
