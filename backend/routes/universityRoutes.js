const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const controller = require('../controllers/universityController');
const { upload } = require('../utils/fileUpload');

// Roles allowed to create/modify university content
const UNIVERSITY_ROLES = ['university', 'admin'];

router.get('/stats', verifyToken, controller.getStats);

// --- FYPs ---
router.post('/fyps', verifyToken, checkRole(UNIVERSITY_ROLES), upload.single('image'), controller.createFYP);
router.get('/fyps', verifyToken, controller.getFYPs);
router.get('/fyps/:id', controller.getFYP);
router.delete('/fyps/:id', verifyToken, checkRole(UNIVERSITY_ROLES), controller.deleteFYP);

// --- PROJECTS ---
router.post('/projects', verifyToken, checkRole(UNIVERSITY_ROLES), upload.single('image'), controller.createProject);
router.get('/projects', verifyToken, controller.getProjects);
router.get('/projects/:id', controller.getProject);
router.delete('/projects/:id', verifyToken, checkRole(UNIVERSITY_ROLES), controller.deleteProject);

// --- COURSES ---
router.post('/courses', verifyToken, checkRole(UNIVERSITY_ROLES), upload.single('image'), controller.createCourse);
router.get('/courses', verifyToken, controller.getCourses);
router.get('/courses/:id', controller.getCourse);
router.delete('/courses/:id', verifyToken, checkRole(UNIVERSITY_ROLES), controller.deleteCourse);

// --- TRAININGS ---
router.post('/trainings', verifyToken, checkRole(UNIVERSITY_ROLES), upload.single('image'), controller.createTraining);
router.get('/trainings', verifyToken, controller.getTrainings);
router.get('/trainings/:id', controller.getTraining);
router.delete('/trainings/:id', verifyToken, checkRole(UNIVERSITY_ROLES), controller.deleteTraining);

// --- COLLABORATIONS ---
router.post('/collaborations', verifyToken, checkRole(UNIVERSITY_ROLES), upload.single('image'), controller.createCollaboration);
router.get('/collaborations', verifyToken, controller.getCollaborations);
router.get('/collaborations/:id', controller.getCollaboration);
router.delete('/collaborations/:id', verifyToken, checkRole(UNIVERSITY_ROLES), controller.deleteCollaboration);

module.exports = router;
