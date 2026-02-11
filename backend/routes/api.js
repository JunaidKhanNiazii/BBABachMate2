const express = require('express');
const { firestore } = require('../config/firebase');
const Inquiry = require('../models/Inquiry');

const router = express.Router();
const User = require('../models/User');
const { FYP, Project } = require('../models/UniversityEntities');
const { Challenge } = require('../models/IndustryEntities');

// ========== PUBLIC STATS ==========
router.get('/public-stats', async (req, res) => {
  try {
    console.log('--- FETCHING PUBLIC STATS ---');
    const universities = await User.countDocuments({ role: 'university' });
    const industries = await User.countDocuments({ role: 'industry' });
    const fyps = await FYP.countDocuments();
    const projects = await Project.countDocuments();

    // Aggregating real funding
    // Note: BaseModel.find ignores projection currently, returns full docs
    const challenges = await Challenge.find({});
    const totalFunding = challenges.reduce((sum, item) => sum + (item.fundingAmount || 0), 0);

    console.log(`Universities: ${universities}, Industries: ${industries}, FYPs: ${fyps}, Projects: ${projects}, Funding: ${totalFunding}`);

    const formattedFunding = totalFunding >= 1000000
      ? `${(totalFunding / 1000000).toFixed(1)}M`
      : `${(totalFunding / 1000).toFixed(1)}K`;

    res.json({
      success: true,
      data: {
        universities,
        industries,
        projects: fyps + projects,
        funding: `PKR ${formattedFunding}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== INQUIRIES ==========
router.post('/inquiries', async (req, res) => {
  try {
    const { name, email, sector, message } = req.body;

    if (!name || !email || !sector || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      sector,
      message
    });

    await newInquiry.save();

    res.json({
      success: true,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== TEST ENDPOINTS ==========

// Test connection
router.get('/test', async (req, res) => {
  try {
    let firebaseConnected = false;
    let firebaseMessage = '';

    // Test Firebase
    if (firestore) {
      try {
        // Simple Firebase test
        const testRef = firestore.collection('connection_test').doc('ping');
        await testRef.set({
          timestamp: new Date().toISOString(),
          message: 'Connection test'
        });
        firebaseConnected = true;
        firebaseMessage = 'Firebase connected successfully';
      } catch (firebaseError) {
        firebaseMessage = `Firebase error: ${firebaseError.message}`;
      }
    } else {
      firebaseMessage = 'Firebase not initialized';
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      connections: {
        firebase: {
          connected: firebaseConnected,
          message: firebaseMessage,
          project: 'comsat-6fe05'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;