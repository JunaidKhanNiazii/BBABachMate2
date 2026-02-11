const { admin, firestore } = require('./config/firebase');

async function multiReset() {
    const emails = ['bscs22f46@namal.edu.pk', 'bscs22f6@namal.edu.pk'];
    const password = 'junaid123';

    for (const email of emails) {
        console.log(`🔐 Syncing ${email}...`);
        try {
            const user = await admin.auth().getUserByEmail(email);
            await admin.auth().updateUser(user.uid, { password });

            const profile = {
                firebaseUid: user.uid,
                email: email,
                role: 'admin',
                profile: {
                    name: 'System Super Admin',
                    description: 'Global administrator for BBABachmate Platform.'
                },
                isVerified: true,
                updatedAt: new Date().toISOString()
            };
            await firestore.collection('users').doc(user.uid).set(profile, { merge: true });
            console.log(`✅ ${email} is now a Super Admin with password junaid123`);
        } catch (e) {
            console.log(`ℹ️ skipping ${email} (${e.message})`);
        }
    }
    process.exit(0);
}

multiReset();
