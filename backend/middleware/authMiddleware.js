const { admin } = require('../config/firebase');
const User = require('../models/User');

// Middleware to verify Firebase Token
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Fetch user from Firestore
        const user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
            console.log(`⚠️ AuthMiddleware: No Firestore profile for UID: ${decodedToken.uid} (${decodedToken.email})`);
        } else {
            // console.log(`✅ AuthMiddleware: Found user ${user.email}`);
        }

        req.firebaseUid = decodedToken.uid;
        req.email = decodedToken.email;
        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
    }
};

// Middleware to restrict access based on role
// Usage: checkRole(['admin', 'industry'])
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. User profile not found. Please complete registration.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };
