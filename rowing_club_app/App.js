import React from 'react';
import { useState, useEffect } from 'react';
import { db } from './src/config/firebase.js';
// rowing_club_app/src/config/firebase.js
// rowing_club_app/App.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ScreensContainer from './src/screensContainer';

export default function App() {
  // TEST USER VIEWS BY CHANGING global.user AND RELOADING THE APP
  global.user = "FWBWX7EOw75rwE20cQD2" //Coach
  // global.user = "0Iz45PGQ70hFnUpo6loC" //14-15
  // global.user = "njxPjxAazoa9feL0eeKF" //18 and Older

  //const
  global.userTypeID

  // query for user type
  useEffect(() => {
    // query for current user information
    const q = query(collection(db, "User"), where("__name__", "==", global.user));
    const querySnapshot = onSnapshot(q, (snapshot) => {
      global.userTypeID = snapshot.docs[0].data().TypeID
    });

    // return cleanup function
    return () => querySnapshot();
}, [global.user]);

  return (
    <ScreensContainer/>
  );
}
