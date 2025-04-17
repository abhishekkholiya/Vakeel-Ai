<<<<<<< HEAD
import { initializeApp, getApps } from 'firebase/app';
=======
import { initializeApp } from 'firebase/app';
>>>>>>> af91508c8e16bd48362bf33da3169e58c9a5b667
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

<<<<<<< HEAD
// Ensure Firebase app is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
=======
const app = initializeApp(firebaseConfig);
>>>>>>> af91508c8e16bd48362bf33da3169e58c9a5b667
export const auth = getAuth(app);