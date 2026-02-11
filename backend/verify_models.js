const { firestore } = require('./config/firebase');
const User = require('./models/User');
const { Job } = require('./models/IndustryEntities');
const { FYP } = require('./models/UniversityEntities');

const runTest = async () => {
    console.log('--- STARTING FIRESTORE MODEL TEST ---');

    try {
        // 1. Create a Test User (Simulate Auth/Register)
        const testUid = `test_user_${Date.now()}`;
        console.log(`\n1. Creating Test User: ${testUid}`);

        const user = new User({
            firebaseUid: testUid,
            email: `test_${Date.now()}@example.com`,
            role: 'industry',
            profile: {
                name: 'Test Industry Corp',
                location: 'Cloud City'
            },
            isVerified: true
        });

        await user.save();
        console.log('✅ User saved successfully.');

        // 2. Verify User Retrieval
        const fetchedUser = await User.findById(testUid);
        if (fetchedUser && fetchedUser.email === user.email) {
            console.log('✅ User retrieved successfully:', fetchedUser.profile.name);
        } else {
            throw new Error('User retrieval failed');
        }

        // 3. Create Industry Entity (Job) linked to User
        console.log('\n2. Creating Job linked to User...');
        const job = new Job({
            title: 'Senior Firebase Developer',
            description: 'Must know NoSQL',
            createdBy: testUid, // Link via ID
            salaryRange: { min: 100000, max: 200000 }
        });

        await job.save();
        console.log(`✅ Job saved with ID: ${job._id}`);

        // 4. Retrieve Job and Populate User
        console.log('\n3. Retrieving Job with Population...');
        // Note: Our BaseModel.find returns a QueryBuilder. 
        // We use .where and .populate and await directly.
        // DO NOT CHAIN .then(...) unless you return a promise.
        const jobs = await Job.find({ _id: job._id })
            .populate('createdBy');

        if (jobs && jobs.length > 0) {
            const fetchedJob = jobs[0];
            console.log('✅ Job retrieved.');
            if (fetchedJob.createdBy && fetchedJob.createdBy.profile) {
                console.log('✅ Population Successful! Creator Name:', fetchedJob.createdBy.profile.name);
            } else {
                console.log('❌ Population Failed. createdBy:', fetchedJob.createdBy);
            }
        } else {
            throw new Error('Job not found');
        }

        // 5. Create University Entity (FYP)
        console.log('\n4. Creating FYP...');
        const fyp = new FYP({
            title: 'AI Based Migration Tool',
            description: 'Migrates Mongo to Firebase',
            createdBy: testUid,
            domain: 'CS'
        });
        await fyp.save();
        console.log('✅ FYP saved.');

        // 6. Cleanup
        console.log('\n5. Cleaning up test data...');
        await job.deleteOne();
        await fyp.deleteOne();
        await user.deleteOne();
        console.log('✅ Cleanup complete.');

    } catch (error) {
        console.error('❌ TEST FAILED:', error);
    }
};

runTest();
