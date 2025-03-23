// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChe1BZHy8BHU3C-BfEKEuGdHcGhejjqz0",
  authDomain: "eportal-e5955.firebaseapp.com",
  projectId: "eportal-e5955",
  storageBucket: "eportal-e5955.firebasestorage.app",
  messagingSenderId: "517384115989",
  appId: "1:517384115989:web:4838205708c29cdba57b1c",
  measurementId: "G-6SHMD5BV4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
