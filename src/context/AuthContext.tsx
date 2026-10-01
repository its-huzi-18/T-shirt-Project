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
  logout: () => Promise<void>;
  demoAdminLogin: () => void;
  updateUserProfile: (data: Partial<CustomerUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'huzaifawahab2005@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CustomerUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check admin rights
  const verifyAdmin = async (user: User | null): Promise<boolean> => {
    if (!user) return false;
    if (user.email === ADMIN_EMAIL) return true;

    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) return true;
    } catch {
      // ignore
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const isUserAdmin = await verifyAdmin(user);
        setIsAdmin(isUserAdmin);

        // Fetch user profile from firestore
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
          // If firestore read fails, fallback in-memory
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Customer',
            role: isUserAdmin ? 'admin' : 'customer',
          });
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
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
        role: email === ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setUserProfile(null);
  };

  // Demo admin login for immediate review/testing
  const demoAdminLogin = () => {
    setIsAdmin(true);
    setUserProfile({
      uid: 'demo-admin-uid',
      email: ADMIN_EMAIL,
      displayName: 'Huzaifa Wahab (Admin)',
      role: 'admin',
    });
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
        logout,
        demoAdminLogin,
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
