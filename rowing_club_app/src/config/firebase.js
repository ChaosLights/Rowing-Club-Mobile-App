// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5iZTJkn1K_APvVn5EYU9hI0wgMpr7IpQ",
  authDomain: "team12-rowingapp.firebaseapp.com",
  projectId: "team12-rowingapp",
  storageBucket: "team12-rowingapp.appspot.com",
  messagingSenderId: "768738451774",
  appId: "1:768738451774:web:b6f4f2ad673397172d8c6f",
  measurementId: "G-8PJE1WWPRC"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage persistence
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);