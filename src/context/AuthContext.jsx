// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInAnonymously,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext();

export const translateAuthError = (err) => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
  if (!apiKey || apiKey === "AIzaSyDummyKeyForCompilationPurposeOnly") {
    return "Configuration Error: Firebase environment variables are missing on this host. If you deployed to Vercel, please add VITE_FIREBASE_API_KEY and other Firebase variables to your Vercel Project Settings.";
  }

  if (!err || !err.code) {
    return err?.message || "An unexpected authentication error occurred. Please try again.";
  }

  switch (err.code) {
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return "The application security credentials are invalid. Please contact the administrator.";
    case 'auth/network-request-failed':
      return "Network connection unavailable. Please check your internet connection and try again.";
    case 'auth/popup-blocked':
      return "The Google authentication popup was blocked by your browser. Please allow popups for this site.";
    case 'auth/popup-closed-by-user':
      return "Authentication was cancelled because the sign-in window was closed.";
    case 'auth/unauthorized-domain':
      return "This domain is not authorized for Firebase Authentication. Please check your console settings.";
    case 'auth/user-disabled':
      return "This account has been disabled. Please contact support.";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "Invalid email address or password. Please verify your credentials.";
    case 'auth/email-already-in-use':
      return "An account already exists with this email address.";
    case 'auth/weak-password':
      return "Your password is too weak. Please choose a password with at least 6 characters.";
    case 'auth/operation-not-allowed':
      return "The requested sign-in method is not enabled. Please check Firebase console configuration.";
    default:
      return `Authentication failed: ${err.message || 'please verify your input.'}`;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Initialize and listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Fetch user profile from Firestore users collection
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDocSnap = await getDoc(userDocRef);
        
        let profile = null;
        if (userDocSnap.exists()) {
          profile = userDocSnap.data();
        } else {
          // Initialize user profile in Firestore
          profile = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Guest Ascender",
            join_date: new Date().toISOString().split('T')[0],
            age: 24,
            gender: "Male",
            height_cm: 180,
            weight_kg: 75,
            goal_description: "I want to track and refine my facial posture & skin routines.",
            focus_area: "",
            previous_experience: "Beginner",
            is_premium: false,
            xp: 100,
            level: 1,
            days_to_ascend: 0,
            streak: 0,
            longest_streak: 0,
            unlocked_badges: ['first_step'],
            preferences: {
              morningReminder: true,
              nightReminder: true,
              weeklyDigest: true
            }
          };
          await setDoc(userDocRef, profile);
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'guest@ascend.app',
          profile: profile
        });

        // User is onboarded if focus_area is defined
        if (profile && profile.focus_area) {
          setIsOnboarded(true);
        } else {
          setIsOnboarded(false);
        }
      } else {
        setUser(null);
        setIsOnboarded(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      console.error("AuthContext Login Error:", err);
      throw new Error(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      console.error("AuthContext Signup Error:", err);
      throw new Error(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err) {
      console.error("AuthContext Google Login Error:", err);
      throw new Error(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymous = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      return true;
    } catch (err) {
      console.error("AuthContext Guest Login Error:", err);
      throw new Error(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("AuthContext Logout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (profileData) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedProfile = { ...user.profile, ...profileData };
      await setDoc(userDocRef, updatedProfile);
      
      setUser(prev => ({ ...prev, profile: updatedProfile }));
      setIsOnboarded(true);
    } catch (err) {
      console.error("AuthContext Onboarding Completion Error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      loginGoogle,
      loginAnonymous,
      logout, 
      isOnboarded, 
      completeOnboarding, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
