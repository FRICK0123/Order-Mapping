// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCz5BXhbtQ6yyc4O2-SzVBjMkEM5b1028c",
  authDomain: "marketing-intelligence-c75b5.firebaseapp.com",
  projectId: "marketing-intelligence-c75b5",
  storageBucket: "marketing-intelligence-c75b5.firebasestorage.app",
  messagingSenderId: "99714293170",
  appId: "1:99714293170:web:1c56cff52e613d5c7958ab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
