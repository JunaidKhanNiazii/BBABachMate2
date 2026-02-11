import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function IndustryDashboard() {
  const { currentUser } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '', company: '' });
  const [loading, setLoading] = useState(true);

  // Fetch job postings
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'jobPostings'));
      const jobs = [];
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      setJobPostings(jobs);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new job posting
  const addJobPosting = async () => {
    if (!newJob.title || !newJob.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addDoc(collection(db, 'jobPostings'), {
        ...newJob,
        postedBy: currentUser.uid,
        postedAt: new Date(),
        postedByEmail: currentUser.email
      });
      setNewJob({ title: '', description: '', company: '' });
      fetchJobPostings();
    } catch (error) {
      console.error('Error adding job posting:', error);
      alert('Failed to post job. Please try again.');
    }
  };

  // Delete job posting
  const deleteJobPosting = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await deleteDoc(doc(db, 'jobPostings', jobId));
      fetchJobPostings();
    } catch (error) {
      console.error('Error deleting job posting:', error);
      alert('Failed to delete job posting. Please try again.');
    }
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Industry Professional Dashboard</h1>
          <p>Welcome back, {currentUser?.email || 'User'}</p>
          <p className="text-blue-200">Connect, Collaborate, and Grow in Your Industry</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Postings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Job Postings</h3>

              {/* Add New Job Form */}
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Post a New Job</h4>
                <input
                  type="text"
                  placeholder="Job Title *"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Job Description *"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <button
                  onClick={addJobPosting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Post Job
                </button>
              </div>

              {/* Job Listings */}
              <div className="space-y-4">
                {jobPostings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No job postings yet. Create your first job posting above!</p>
                ) : (
                  jobPostings.map((job) => (
                    <div key={job.id} className="border p-4 rounded hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          {job.company && <p className="text-gray-600">{job.company}</p>}
                          <p className="text-sm mt-2 text-gray-700">{job.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Posted by: {job.postedByEmail || 'Anonymous'}
                          </p>
                        </div>
                        {job.postedBy === currentUser?.uid && (
                          <button
                            onClick={() => deleteJobPosting(job.id)}
                            className="text-red-600 hover:text-red-800 ml-4"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Industry Features */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Industry Tools</h3>
              <ul className="space-y-2">
                <li>• Project Management Hub</li>
                <li>• Resource Allocation</li>
                <li>• Team Collaboration</li>
                <li>• Performance Analytics</li>
                <li>• Industry Networking</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Create New Project
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                  View Reports
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                  Manage Team
                </button>
                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">
                  Network
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <p>• Posted a new job opening</p>
                <p>• Connected with 3 professionals</p>
                <p>• Updated project status</p>
                <p>• Received 2 new messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndustryDashboard;