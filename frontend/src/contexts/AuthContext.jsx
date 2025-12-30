import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false); // New state for profile fetch

  // Register
  async function register(email, password, role, profileData) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Wait for user prop to be available
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user creation failed");

      const response = await api.post('/auth/register', {
        role,
        profile: profileData
      });

      if (response.data.success) {
        setUserProfile(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: 'Failed to create user profile in database.' };
      }
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  }

  // Login
  async function login(email, password) {
    try {
      setProfileLoading(true); // Expect profile fetch
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      setProfileLoading(false);
      return { success: false, error: error.message };
    }
  }

  // Logout
  function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  // Fetch User Profile from Backend
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Don't auto-logout on 404 - let user stay logged in to complete registration
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setProfileLoading(true);
        await fetchUserProfile();
        setProfileLoading(false);
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading, // Initial load
    profileLoading, // Transitions
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}