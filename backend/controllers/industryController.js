const { Job, Internship, Speaker, Research, Challenge } = require('../models/IndustryEntities');
const { FYP } = require('../models/UniversityEntities');
const User = require('../models/User');
const { uploadToLocal } = require('../utils/fileUpload');


// --- Helper Factory Functions ---

const createOne = (Model) => async (req, res) => {
    try {
        let imageUrl = null;

        // Handle image upload if file is present
        if (req.file) {
            imageUrl = await uploadToLocal(req.file);
        }

        const newItem = new Model({
            ...req.body,
            ...(imageUrl && { imageUrl }), // Add imageUrl only if it exists
            createdBy: req.user._id // from authMiddleware
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

        // Simple search by title if provided
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

        // Check ownership or admin
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
        const universityFYPs = await FYP.countDocuments();
        const totalPartners = await User.countDocuments({ role: 'university' });
        const allChallenges = await Challenge.find({}, 'fundingAmount');
        const activeResearch = await Research.countDocuments();

        const totalFunding = allChallenges.reduce((sum, ch) => sum + (ch.fundingAmount || 0), 0);
        const fundingStr = totalFunding >= 1000000
            ? `${(totalFunding / 1000000).toFixed(1)}M`
            : `${(totalFunding / 1000).toFixed(1)}K`;

        // My Postings count (Jobs + Internships)
        const myJobs = await Job.countDocuments({ createdBy: req.user._id });
        const myInternships = await Internship.countDocuments({ createdBy: req.user._id });
        const myPostings = myJobs + myInternships;

        res.json({
            success: true,
            data: {
                universityFYPs,
                totalPartners,
                activeResearch,
                myPostings,
                funding: `PKR ${fundingStr}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Exports ---

exports.getStats = getStats;

// Jobs
exports.createJob = createOne(Job);
exports.getJobs = getAll(Job);
exports.getJob = getOne(Job);
exports.deleteJob = deleteOne(Job);

// Internships
exports.createInternship = createOne(Internship);
exports.getInternships = getAll(Internship);
exports.getInternship = getOne(Internship);
exports.deleteInternship = deleteOne(Internship);

// Speakers
exports.createSpeaker = createOne(Speaker);
exports.getSpeakers = getAll(Speaker);
exports.getSpeaker = getOne(Speaker);
exports.deleteSpeaker = deleteOne(Speaker);

// Research
exports.createResearch = createOne(Research);
exports.getAllResearch = getAll(Research);
exports.getResearch = getOne(Research);
exports.deleteResearch = deleteOne(Research);

// Challenges
exports.createChallenge = createOne(Challenge);
exports.getChallenges = getAll(Challenge);
exports.getChallenge = getOne(Challenge);
exports.deleteChallenge = deleteOne(Challenge);
