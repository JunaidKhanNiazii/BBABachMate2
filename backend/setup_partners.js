const { admin, firestore } = require('./config/firebase');

async function setupPartners() {
    const partners = [
        { email: 'netsol@gmail.com', role: 'industry', name: 'Netsol Technologies' },
        { email: 'mianwali@gmail.com', role: 'university', name: 'University of Mianwali' },
        { email: 'namal@gmail.com', role: 'university', name: 'Namal University' }
    ];
    const password = 'junaid123';

    console.log('🏗️ Setting up Partner Test Accounts...');

    for (const partner of partners) {
        console.log(`\n🔹 Processing ${partner.email}...`);
        try {
            // 1. Get/Update Auth User
            let userRecord;
            try {
                userRecord = await admin.auth().getUserByEmail(partner.email);
                await admin.auth().updateUser(userRecord.uid, { password });
                console.log(`  - Auth: Password reset to ${password}`);
            } catch (e) {
                if (e.code === 'auth/user-not-found') {
                    userRecord = await admin.auth().createUser({
                        email: partner.email,
                        password: password,
                        emailVerified: true,
                        displayName: partner.name
                    });
                    console.log(`  - Auth: NEW user created with password ${password}`);
                } else throw e;
            }

            // 2. Sync/Create Firestore Profile
            const profile = {
                firebaseUid: userRecord.uid,
                email: partner.email,
                role: partner.role,
                profile: {
                    name: partner.name,
                    description: partner.role === 'industry'
                        ? 'A leading software company providing enterprise solutions.'
                        : 'A premier educational institution fostering innovation.',
                    location: 'Pakistan',
                    website: `https://www.${partner.email.split('@')[0]}.com`,
                    contactEmail: partner.email
                },
                isVerified: true,
                updatedAt: new Date().toISOString()
            };

            await firestore.collection('users').doc(userRecord.uid).set(profile, { merge: true });
            console.log(`  - Firestore: Profile synced as ${partner.role}`);

        } catch (err) {
            console.error(`  ❌ Error for ${partner.email}:`, err.message);
        }
    }

    console.log('\n🌟 PARTNER SETUP COMPLETE!');
    console.log('-----------------------------------');
    console.log('All accounts below now use password: junaid123');
    partners.forEach(p => console.log(`- ${p.email} (${p.role})`));
    console.log('-----------------------------------');
    process.exit(0);
}

setupPartners();
