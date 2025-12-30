const express = require('express');
const { ObjectId } = require('mongodb');
const { getMongoDB } = require('../config/mongodb');
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
    const challenges = await Challenge.find({}, 'fundingAmount');
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

// Test all connections
router.get('/test', async (req, res) => {
  try {
    // Test MongoDB
    const db = getMongoDB();
    await db.command({ ping: 1 });

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
        mongodb: {
          connected: true,
          database: db.databaseName,
          message: 'MongoDB connected successfully'
        },
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

// ========== MONGODB STUDENTS ==========

// Add student to MongoDB
router.post('/mongo/students', async (req, res) => {
  try {
    const { name, rollNumber, semester, email, phone, department } = req.body;

    // Validation
    if (!name || !rollNumber || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Name, rollNumber, and semester are required'
      });
    }

    const db = getMongoDB();
    const collection = db.collection('students');

    const student = {
      name,
      rollNumber,
      semester: parseInt(semester),
      email: email || '',
      phone: phone || '',
      department: department || 'BBA',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(student);

    res.status(201).json({
      success: true,
      message: 'Student saved to MongoDB',
      id: result.insertedId,
      student: { ...student, _id: result.insertedId },
      database: 'mongodb'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MongoDB error',
      error: error.message
    });
  }
});

// Get all students from MongoDB
router.get('/mongo/students', async (req, res) => {
  try {
    const db = getMongoDB();
    const collection = db.collection('students');
    const students = await collection.find({}).sort({ createdAt: -1 }).toArray();

    res.json({
      success: true,
      count: students.length,
      database: 'mongodb',
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MongoDB error',
      error: error.message
    });
  }
});

// Get single student from MongoDB
router.get('/mongo/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const db = getMongoDB();
    const collection = db.collection('students');
    const student = await collection.findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      database: 'mongodb',
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MongoDB error',
      error: error.message
    });
  }
});

// ========== FIREBASE STUDENTS ==========

// Add student to Firebase
router.post('/firebase/students', async (req, res) => {
  try {
    const { name, rollNumber, semester, email, phone, department } = req.body;

    // Validation
    if (!name || !rollNumber || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Name, rollNumber, and semester are required'
      });
    }

    if (!firestore) {
      return res.status(500).json({
        success: false,
        message: 'Firebase not connected'
      });
    }

    const collection = firestore.collection('students');

    // Generate a document ID
    const studentId = `${rollNumber}_${Date.now()}`;
    const docRef = collection.doc(studentId);

    const student = {
      name,
      rollNumber,
      semester: parseInt(semester),
      email: email || '',
      phone: phone || '',
      department: department || 'BBA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: studentId
    };

    await docRef.set(student);

    res.status(201).json({
      success: true,
      message: 'Student saved to Firebase',
      id: studentId,
      student,
      database: 'firebase'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Firebase error',
      error: error.message
    });
  }
});

// Get all students from Firebase
router.get('/firebase/students', async (req, res) => {
  try {
    if (!firestore) {
      return res.status(500).json({
        success: false,
        message: 'Firebase not connected'
      });
    }

    const collection = firestore.collection('students');
    const snapshot = await collection.get();

    const students = [];
    snapshot.forEach(doc => {
      students.push({
        firebaseId: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: students.length,
      database: 'firebase',
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Firebase error',
      error: error.message
    });
  }
});

// Get single student from Firebase
router.get('/firebase/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!firestore) {
      return res.status(500).json({
        success: false,
        message: 'Firebase not connected'
      });
    }

    const collection = firestore.collection('students');
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in Firebase'
      });
    }

    res.json({
      success: true,
      database: 'firebase',
      student: {
        firebaseId: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Firebase error',
      error: error.message
    });
  }
});

// ========== BOTH DATABASES ==========

// Add student to both databases
router.post('/both/students', async (req, res) => {
  try {
    const { name, rollNumber, semester, email, phone, department } = req.body;

    // Validation
    if (!name || !rollNumber || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Name, rollNumber, and semester are required'
      });
    }

    const studentData = {
      name,
      rollNumber,
      semester: parseInt(semester),
      email: email || '',
      phone: phone || '',
      department: department || 'BBA'
    };

    const results = {
      mongodb: null,
      firebase: null
    };

    // Save to MongoDB
    try {
      const db = getMongoDB();
      const mongoCollection = db.collection('students');

      const mongoStudent = {
        ...studentData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mongoResult = await mongoCollection.insertOne(mongoStudent);
      results.mongodb = {
        success: true,
        id: mongoResult.insertedId.toString()
      };
    } catch (mongoError) {
      results.mongodb = {
        success: false,
        error: mongoError.message
      };
    }

    // Save to Firebase
    try {
      if (firestore) {
        const firebaseCollection = firestore.collection('students');
        const firebaseId = results.mongodb?.id || `student_${Date.now()}`;
        const docRef = firebaseCollection.doc(firebaseId);

        const firebaseStudent = {
          ...studentData,
          mongoId: results.mongodb?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          firebaseId: firebaseId
        };

        await docRef.set(firebaseStudent);
        results.firebase = {
          success: true,
          id: firebaseId
        };
      } else {
        results.firebase = {
          success: false,
          error: 'Firebase not available'
        };
      }
    } catch (firebaseError) {
      results.firebase = {
        success: false,
        error: firebaseError.message
      };
    }

    res.status(201).json({
      success: true,
      message: 'Student save attempt completed',
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving student',
      error: error.message
    });
  }
});

// Get students from both databases
router.get('/both/students', async (req, res) => {
  try {
    const results = {
      mongodb: { success: false, students: [], count: 0 },
      firebase: { success: false, students: [], count: 0 }
    };

    // Get from MongoDB
    try {
      const db = getMongoDB();
      const mongoCollection = db.collection('students');
      const mongoStudents = await mongoCollection.find({}).toArray();
      results.mongodb = {
        success: true,
        students: mongoStudents,
        count: mongoStudents.length
      };
    } catch (mongoError) {
      results.mongodb.error = mongoError.message;
    }

    // Get from Firebase
    try {
      if (firestore) {
        const firebaseCollection = firestore.collection('students');
        const snapshot = await firebaseCollection.get();
        const firebaseStudents = [];

        snapshot.forEach(doc => {
          firebaseStudents.push({
            firebaseId: doc.id,
            ...doc.data()
          });
        });

        results.firebase = {
          success: true,
          students: firebaseStudents,
          count: firebaseStudents.length
        };
      } else {
        results.firebase.error = 'Firebase not available';
      }
    } catch (firebaseError) {
      results.firebase.error = firebaseError.message;
    }

    res.json({
      success: true,
      message: 'Data retrieved from both databases',
      results,
      summary: {
        totalStudents: results.mongodb.count + results.firebase.count,
        databases: {
          mongodb: results.mongodb.success,
          firebase: results.firebase.success
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

// ========== CLEAR TEST DATA ==========

// Clear test data (development only)
router.delete('/clear-test-data', async (req, res) => {
  try {
    const results = {};

    // Clear MongoDB test data
    try {
      const db = getMongoDB();
      const mongoCollection = db.collection('students');
      const mongoResult = await mongoCollection.deleteMany({});
      results.mongodb = {
        deletedCount: mongoResult.deletedCount
      };
    } catch (mongoError) {
      results.mongodb = { error: mongoError.message };
    }

    // Clear Firebase test data
    try {
      if (firestore) {
        const firebaseCollection = firestore.collection('students');
        // Note: Firebase doesn't have deleteMany, would need batch delete
        results.firebase = {
          message: 'Firebase delete requires batch operation'
        };
      }
    } catch (firebaseError) {
      results.firebase = { error: firebaseError.message };
    }

    res.json({
      success: true,
      message: 'Test data cleared',
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing data',
      error: error.message
    });
  }
});

module.exports = router;