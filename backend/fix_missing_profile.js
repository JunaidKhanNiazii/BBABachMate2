const { firestore, admin } = require('./config/firebase');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function runFix() {
    console.log('\n--- Fix Missing User Profile ---\n');
    console.log('This script will manually create a Firestore profile for an existing Firebase Auth user.');

    try {
        const email = await askQuestion('Enter the email of the user to fix: ');
        if (!email) throw new Error('Email is required');

        console.log(`\nLooking up user: ${email}...`);
        const userRecord = await admin.auth().getUserByEmail(email);
        console.log(`Found Auth User! UID: ${userRecord.uid}`);

        const name = await askQuestion('Enter Name (e.g., My Company): ');
        const role = await askQuestion('Enter Role (industry/university/admin): ');

        if (!['industry', 'university', 'admin', 'student'].includes(role)) {
            throw new Error('Invalid role. Must be industry, university, admin, or student.');
        }

        const profileData = {
            firebaseUid: userRecord.uid,
            email: userRecord.email,
            role: role,
            profile: {
                name: name || 'Recovered User',
                description: 'Profile created via fix script',
                logoUrl: '',
                location: 'Unknown',
                contactEmail: email
            },
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to Firestore using admin SDK directly to bypass model checks for now (or use model if preferred)
        // Let's use direct firestore call for simplicity in a standalone script
        await firestore.collection('users').doc(userRecord.uid).set(profileData);

        console.log('\n✅ Profile created successfully!');
        console.log('You should now be able to login without 404 errors.');

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error('❌ User not found in Firebase Auth. Please Register a new account instead.');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        rl.close();
        // Force exit because firestore connection might hang
        setTimeout(() => process.exit(0), 1000);
    }
}

runFix();
