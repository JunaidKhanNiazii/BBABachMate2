const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const controller = require('../controllers/industryController');
const { upload } = require('../utils/fileUpload');

// Roles allowed to create/modify industry content
const INDUSTRY_ROLES = ['industry', 'admin'];

router.get('/stats', verifyToken, controller.getStats);

// --- JOBS ---
router.post('/jobs', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createJob);
router.get('/jobs', verifyToken, controller.getJobs);
router.get('/jobs/:id', controller.getJob);
router.delete('/jobs/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteJob);

// --- INTERNSHIPS ---
router.post('/internships', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createInternship);
router.get('/internships', verifyToken, controller.getInternships);
router.get('/internships/:id', controller.getInternship);
router.delete('/internships/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteInternship);

// --- SPEAKERS ---
router.post('/speakers', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createSpeaker);
router.get('/speakers', verifyToken, controller.getSpeakers);
router.get('/speakers/:id', controller.getSpeaker);
router.delete('/speakers/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteSpeaker);

// --- RESEARCH ---
router.post('/research', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createResearch);
router.get('/research', verifyToken, controller.getAllResearch);
router.get('/research/:id', controller.getResearch);
router.delete('/research/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteResearch);

// --- CHALLENGES ---
router.post('/challenges', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createChallenge);
router.get('/challenges', verifyToken, controller.getChallenges);
router.get('/challenges/:id', controller.getChallenge);
router.delete('/challenges/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteChallenge);

// --- COLLABORATIONS ---
router.post('/collaborations', verifyToken, checkRole(INDUSTRY_ROLES), upload.single('image'), controller.createCollaboration);
router.get('/collaborations', verifyToken, controller.getCollaborations);
router.get('/collaborations/:id', controller.getCollaboration);
router.delete('/collaborations/:id', verifyToken, checkRole(INDUSTRY_ROLES), controller.deleteCollaboration);

module.exports = router;
