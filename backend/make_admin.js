const { connectMongoDB } = require('./config/mongodb');
const User = require('./models/User');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
    console.error('Please provide an email address: node make_admin.js <email>');
    process.exit(1);
}

const promoteUser = async () => {
    try {
        await connectMongoDB();
        const user = await User.findOne({ email: emailToPromote });

        if (!user) {
            console.error(`User with email ${emailToPromote} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        user.isVerified = true; // Admins should be verified
        await user.save();

        console.log(`✅ Success! User ${user.profile.name} (${user.email}) is now an Admin.`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
};

promoteUser();
