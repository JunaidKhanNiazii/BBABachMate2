const { connectMongoDB } = require('./config/mongodb');
const User = require('./models/User');

const verifyUsers = async () => {
    try {
        await connectMongoDB();
        console.log('--- Checking Users ---');
        const users = await User.find({});

        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | Verified: ${u.isVerified}`);
        });

        const admins = users.filter(u => u.role === 'admin');
        if (admins.length === 0) {
            console.log('❌ No Admin found!');
        } else {
            console.log(`✅ Found ${admins.length} Admin(s).`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
};

verifyUsers();
