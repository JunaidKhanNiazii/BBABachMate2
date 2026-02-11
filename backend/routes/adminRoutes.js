const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const controller = require('../controllers/adminController');

// All routes require authentication and 'admin' role
router.use(verifyToken, checkRole(['admin']));

router.get('/stats', controller.getGlobalStats);
router.get('/users', controller.getAllUsers);
router.put('/users/:id/verify', controller.verifyUser); // Explicit verify
router.put('/users/:id/toggle-verify', controller.toggleVerification); // Toggle
router.delete('/users/:id', controller.deleteUser);

// Inquiries
// Inquiries
router.get('/inquiries', controller.getAllInquiries);
router.delete('/inquiries/:id', controller.deleteInquiry);

// Content Management
router.get('/content', controller.getContentByType);
router.delete('/content/:id', controller.deleteContent);

module.exports = router;
