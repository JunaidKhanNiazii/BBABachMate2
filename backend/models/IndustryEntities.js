const mongoose = require('mongoose');

// Base schema fields shared by most industry entities
const baseIndustrySchema = {
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// 1. Job Model
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'], default: 'Full-time' },
    location: { type: String }, // Remote, On-site, or specific City
    salaryRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'PKR' }
    },
    imageUrl: { type: String }, // Company logo or job image
    ...baseIndustrySchema
});

// 2. Internship Model
const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    duration: { type: String }, // e.g., '3 months'
    stipend: {
        amount: Number,
        currency: { type: String, default: 'PKR' },
        isUnpaid: { type: Boolean, default: false }
    },
    imageUrl: { type: String }, // Company logo or internship image
    ...baseIndustrySchema
});

// 3. Speaker Model
const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String },
    bio: { type: String },
    imageUrl: { type: String }, // Profile picture of speaker
    ...baseIndustrySchema
});

// 4. Research Model
const researchSchema = new mongoose.Schema({
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    publicationDate: { type: Date },
    link: { type: String }, // URL to full paper
    authors: [String],
    ...baseIndustrySchema
});

// 5. Challenge Model
const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    opportunityCategory: { type: String }, // Industry Challenge, Research Topic
    fundingType: { type: String }, // Funded, Non-Funded
    fundingAmount: { type: Number, default: 0 },
    fundingPurpose: { type: String },
    sponsorshipType: { type: String },
    domain: { type: String },
    expectedOutcomes: [String],
    eligibility: { type: String },
    deadline: { type: Date, required: true },
    mode: { type: String },
    prize: { type: String },
    ...baseIndustrySchema
});

module.exports = {
    Job: mongoose.model('Job', jobSchema),
    Internship: mongoose.model('Internship', internshipSchema),
    Speaker: mongoose.model('Speaker', speakerSchema),
    Research: mongoose.model('Research', researchSchema),
    Challenge: mongoose.model('Challenge', challengeSchema)
};
