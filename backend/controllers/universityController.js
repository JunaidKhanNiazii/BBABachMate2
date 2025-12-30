const { FYP, Project, Course, Training, Collaboration } = require('../models/UniversityEntities');
const { Job, Internship } = require('../models/IndustryEntities');
const User = require('../models/User');
const { uploadToLocal } = require('../utils/fileUpload');


// --- Helper Factory Functions (Same as Industry) ---

const createOne = (Model) => async (req, res) => {
    try {
        let imageUrl = null;

        // Handle image upload if file is present
        if (req.file) {
            imageUrl = await uploadToLocal(req.file);
        }

        const newItem = new Model({
            ...req.body,
            ...(imageUrl && { imageUrl }),
            createdBy: req.user._id
        });
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAll = (Model) => async (req, res) => {
    try {
        const { search, mine } = req.query;
        let query = {};

        // Filter by owner if 'mine' query param is present
        if (mine === 'true' && req.user) {
            query.createdBy = req.user._id;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const items = await Model.find(query)
            .populate('createdBy', 'profile.name profile.logoUrl profile.location')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOne = (Model) => async (req, res) => {
    try {
        const item = await Model.findById(req.params.id)
            .populate('createdBy', 'profile.name profile.logoUrl profile.website profile.contactEmail');

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteOne = (Model) => async (req, res) => {
    try {
        const item = await Model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const jobsCount = await Job.countDocuments();
        const internshipsCount = await Internship.countDocuments();
        const opportunities = jobsCount + internshipsCount;

        const partners = await User.countDocuments({ role: 'industry' });
        const collaborations = await Collaboration.countDocuments();
        const fypsPosted = await FYP.countDocuments({ createdBy: req.user._id });

        res.json({
            success: true,
            data: {
                opportunities,
                partners,
                collaborations,
                fypsPosted
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Exports ---

exports.getStats = getStats;

// FYP
exports.createFYP = createOne(FYP);
exports.getFYPs = getAll(FYP);
exports.getFYP = getOne(FYP);
exports.deleteFYP = deleteOne(FYP);

// Projects
exports.createProject = createOne(Project);
exports.getProjects = getAll(Project);
exports.getProject = getOne(Project);
exports.deleteProject = deleteOne(Project);

// Courses
exports.createCourse = createOne(Course);
exports.getCourses = getAll(Course);
exports.getCourse = getOne(Course);
exports.deleteCourse = deleteOne(Course);

// Trainings
exports.createTraining = createOne(Training);
exports.getTrainings = getAll(Training);
exports.getTraining = getOne(Training);
exports.deleteTraining = deleteOne(Training);

// Collaborations
exports.createCollaboration = createOne(Collaboration);
exports.getCollaborations = getAll(Collaboration);
exports.getCollaboration = getOne(Collaboration);
exports.deleteCollaboration = deleteOne(Collaboration);
