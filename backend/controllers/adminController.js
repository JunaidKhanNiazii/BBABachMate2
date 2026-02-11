const User = require('../models/User');
const { Job, Internship, Research, Challenge, Speaker } = require('../models/IndustryEntities');
const { FYP, Project, Course, Training, Collaboration } = require('../models/UniversityEntities');
const Inquiry = require('../models/Inquiry');

exports.getGlobalStats = async (req, res) => {
    try {
        // 1. User Stats
        const totalUsers = await User.countDocuments();
        const industries = await User.countDocuments({ role: 'industry' });
        const universities = await User.countDocuments({ role: 'university' });
        const unverified = await User.countDocuments({ isVerified: false });

        // 2. Content Stats
        const jobs = await Job.countDocuments();
        const internships = await Internship.countDocuments();
        const research = await Research.countDocuments();
        const challenges = await Challenge.countDocuments();
        const speakers = await Speaker.countDocuments();

        const fyps = await FYP.countDocuments();
        const projects = await Project.countDocuments();
        const courses = await Course.countDocuments();
        const trainings = await Training.countDocuments();
        const collaborations = await Collaboration.countDocuments();

        // 3. Financial Oversight (Funding)
        const challengeRecords = await Challenge.find({}, 'fundingAmount');
        const totalFunding = challengeRecords.reduce((sum, c) => sum + (c.fundingAmount || 0), 0);

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    industry: industries,
                    university: universities,
                    unverified: unverified
                },
                content: {
                    industry: {
                        jobs,
                        internships,
                        research,
                        challenges,
                        speakers
                    },
                    university: {
                        fyps,
                        projects,
                        courses,
                        trainings,
                        collaborations
                    }
                },
                financials: {
                    totalFunding
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        res.json({ success: true, message: `User ${user.profile.name} verified successfully`, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle verification status (verify/unverify)
exports.toggleVerification = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.json({
            success: true,
            message: `User verification changed to ${user.isVerified}`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin user via API' });
        }

        await user.deleteOne();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Inquiry Management
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteInquiry = async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Helper for Content Hub ---
const getModelByType = (type) => {
    switch (type) {
        case 'industry/jobs': return Job;
        case 'industry/internships': return Internship;
        case 'industry/research': return Research;
        case 'industry/challenges': return Challenge;
        case 'industry/speakers': return Speaker;
        case 'university/fyps': return FYP;
        case 'university/projects': return Project;
        case 'university/courses': return Course;
        case 'university/trainings': return Training;
        case 'university/collaborations': return Collaboration;
        default: return null;
    }
};

exports.getContentByType = async (req, res) => {
    try {
        const { type } = req.query;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid content type' });
        }

        const content = await Model.find()
            .populate('createdBy', 'profile.name email role') // Populate creator info if available
            .sort({ createdAt: -1 });

        res.json({ success: true, data: content });
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { type } = req.query;
        const { id } = req.params;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid content type' });
        }

        await Model.findByIdAndDelete(id);
        res.json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
