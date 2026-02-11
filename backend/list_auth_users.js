const { admin } = require('./config/firebase');

async function listAllUsers() {
    console.log('👥 Listing users in Firebase Auth...');
    try {
        const listUsersResult = await admin.auth().listUsers(10);
        listUsersResult.users.forEach((userRecord) => {
            console.log(`- Email: ${userRecord.email} | UID: ${userRecord.uid} | Created: ${userRecord.metadata.creationTime}`);
        });
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        process.exit(0);
    }
}

listAllUsers();
