const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['industry', 'university', 'admin', 'student'],
        required: true
    },
    profile: {
        name: { type: String, required: true }, // University Name or Company Name or Student Name
        description: { type: String }, // Bio or About Us
        logoUrl: { type: String }, // Firebase Storage URL
        website: { type: String },
        location: { type: String },
        contactEmail: { type: String },
        contactPhone: { type: String },
        // Specific fields can be added here as mixed types or separate subdocs if needed
    },
    isVerified: {
        type: Boolean,
        default: false // Requires Admin approval
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
