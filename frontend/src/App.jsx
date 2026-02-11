import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OurServices = lazy(() => import('./pages/OurServices'));
const IndustryDashboard = lazy(() => import('./pages/dashboard/IndustryDashboard'));
const UniversityDashboard = lazy(() => import('./pages/dashboard/UniversityDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const PublicListing = lazy(() => import('./components/PublicListing'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-black">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-blue-600/20 rounded-2xl"></div>
      <div className="absolute inset-0 border-4 border-t-blue-600 rounded-2xl animate-spin"></div>
    </div>
    <p className="mt-8 text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] animate-pulse">Initializing Interface</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<OurServices />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Public Listings (Now protected) */}
              <Route path="jobs" element={<ProtectedRoute><PublicListing title="Jobs" endpoint="/industry/jobs" /></ProtectedRoute>} />
              <Route path="internships" element={<ProtectedRoute><PublicListing title="Internships" endpoint="/industry/internships" /></ProtectedRoute>} />
              <Route path="speakers" element={<ProtectedRoute><PublicListing title="Guest Speakers" endpoint="/industry/speakers" /></ProtectedRoute>} />
              <Route path="research" element={<ProtectedRoute><PublicListing title="Research Papers" endpoint="/industry/research" /></ProtectedRoute>} />
              <Route path="challenges" element={<ProtectedRoute><PublicListing title="Challenges" endpoint="/industry/challenges" /></ProtectedRoute>} />

              <Route path="fyps" element={<ProtectedRoute><PublicListing title="Final Year Projects" endpoint="/university/fyps" /></ProtectedRoute>} />
              <Route path="projects" element={<ProtectedRoute><PublicListing title="Semester Projects" endpoint="/university/projects" /></ProtectedRoute>} />
              <Route path="courses" element={<ProtectedRoute><PublicListing title="Courses" endpoint="/university/courses" /></ProtectedRoute>} />
              <Route path="trainings" element={<ProtectedRoute><PublicListing title="Trainings" endpoint="/university/trainings" /></ProtectedRoute>} />
              <Route path="collaborations" element={<ProtectedRoute><PublicListing title="Collaborations" endpoint="/university/collaborations" /></ProtectedRoute>} />

            </Route>

            {/* Protected dashboard routes - Outside Layout to prevent header conflict */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />

            <Route path="dashboard/industry" element={
              <ProtectedRoute allowedRoles={['industry']}>
                <IndustryDashboard />
              </ProtectedRoute>
            } />

            <Route path="dashboard/university" element={
              <ProtectedRoute allowedRoles={['university']}>
                <UniversityDashboard />
              </ProtectedRoute>
            } />

            <Route path="dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;