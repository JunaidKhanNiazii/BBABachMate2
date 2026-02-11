const { firestore } = require('./config/firebase');

async function checkUsers() {
    console.log('🔍 Checking users in Firestore...');
    const snapshot = await firestore.collection('users').get();

    if (snapshot.empty) {
        console.log('❌ No users found in "users" collection.');
        return;
    }

    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- ID: ${doc.id} | Email: ${data.email} | Role: ${data.role} | Name: ${data.profile?.name}`);
    });
}

checkUsers().then(() => process.exit(0));
