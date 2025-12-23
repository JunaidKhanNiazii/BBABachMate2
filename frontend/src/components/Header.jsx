import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = React.memo(() => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold hover:text-gray-200">
            BBA BachMate
          </Link>
          
          <nav className="flex space-x-6 items-center">
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            <Link to="/about" className="hover:text-gray-300 transition">About</Link>
            <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
            
            {currentUser ? (
              <>
                <span className="text-yellow-300">Welcome, {currentUser.email}</span>
                <Link 
                  to="/dashboard" 
                  className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
                <Link to="/register" className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition">Register</Link>
              </>
            )}
          </nav>
        </div>
        
       
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;