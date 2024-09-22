import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      console.error('Login error:', error);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
    } catch (error) {
      setError('ログアウトに失敗しました。');
      console.error('Logout error:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('アカウント作成に失敗しました。');
      console.error('Sign up error:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};