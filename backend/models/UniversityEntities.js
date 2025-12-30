const mongoose = require('mongoose');

// Base schema fields shared by most university entities
const baseUniversitySchema = {
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// 1. FYP (Final Year Project) Model
const fypSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String }, // e.g., AI, Web, IoT
    technologies: [String],
    supervisor: { type: String },
    members: [String], // Student names
    status: { type: String, enum: ['Proposed', 'Ongoing', 'Completed'], default: 'Ongoing' },
    imageUrl: { type: String }, // Project image or poster
    ...baseUniversitySchema
});

// 2. Project Model (General Semester Projects)
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    link: { type: String }, // GitHub or Demo
    imageUrl: { type: String }, // Project screenshot or logo
    ...baseUniversitySchema
});

// 3. Course Model
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String },
    description: { type: String },
    syllabus: { type: String }, // Link or text
    credits: { type: Number },
    ...baseUniversitySchema
});

// 4. Training / Workshop Model
const trainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String },
    date: { type: Date },
    duration: { type: String },
    fee: {
        amount: Number,
        currency: { type: String, default: 'PKR' },
        isFree: { type: Boolean, default: false }
    },
    imageUrl: { type: String }, // Training poster or instructor photo
    ...baseUniversitySchema
});

// 5. Collaboration Model
const collaborationSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Research Partnership with Industries"
    purpose: { type: String, required: true },
    requirements: { type: String },
    contactPerson: { type: String },
    ...baseUniversitySchema
});

module.exports = {
    FYP: mongoose.model('FYP', fypSchema),
    Project: mongoose.model('Project', projectSchema),
    Course: mongoose.model('Course', courseSchema),
    Training: mongoose.model('Training', trainingSchema),
    Collaboration: mongoose.model('Collaboration', collaborationSchema)
};
