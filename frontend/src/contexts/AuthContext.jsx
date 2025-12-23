import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with role (simplified - roles assigned by admins later)
  async function register(email, password, role = 'pending', additionalData = {}) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: email.split('@')[0]
      });

      // Save user data with default role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: role, // Default to 'pending' - admin approval needed
        status: 'pending', // pending, approved, rejected
        createdAt: new Date(),
        ...additionalData
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user role from Firestore
  async function getUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          role: userData.role || 'pending',
          status: userData.status || 'pending',
          displayName: userData.displayName,
          ...userData
        };
      }
      return { role: 'pending', status: 'pending' };
    } catch (error) {
      console.error('Error getting user role:', error);
      return { role: 'pending', status: 'pending' };
    }
  }

  // Admin functions for role management
  async function updateUserRole(userId, newRole) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update roles');
    }

    try {
      await setDoc(doc(db, 'users', userId), {
        role: newRole,
        status: 'approved',
        approvedBy: currentUser.uid,
        approvedAt: new Date()
      }, { merge: true });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function getPendingUsers() {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view pending users');
    }

    try {
      const q = query(collection(db, 'users'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const pendingUsers = [];
      querySnapshot.forEach((doc) => {
        pendingUsers.push({ id: doc.id, ...doc.data() });
      });
      return pendingUsers;
    } catch (error) {
      console.error('Error getting pending users:', error);
      return [];
    }
  }

  async function approveUser(userId, role) {
    return updateUserRole(userId, role);
  }

  async function rejectUser(userId) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can reject users');
    }

    try {
      await setDoc(doc(db, 'users', userId), {
        status: 'rejected',
        rejectedBy: currentUser.uid,
        rejectedAt: new Date()
      }, { merge: true });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserRole(user.uid);
        setCurrentUser({
          ...user,
          role: userData.role,
          status: userData.status,
          displayName: userData.displayName
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUserRole,
    getPendingUsers,
    approveUser,
    rejectUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}