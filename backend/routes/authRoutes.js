const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Create a new user profile in MongoDB (after Firebase Signup)
// @access  Private (Valid Firebase Token required)
router.post('/register', verifyToken, async (req, res) => {
    const { role, profile } = req.body;

    if (!role || !profile || !profile.name) {
        return res.status(400).json({ success: false, message: 'Please provide role and profile details.' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ firebaseUid: req.firebaseUid });
        if (user) {
            return res.status(400).json({ success: false, message: 'User profile already exists.' });
        }

        // Check for Super Admin
        let validRole = role;
        let validVerified = role === 'student' ? true : false;

        const adminEmail = process.env.ADMIN_EMAIL || 'bscs22f46@namal.edu.pk';
        if (req.email === adminEmail) {
            validRole = 'admin';
            validVerified = true;
            console.log(`Creating Super Admin User: ${req.email}`);
        }

        user = new User({
            firebaseUid: req.firebaseUid,
            email: req.email,
            role: validRole,
            profile,
            isVerified: validVerified
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User profile created successfully',
            user
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, (req, res) => {
    // console.log('GET /me hit. User found:', req.user ? req.user.email : 'No user'); // Debug
    if (!req.user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
    }
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;
