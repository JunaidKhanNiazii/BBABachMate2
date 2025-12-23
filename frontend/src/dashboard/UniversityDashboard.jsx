import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function UniversityDashboard() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '' });
  const [studyGroups, setStudyGroups] = useState([]);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const courseList = [];
      querySnapshot.forEach((doc) => {
        courseList.push({ id: doc.id, ...doc.data() });
      });
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Add new course
  const addCourse = async () => {
    if (!newCourse.name || !newCourse.code) return;
    try {
      await addDoc(collection(db, 'courses'), {
        ...newCourse,
        createdBy: currentUser.uid,
        createdAt: new Date()
      });
      setNewCourse({ name: '', code: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
        
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">University Student Dashboard</h1>
          <p>Welcome back, {currentUser.email}</p>
          <p className="text-green-200">Learn, Connect, and Excel in Your Academic Journey</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Management Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Course Management</h3>
              
              {/* Add New Course Form */}
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Add New Course</h4>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Course Description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full p-2 border rounded mb-2"
                  rows="3"
                />
                <button
                  onClick={addCourse}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Course
                </button>
              </div>
              
              {/* Course Listings */}
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border p-4 rounded">
                    <h4 className="font-semibold">{course.name}</h4>
                    <p className="text-gray-600">Code: {course.code}</p>
                    <p className="text-sm mt-2">{course.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Academic Features */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Academic Tools</h3>
              <ul className="space-y-2">
                <li>• Course Registration</li>
                <li>• Grade Tracking</li>
                <li>• Study Groups</li>
                <li>• Research Portal</li>
                <li>• Alumni Network</li>
              </ul>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Register for Courses
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  View Grades
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                  Join Study Group
                </button>
                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                  Research Portal
                </button>
              </div>
            </div>
            
            {/* Academic Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-2 text-sm">
                <p>• Mid-term Exams: Dec 15-20</p>
                <p>• Career Fair: Jan 10</p>
                <p>• Research Symposium: Jan 25</p>
                <p>• Alumni Meetup: Feb 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UniversityDashboard;