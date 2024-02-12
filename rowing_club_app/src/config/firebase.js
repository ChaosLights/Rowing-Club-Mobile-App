// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
// const analytics = getAnalytics(app);