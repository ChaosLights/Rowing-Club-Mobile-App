/*import React from 'react';
import { useState, useEffect } from 'react';
import { db } from './src/config/firebase.js';
// rowing_club_app/src/config/firebase.js
// rowing_club_app/App.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ScreensContainer from './src/screensContainer';

export default function App() {
  // TEST USER VIEWS BY CHANGING global.user AND RELOADING THE APP
  global.user = "FWBWX7EOw75rwE20cQD2" //Coach
  //global.user = "0Iz45PGQ70hFnUpo6loC" //14-15 (Jason)
  //global.user = "YRhW9fMSA0hd6IixgLaO" //16-17 (Freddy)
  // global.user = "njxPjxAazoa9feL0eeKF" //18 and Older (Diana)
  //global.user = "hGSQNMnQa4Bjt0zb0L5i" //18 and Older (Jack)

  //const
  global.userTypeID

  // query for user type
  useEffect(() => {
    /// query for current user information
    const q = query(collection(db, "User"), where("__name__", "==", global.user));
    const querySnapshot = onSnapshot(q, (snapshot) => {
      global.userTypeID = snapshot.docs[0].data().TypeID
      console.log("Test 2: " + userTypeID);
    });
 
    // return cleanup function
    return () => querySnapshot(); 
}, [global.user]);

  return (
    <ScreensContainer/>
  );
}
*/

import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native'; // Added imports for View and Text
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/authContext';
import ScreensContainer from './src/screensContainer';
import LoginScreen from './src/screens/auth/login';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Use a method to update context here if needed
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <ScreensContainer />
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthProvider>
  );
}


