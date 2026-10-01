import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { CustomerUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: CustomerUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  adminLogout: () => void;
  updateUserProfile: (data: Partial<CustomerUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment variable admin configuration
const ENV_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@haclothing.com').trim().toLowerCase();
const ENV_ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'HAclothing@2026').trim();

const ADMIN_SESSION_KEY = 'ha_clothing_admin_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CustomerUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check Firestore admin document if user is signed in with Firebase
  const verifyFirebaseAdmin = async (user: User | null): Promise<boolean> => {
    if (!user) return false;
    if (user.email?.toLowerCase() === ENV_ADMIN_EMAIL) return true;

    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) return true;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && (userDoc.data() as CustomerUser).role === 'admin') return true;
    } catch {
      // ignore
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const isUserAdmin = await verifyFirebaseAdmin(user);
        if (isUserAdmin) {
          setIsAdmin(true);
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
        }

        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as CustomerUser);
          } else {
            const newProfile: CustomerUser = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Customer',
              role: isUserAdmin ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setUserProfile(newProfile);
          }
        } catch {
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Customer',
            role: isUserAdmin ? 'admin' : 'customer',
          });
        }
      } else {
        // If not logged in via Firebase, check if session storage admin token is active
        const hasSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
        setIsAdmin(hasSession);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(cred.user, { displayName: name });
      const newProfile: CustomerUser = {
        uid: cred.user.uid,
        email,
        displayName: name,
        phone: phone || '',
        role: email.toLowerCase() === ENV_ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  // Environment-based & Firebase verified admin authentication
  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Check against environment variables
    const matchesEnv = cleanEmail === ENV_ADMIN_EMAIL && cleanPass === ENV_ADMIN_PASSWORD;

    if (matchesEnv) {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      return { success: true };
    }

    // 2. Fallback to Firebase email/password authentication
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const isFbAdmin = await verifyFirebaseAdmin(userCred.user);
      if (isFbAdmin) {
        setIsAdmin(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
        return { success: true };
      }
      // If not an admin in database:
      await signOut(auth);
      return { success: false, error: 'Invalid email or password' };
    } catch {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const adminLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    signOut(auth).catch(() => {});
  };

  const logout = async () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    await signOut(auth);
    setIsAdmin(false);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<CustomerUser>) => {
    if (!currentUser && !userProfile) return;
    const uid = currentUser?.uid || userProfile?.uid || 'guest';
    const updated = { ...userProfile, ...data } as CustomerUser;
    setUserProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', uid), updated, { merge: true });
      } catch (err) {
        console.warn('Could not update profile in firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        adminLogin,
        logout,
        adminLogout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
