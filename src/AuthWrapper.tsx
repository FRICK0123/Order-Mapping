/* eslint-disable @typescript-eslint/no-explicit-any */
// src/AuthWrapper.tsx
import { JSX, useEffect, useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function AuthWrapper({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Login Error:", error);
    });
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">Please sign in with Google</p>
          <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={handleSignOut} className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-1000">
        Sign Out
      </button>
      {children}
    </div>
  );
}
