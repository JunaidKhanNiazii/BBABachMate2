const { firestore } = require('./config/firebase');

async function deleteCollection(collectionPath, batchSize) {
    const collectionRef = firestore.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}

async function wipeAll() {
    const collections = [
        'users', 'jobs', 'internships', 'speakers', 'research', 'challenges',
        'fyps', 'projects', 'courses', 'trainings', 'collaborations', 'inquiries'
    ];

    console.log('🧹 Wiping all collections...');

    for (const collection of collections) {
        try {
            await deleteCollection(collection, 50);
            console.log(`✅ Cleared: ${collection}`);
        } catch (error) {
            console.error(`❌ Error clearing ${collection}:`, error.message);
        }
    }

    console.log('\n✨ Database is now clean!');
    process.exit(0);
}

wipeAll();
