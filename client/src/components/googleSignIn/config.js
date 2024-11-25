// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQbtasdqdHMLKjKiinQaq4wto5xFOmdA8",
  authDomain: "login-3207d.firebaseapp.com",
  projectId: "login-3207d",
  storageBucket: "login-3207d.firebasestorage.app",
  messagingSenderId: "1095038246480",
  appId: "1:1095038246480:web:5e2c3a692d2ccb64893b55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const messaging = getMessaging(app);
export {googleAuth, googleProvider, getToken};