const { firestore, admin } = require('./config/firebase');
const User = require('./models/User');
const { Job, Internship, Challenge } = require('./models/IndustryEntities');
const { FYP, Project, Course } = require('./models/UniversityEntities');

const seedData = async () => {
    console.log('🌱 Starting Database Seeding...');

    try {
        // 1. Create Users
        const users = [
            {
                email: 'admin@bachmate.com',
                role: 'admin',
                name: 'System Admin',
                uid: 'seed_admin_001'
            },
            {
                email: 'google@industry.com',
                role: 'industry',
                name: 'Google Cloud',
                uid: 'seed_industry_001'
            },
            {
                email: 'lums@university.edu',
                role: 'university',
                name: 'LUMS University',
                uid: 'seed_university_001'
            }
        ];

        for (const u of users) {
            const userDoc = new User({
                firebaseUid: u.uid,
                email: u.email,
                role: u.role,
                profile: {
                    name: u.name,
                    description: 'Seeded account for testing',
                    location: 'Lahore, Pakistan',
                    website: `https://${u.role}.com`
                },
                isVerified: true
            });
            await userDoc.save();
            console.log(`✅ Created User: ${u.name}`);
        }

        // 2. Create Content (Jobs)
        const job = new Job({
            title: 'Senior React Developer',
            description: 'We are looking for an expert in React and Firebase.',
            createdBy: 'seed_industry_001',
            type: 'Remote',
            salaryRange: { min: 150000, max: 300000 },
            requirements: ['React', 'Node.js', 'Firebase'],
            location: 'Remote'
        });
        await job.save();
        console.log('✅ Created Job: Senior React Developer');

        // 3. Create Content (FYP)
        const fyp = new FYP({
            title: 'AI Driven Recruitment System',
            description: 'Using LLMs to match resumes with job descriptions.',
            createdBy: 'seed_university_001',
            domain: 'Artificial Intelligence',
            status: 'Open',
            technologies: ['Python', 'LangChain', 'Next.js']
        });
        await fyp.save();
        console.log('✅ Created FYP: AI Recruitment System');

        // 4. Create Challenge
        const challenge = new Challenge({
            title: 'Sustainable Energy Hackathon',
            description: 'Solve the energy crisis with code.',
            createdBy: 'seed_industry_001',
            deadline: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days
            prize: 'PKR 500,000'
        });
        await challenge.save();
        console.log('✅ Created Challenge: Sustainable Energy Hackathon');

        console.log('\n✨ Seeding Complete! The website should now be populated.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedData();
